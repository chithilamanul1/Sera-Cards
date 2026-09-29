import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { getUserFromMemory, saveUserToMemory } from '@/lib/userStore';

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
      let user: any = null;
      try {
        user = await Promise.race([
          prisma.user.findUnique({
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
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
        ]);

        if (user) {
          saveUserToMemory(user);
        }
      } catch (err) {
        console.warn('[Auth Me] User fetch DB warning:', err);
      }

      if (!user) {
        user = getUserFromMemory(userSession);
      }

      if (user) {
        return NextResponse.json({
          authenticated: true,
          role: user.role,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            plan: user.plan,
            cardSlug: user.cardSlug,
            createdAt: user.createdAt,
          },
        });
      }
    }

    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
