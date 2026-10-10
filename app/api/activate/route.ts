import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { getActivation, claimActivation, createBatchCodes, getAllActivations } from '@/lib/activationStore';
import { saveUserToMemory, getUserFromMemory } from '@/lib/userStore';
import { saveCardToMemory } from '@/lib/cardStore';
import { generateTemplateHtml } from '@/lib/templates';

export const dynamic = 'force-dynamic';

// GET /api/activate?code=SERA-XXXX
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const action = searchParams.get('action');

  // Admin listing all codes
  if (action === 'list') {
    const adminSession = cookies().get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const all = getAllActivations();
    return NextResponse.json(all);
  }

  if (!code) {
    return NextResponse.json({ error: 'Activation code is required' }, { status: 400 });
  }

  const record = await getActivation(code);
  if (!record) {
    return NextResponse.json({
      valid: false,
      error: 'Invalid activation code. Please check the code on your physical card or packaging.',
    });
  }

  return NextResponse.json({
    valid: true,
    code: record.code,
    status: record.status,
    batch: record.batch,
    assignedSlug: record.assignedSlug || null,
  });
}

// POST /api/activate
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, count = 10, prefix = 'SERA', batch = 'BATCH-1' } = body;

    // 1. Admin bulk generation of codes
    if (action === 'generate') {
      const adminSession = cookies().get('admin_session')?.value;
      if (adminSession !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const created = await createBatchCodes(Number(count) || 10, prefix, batch);
      return NextResponse.json({ success: true, count: created.length, codes: created });
    }

    // 2. User claiming a physical card
    const { code, name, email, password, slug, phone } = body;

    if (!code || !name || !email || !password || !slug) {
      return NextResponse.json(
        { error: 'All fields (code, name, email, password, card handle) are required.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);

    // Verify activation code
    const record = await getActivation(cleanCode);
    if (!record) {
      return NextResponse.json({ error: 'Activation code does not exist.' }, { status: 404 });
    }

    if (record.status === 'ACTIVATED') {
      return NextResponse.json(
        {
          error: `This card has already been activated for @${record.assignedSlug}. Please log in to edit your profile.`,
        },
        { status: 400 }
      );
    }

    // Register or fetch user
    let user = getUserFromMemory(cleanEmail);
    if (!user) {
      try {
        user = await Promise.race([
          prisma.user.findUnique({ where: { email: cleanEmail } }),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
        ]);
      } catch {}
    }

    const passwordHash = hashPassword(password);
    let userId: string = user?.id || `usr_${Date.now()}`;

    if (!user) {
      try {
        const createdDbUser = await Promise.race([
          prisma.user.create({
            data: {
              name: name.trim(),
              email: cleanEmail,
              phone: phone ? phone.trim() : null,
              passwordHash,
              role: 'USER',
              plan: 'PRO',
              cardSlug: cleanSlug,
            },
          }),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
        ]);
        if (createdDbUser?.id) userId = createdDbUser.id;
      } catch {}

      saveUserToMemory({
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: 'USER',
        plan: 'PRO',
        cardSlug: cleanSlug,
        createdAt: new Date().toISOString(),
      });
    }

    // Set user session cookie (30 days)
    cookies().set({
      name: 'user_session',
      value: String(userId),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });

    // Generate initial live card profile
    const initialHtml = generateTemplateHtml('personal_hero', {
      slug: cleanSlug,
      name: name.trim(),
      title: 'Professional',
      company: 'Sera Cards',
      phone: phone || '',
      whatsapp: (phone || '').replace(/[^0-9]/g, ''),
      email: cleanEmail,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: `Welcome to ${name.trim()}'s official digital business card. Tap connect to exchange details!`,
      location: 'Colombo, Sri Lanka',
      website: `https://${cleanSlug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk'}`,
    });

    // Save to card store
    saveCardToMemory(cleanSlug, initialHtml, {
      name: name.trim(),
      email: cleanEmail,
      slug: cleanSlug,
      phone: phone || '',
    });

    // Also persist card to DB in background
    try {
      await Promise.race([
        prisma.client.upsert({
          where: { slug: cleanSlug },
          update: { htmlContent: initialHtml },
          create: { slug: cleanSlug, htmlContent: initialHtml },
        }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
    } catch {}

    // Mark code as claimed
    await claimActivation(cleanCode, userId, cleanSlug);

    return NextResponse.json({
      success: true,
      message: 'Card successfully activated! Your digital identity is live.',
      slug: cleanSlug,
      redirect: '/dashboard',
    });
  } catch (error: any) {
    console.error('Activation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to activate card.' }, { status: 500 });
  }
}
