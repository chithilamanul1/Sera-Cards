import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mail';
import { saveUserToMemory, getUserFromMemory } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, cardSlug } = body;

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 2. Check existing user in memory or DB
    const memoryUser = getUserFromMemory(cleanEmail);
    if (memoryUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    let existingDbUser = null;
    try {
      existingDbUser = await Promise.race([
        prisma.user.findUnique({
          where: { email: cleanEmail },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
      ]);
    } catch (err: any) {
      console.warn('[Register] DB read check error/timeout:', err?.message);
    }

    if (existingDbUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // 3. Normalize slug
    const fallbackSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
    const chosenSlug = (cardSlug || fallbackSlug).toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);

    // 4. Hash password
    const passwordHash = hashPassword(password);

    // 5. Attempt creation in MongoDB with resilient fallback
    let newUser: any = null;
    try {
      newUser = await Promise.race([
        prisma.user.create({
          data: {
            name: name.trim(),
            email: cleanEmail,
            phone: phone ? phone.trim() : null,
            passwordHash,
            role: 'USER',
            plan: 'BASIC',
            cardSlug: chosenSlug,
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
      ]);
    } catch (dbErr: any) {
      console.warn('[Register] MongoDB direct write fallback engaged:', dbErr?.message);
    }

    // If DB is offline or timed out, create resilient fallback user
    if (!newUser) {
      const syntheticId = 'usr_' + Date.now() + Math.random().toString(36).slice(2, 8);
      newUser = {
        id: syntheticId,
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: 'USER',
        plan: 'BASIC',
        cardSlug: chosenSlug,
        createdAt: new Date().toISOString(),
      };
    }

    // Save in resilient memory store
    saveUserToMemory({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      passwordHash: newUser.passwordHash,
      role: newUser.role,
      plan: newUser.plan,
      cardSlug: newUser.cardSlug,
      createdAt: newUser.createdAt?.toString() || new Date().toISOString(),
    });

    // 6. Set user session cookie (30 days)
    cookies().set({
      name: 'user_session',
      value: newUser.id,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    // 7. Dispatch Welcome Email via Resend (non-blocking)
    sendWelcomeEmail({
      to: cleanEmail,
      name: newUser.name,
      email: cleanEmail,
      slug: chosenSlug,
    }).catch((emailErr) => {
      console.warn('[Register] Welcome email delivery warning:', emailErr?.message);
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        cardSlug: newUser.cardSlug,
        plan: newUser.plan,
      },
    });
  } catch (error: any) {
    console.error('[Register API] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to complete registration.' },
      { status: 500 }
    );
  }
}
