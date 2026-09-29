import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Super Admin Credentials
    const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'chithilamanul1@gmail.com').toLowerCase();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chithila123@';

    if (cleanEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
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

    // 2. Check Customer / User in MongoDB
    try {
      const user = await Promise.race([
        prisma.user.findUnique({
          where: { email: cleanEmail },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
      ]) as any;

      if (user && verifyPassword(password, user.passwordHash)) {
        // Set user session cookie
        cookies().set({
          name: 'user_session',
          value: user.id,
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

        const redirect = user.role === 'ADMIN' ? '/admin' : '/dashboard';

        return NextResponse.json({
          success: true,
          role: user.role,
          redirect,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            cardSlug: user.cardSlug,
            plan: user.plan,
          },
        });
      }
    } catch (dbErr: any) {
      console.warn('[Login API] User DB lookup error:', dbErr?.message);
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
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
