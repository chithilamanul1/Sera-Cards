import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getUserFromMemory } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

const OWNER_WA = (process.env.OWNER_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');
const RATE_LIMIT_MAP = new Map<string, number>();

async function getLeadAuth(request: Request) {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  if (session && session.value === 'authenticated') {
    return { isAdmin: true };
  }
  const authHeader = request.headers.get('x-admin-secret');
  if (authHeader && authHeader === process.env.ADMIN_SECRET) {
    return { isAdmin: true };
  }

  const userSession = cookieStore.get('user_session')?.value;
  if (userSession) {
    let user: any = null;
    try {
      user = await Promise.race([
        prisma.user.findUnique({
          where: { id: userSession },
          select: { id: true, email: true, role: true, cardSlug: true },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
    } catch {}
    if (!user) user = getUserFromMemory(userSession);
    if (user) {
      return { isAdmin: user.role === 'ADMIN', user };
    }
  }

  return { isAdmin: false, user: null };
}

// Simple in-memory rate limiter: max 3 submissions per phone per 10 minutes
function isRateLimited(phone: string): boolean {
  const key = phone.replace(/[^0-9]/g, '').slice(-9);
  const now = Date.now();
  const last = RATE_LIMIT_MAP.get(key) ?? 0;
  if (now - last < 10 * 60 * 1000) return true;
  RATE_LIMIT_MAP.set(key, now);
  // Cleanup old entries every 100 calls
  if (RATE_LIMIT_MAP.size > 100) {
    for (const [k, t] of RATE_LIMIT_MAP) {
      if (now - t > 10 * 60 * 1000) RATE_LIMIT_MAP.delete(k);
    }
  }
  return false;
}

// GET /api/leads — Fetch leads (admin: all or filtered by slug; customer: scoped to their cardSlug)
export async function GET(request: Request) {
  const auth = await getLeadAuth(request);
  if (!auth.isAdmin && !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const querySlug = searchParams.get('slug');

  let targetSlug: string | undefined = undefined;
  if (auth.isAdmin) {
    targetSlug = querySlug ? querySlug.toLowerCase().trim() : undefined;
  } else if (auth.user) {
    if (!auth.user.cardSlug) return NextResponse.json([]);
    targetSlug = auth.user.cardSlug.toLowerCase().trim();
  }

  try {
    const leads = await prisma.lead.findMany({
      where: targetSlug ? { clientSlug: targetSlug } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// DELETE /api/leads — Delete a specific lead (admin or card owner)
export async function DELETE(request: Request) {
  const auth = await getLeadAuth(request);
  if (!auth.isAdmin && !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  let leadId = searchParams.get('id');

  if (!leadId) {
    try {
      const body = await request.json();
      leadId = body?.id;
    } catch {}
  }

  if (!leadId) {
    return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!auth.isAdmin && auth.user) {
      if (lead.clientSlug !== auth.user.cardSlug) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    await prisma.lead.delete({
      where: { id: leadId },
    });

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete lead:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete lead' }, { status: 500 });
  }
}

// POST /api/leads — Public 2-way lead capture from any digital card
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, name, phone, notes, ownerWhatsapp } = body;

    if (!slug || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, name, or phone' },
        { status: 400 }
      );
    }

    const cleanSlug = String(slug).toLowerCase().trim();
    const cleanName = String(name).trim().slice(0, 100);
    const cleanPhone = String(phone).trim().slice(0, 30);
    const cleanNotes = notes ? String(notes).trim().slice(0, 500) : null;

    // Rate-limit by phone number
    if (isRateLimited(cleanPhone)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few minutes.' },
        { status: 429 }
      );
    }

    // Verify the card slug exists
    const card = await prisma.client.findUnique({
      where: { slug: cleanSlug },
      select: { id: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Persist the lead
    const lead = await prisma.lead.create({
      data: {
        clientSlug: cleanSlug,
        name: cleanName,
        phone: cleanPhone,
        notes: cleanNotes,
      },
    });

    // Build WhatsApp deep-link for the owner notification
    const targetOwnerWhatsapp =
      (ownerWhatsapp ? String(ownerWhatsapp).replace(/[^0-9]/g, '') : '') || OWNER_WA;

    const waText = [
      `🔥 *New Lead Alert — Sera Cards*`,
      ``,
      `*Name:* ${cleanName}`,
      `*Phone:* ${cleanPhone}`,
      `*Card Profile:* ${cleanSlug}`,
      cleanNotes ? `*Note:* ${cleanNotes}` : null,
      ``,
      `_(Captured live on your Sera digital profile)_`,
    ]
      .filter(Boolean)
      .join('\n');

    const ownerNotifyUrl = targetOwnerWhatsapp
      ? `https://wa.me/${targetOwnerWhatsapp}?text=${encodeURIComponent(waText)}`
      : null;

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      ownerNotifyUrl,
      message: 'Contact shared successfully!',
    });
  } catch (error) {
    console.error('Failed to capture lead:', error);
    return NextResponse.json({ error: 'Failed to record lead' }, { status: 500 });
  }
}
