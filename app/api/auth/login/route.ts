import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { getUserFromMemory, saveUserToMemory } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email or phone number and password are required' },
        { status: 400 }
      );
    }

    const rawInput = String(email).trim();
    const cleanEmail = rawInput.toLowerCase();

    // Extract digits for phone lookup (e.g. +94728382638 -> 94728382638 or 0728382638)
    const digitsOnly = rawInput.replace(/[^0-9]/g, '');
    const localPhone = digitsOnly.startsWith('94') ? '0' + digitsOnly.slice(2) : digitsOnly;
    const intlPhone = digitsOnly.startsWith('0') ? '94' + digitsOnly.slice(1) : digitsOnly;
    const plusIntlPhone = '+' + intlPhone;

    // 1. Check Super Admin Credentials (supports email or mobile 0728382638 / +94728382638)
    const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'chithilamanul1@gmail.com').toLowerCase();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chithila123@';
    const ADMIN_PHONE = (process.env.ADMIN_PHONE || '0728382638').replace(/[^0-9]/g, '');

    const isAdminIdentifier =
      cleanEmail === ADMIN_EMAIL ||
      (digitsOnly && (digitsOnly === ADMIN_PHONE || digitsOnly === '94728382638' || localPhone === '0728382638'));

    if (isAdminIdentifier && password === ADMIN_PASSWORD) {
      cookies().set({
        name: 'admin_session',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      });

      return NextResponse.json({
        success: true,
        role: 'ADMIN',
        redirect: '/admin',
      });
    }

    // 2. Check Customer / User in MongoDB or Memory Store by Email, Phone, or Card Slug
    let user: any = null;
    const searchConditions: any[] = [
      { email: cleanEmail },
      { cardSlug: cleanEmail },
    ];

    if (digitsOnly.length >= 7) {
      searchConditions.push(
        { phone: rawInput },
        { phone: localPhone },
        { phone: intlPhone },
        { phone: plusIntlPhone }
      );
    }

    try {
      user = await Promise.race([
        prisma.user.findFirst({
          where: {
            OR: searchConditions,
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500)),
      ]) as any;

      if (user) {
        saveUserToMemory(user);
      }
    } catch (dbErr: any) {
      console.warn('[Login API] User DB lookup warning:', dbErr?.message);
    }

    // Check memory store if DB lookup failed
    if (!user) {
      user =
        getUserFromMemory(cleanEmail) ||
        (digitsOnly ? getUserFromMemory(localPhone) : null) ||
        (digitsOnly ? getUserFromMemory(rawInput) : null);
    }

    if (user && verifyPassword(password, user.passwordHash)) {
      // Set user session cookie
      cookies().set({
        name: 'user_session',
        value: String(user.id),
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      });

      // Also if role is ADMIN in database, set admin_session
      if (user.role === 'ADMIN') {
        cookies().set({
          name: 'admin_session',
          value: 'authenticated',
          httpOnly: true,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax',
        });
      }

      // Check if user has completed onboarding
      const redirect = user.role === 'ADMIN' ? '/admin' : '/dashboard';

      return NextResponse.json({
        success: true,
        role: user.role,
        redirect,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          cardSlug: user.cardSlug,
          plan: user.plan,
        },
      });
    }

    return NextResponse.json(
      { message: 'Invalid email, phone number, or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[Login API] Server error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
