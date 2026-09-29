import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin_session')?.value;
    const userSession = cookieStore.get('user_session')?.value;

    if (adminSession === 'authenticated') {
      return NextResponse.json({
        authenticated: true,
        role: 'ADMIN',
        user: {
          name: 'Super Admin',
          email: process.env.ADMIN_EMAIL || 'chithilamanul1@gmail.com',
          role: 'ADMIN',
        },
      });
    }

    if (userSession) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userSession },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            plan: true,
            cardSlug: true,
            createdAt: true,
          },
        });

        if (user) {
          return NextResponse.json({
            authenticated: true,
            role: user.role,
            user,
          });
        }
      } catch (err) {
        console.warn('[Auth Me] User fetch warning:', err);
      }
    }

    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
