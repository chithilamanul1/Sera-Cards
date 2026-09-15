import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'chithilamanul1@gmail.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chithila123@';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set secure cookie for 30 days
      cookies().set({
        name: 'admin_session',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax'
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
