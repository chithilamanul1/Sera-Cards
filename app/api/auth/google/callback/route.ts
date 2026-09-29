import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mail';
import { saveUserToMemory, getUserFromMemory } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const host = request.headers.get('host') || 'card.seranex.lk';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  if (error || !code) {
    console.warn('[Google OAuth Callback] Error or missing code:', error);
    return NextResponse.redirect(new URL('/login?error=google_failed', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?error=google_not_configured', request.url));
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[Google OAuth Token Error]', tokenData);
      return NextResponse.redirect(new URL('/login?error=google_token_failed', request.url));
    }

    // 2. Fetch User Profile from Google
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileRes.json();

    if (!profileRes.ok || !profile.email) {
      console.error('[Google OAuth Profile Error]', profile);
      return NextResponse.redirect(new URL('/login?error=google_profile_failed', request.url));
    }

    const cleanEmail = profile.email.toLowerCase().trim();
    const userName = profile.name || profile.given_name || 'Google User';

    // 3. Check if user already exists in DB or Memory
    let user: any = null;
    try {
      user = await Promise.race([
        prisma.user.findUnique({
          where: { email: cleanEmail },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500)),
      ]);

      if (user) {
        saveUserToMemory(user);
      }
    } catch (dbErr: any) {
      console.warn('[Google OAuth] DB lookup warning:', dbErr?.message);
    }

    if (!user) {
      user = getUserFromMemory(cleanEmail);
    }

    // 4. If new user, provision them automatically
    if (!user) {
      const fallbackSlug = (profile.given_name || userName).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14);
      const chosenSlug = fallbackSlug || 'user' + Math.floor(Math.random() * 10000);
      const syntheticPasswordHash = hashPassword('google_oauth_' + (profile.sub || Math.random()));

      try {
        user = await Promise.race([
          prisma.user.create({
            data: {
              name: userName,
              email: cleanEmail,
              passwordHash: syntheticPasswordHash,
              role: 'USER',
              plan: 'BASIC',
              cardSlug: chosenSlug,
            },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
        ]);
      } catch (createErr: any) {
        console.warn('[Google OAuth] DB user create fallback:', createErr?.message);
      }

      if (!user) {
        user = {
          id: 'usr_g_' + (profile.sub || Date.now()),
          name: userName,
          email: cleanEmail,
          passwordHash: syntheticPasswordHash,
          role: 'USER',
          plan: 'BASIC',
          cardSlug: chosenSlug,
          createdAt: new Date().toISOString(),
        };
      }

      saveUserToMemory({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: null,
        passwordHash: user.passwordHash,
        role: user.role,
        plan: user.plan,
        cardSlug: user.cardSlug,
        createdAt: user.createdAt?.toString() || new Date().toISOString(),
      });

      // Send Welcome Email
      sendWelcomeEmail({
        to: cleanEmail,
        name: userName,
        email: cleanEmail,
        slug: user.cardSlug,
      }).catch((emailErr) => {
        console.warn('[Google OAuth] Welcome email warning:', emailErr?.message);
      });
    }

    // 5. Establish user session
    cookies().set({
      name: 'user_session',
      value: user.id,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

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

    // Redirect to destination
    const destination = user.role === 'ADMIN' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));
  } catch (error: any) {
    console.error('[Google OAuth Exception]', error);
    return NextResponse.redirect(new URL('/login?error=google_exception', request.url));
  }
}
