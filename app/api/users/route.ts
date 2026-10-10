import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import {
  saveUserToMemory,
  getUserFromMemory,
  getAllUsersFromMemory,
  deleteUserFromMemory,
  updateUserInMemory,
  StoredUser,
} from '@/lib/userStore';
import { getTeamMemberBySlug } from '@/lib/teamStore';
import { sendAccountProvisionedEmail } from '@/lib/mail';
import { generateTemplateHtml } from '@/lib/templates';
import { saveCardToMemory } from '@/lib/cardStore';

export const dynamic = 'force-dynamic';

function getIsAdmin(): boolean {
  const cookieStore = cookies();
  return cookieStore.get('admin_session')?.value === 'authenticated';
}

// GET /api/users — List all user accounts (Admin only)
export async function GET(request: Request) {
  try {
    const isAdmin = getIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    let dbUsers: any[] = [];
    try {
      dbUsers = await Promise.race([
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
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
        new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
    } catch (err: any) {
      console.warn('[Users GET] DB lookup warning:', err?.message);
    }

    const memUsers = getAllUsersFromMemory();
    const existingEmails = new Set(dbUsers.map((u) => u.email.toLowerCase()));

    const merged = [
      ...dbUsers,
      ...memUsers
        .filter((mu) => !existingEmails.has(mu.email.toLowerCase()))
        .map((mu) => ({
          id: mu.id,
          name: mu.name,
          email: mu.email,
          phone: mu.phone,
          role: mu.role,
          plan: mu.plan,
          cardSlug: mu.cardSlug,
          createdAt: mu.createdAt,
        })),
    ];

    return NextResponse.json(merged);
  } catch (error: any) {
    console.error('[Users GET Error]', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users — Provision / Create new user login for a cardholder
export async function POST(request: Request) {
  try {
    const isAdmin = getIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required to provision accounts' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, phone, cardSlug, role = 'USER', plan = 'PRO' } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const cleanSlug = cardSlug ? cardSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '') : '';
    const passwordHash = hashPassword(password);
    const now = new Date().toISOString();

    let createdUser: any = null;

    // 1. Upsert into MongoDB
    try {
      createdUser = await Promise.race([
        prisma.user.upsert({
          where: { email: cleanEmail },
          update: {
            name: name.trim(),
            passwordHash,
            phone: phone ? phone.trim() : null,
            role,
            plan,
            cardSlug: cleanSlug || undefined,
          },
          create: {
            name: name.trim(),
            email: cleanEmail,
            passwordHash,
            phone: phone ? phone.trim() : null,
            role,
            plan,
            cardSlug: cleanSlug || null,
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500)),
      ]);
    } catch (dbErr: any) {
      console.warn('[Users Provision] DB upsert warning:', dbErr?.message);
    }

    // 2. Persist to memory store
    const storedUser: StoredUser = {
      id: createdUser?.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : null,
      passwordHash,
      role,
      plan,
      cardSlug: cleanSlug,
      createdAt: createdUser?.createdAt?.toISOString?.() || now,
    };
    saveUserToMemory(storedUser);

    // 3. Link with team member or auto-generate live digital card profile
    if (cleanSlug) {
      try {
        const teamMember = await getTeamMemberBySlug(cleanSlug);
        if (teamMember) {
          teamMember.userId = storedUser.id;
        }
      } catch {}

      // Automatically initialize and deploy their live digital card profile so /c/[slug] works instantly
      try {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
        const cardHtml = generateTemplateHtml('personal_hero', {
          slug: cleanSlug,
          name: name.trim(),
          title: plan === 'TEAMS' ? 'Corporate Associate' : 'Professional',
          company: 'Sera Cards',
          phone: phone ? phone.trim() : '',
          whatsapp: phone ? phone.replace(/[^0-9]/g, '') : '',
          email: cleanEmail,
          bio: `Welcome to ${name.trim()}'s official digital business card. Tap connect to exchange details!`,
          location: 'Colombo, Sri Lanka',
          website: `https://${cleanSlug}.${rootDomain}`,
        });

        saveCardToMemory(cleanSlug, cardHtml, {
          name: name.trim(),
          email: cleanEmail,
          slug: cleanSlug,
          phone: phone || '',
        });

        await Promise.race([
          prisma.client.upsert({
            where: { slug: cleanSlug },
            update: { htmlContent: cardHtml },
            create: { slug: cleanSlug, htmlContent: cardHtml },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
        ]);
      } catch (cardErr) {
        console.warn('[Users Provision] Client card profile auto-provision warning:', cardErr);
      }
    }

    // Dispatch Account Provisioning Email (non-blocking)
    try {
      await sendAccountProvisionedEmail({
        to: storedUser.email,
        name: storedUser.name,
        email: storedUser.email,
        password: password,
        slug: cleanSlug,
        plan: storedUser.plan,
      });
    } catch (mailErr) {
      console.warn('[User Provision Email Delivery Warning]:', mailErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        phone: storedUser.phone,
        role: storedUser.role,
        plan: storedUser.plan,
        cardSlug: storedUser.cardSlug,
        createdAt: storedUser.createdAt,
      },
      message: `Account for ${storedUser.name} (${storedUser.email}) provisioned successfully and confirmation email sent!`,
    });
  } catch (error: any) {
    console.error('[Users POST Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}

// PATCH /api/users — Update user credentials or details
export async function PATCH(request: Request) {
  try {
    const isAdmin = getIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { id, email, password, name, phone, plan, role, cardSlug } = body;

    if (!id && !email) {
      return NextResponse.json({ error: 'User ID or email is required' }, { status: 400 });
    }

    const updates: any = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone ? phone.trim() : null;
    if (plan) updates.plan = plan;
    if (role) updates.role = role;
    if (cardSlug !== undefined) updates.cardSlug = cardSlug ? cardSlug.toLowerCase().trim() : null;
    if (password && password.length >= 6) {
      updates.passwordHash = hashPassword(password);
    }

    // Update in DB
    try {
      if (id) {
        await prisma.user.update({
          where: { id },
          data: updates,
        });
      } else if (email) {
        await prisma.user.update({
          where: { email: email.toLowerCase().trim() },
          data: updates,
        });
      }
    } catch (err: any) {
      console.warn('[Users PATCH] DB update warning:', err?.message);
    }

    // Update in memory
    const identifier = id || email;
    updateUserInMemory(identifier, updates);

    return NextResponse.json({
      success: true,
      message: 'User account updated successfully',
    });
  } catch (error: any) {
    console.error('[Users PATCH Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users — Delete user account
export async function DELETE(request: Request) {
  try {
    const isAdmin = getIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json({ error: 'User ID or email is required' }, { status: 400 });
    }

    try {
      if (id) {
        await prisma.user.delete({ where: { id } });
      } else if (email) {
        await prisma.user.delete({ where: { email: email.toLowerCase().trim() } });
      }
    } catch (err: any) {
      console.warn('[Users DELETE] DB delete warning:', err?.message);
    }

    if (id) deleteUserFromMemory(id);
    if (email) deleteUserFromMemory(email);

    return NextResponse.json({ success: true, message: 'User account deleted' });
  } catch (error: any) {
    console.error('[Users DELETE Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
