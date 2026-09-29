import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mail';

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

    // 2. Check existing user
    let existingUser = null;
    try {
      existingUser = await Promise.race([
        prisma.user.findUnique({
          where: { email: cleanEmail },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
      ]);
    } catch (err: any) {
      console.warn('[Register] DB read check error/timeout:', err?.message);
    }

    if (existingUser) {
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

    // 5. Create user in MongoDB
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
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4500)),
      ]);
    } catch (dbErr: any) {
      console.error('[Register] DB creation failed:', dbErr);
      return NextResponse.json(
        { error: 'Database connection issue. Please check MongoDB configuration.' },
        { status: 503 }
      );
    }

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
      console.warn('[Register] Email delivery failed/simulated:', emailErr?.message);
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
