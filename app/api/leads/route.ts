import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const OWNER_WA = (process.env.OWNER_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');
const RATE_LIMIT_MAP = new Map<string, number>();

import { cookies } from 'next/headers';

function isAuthorized(request: Request) {
  const session = cookies().get('admin_session');
  if (session && session.value === 'authenticated') {
    return true;
  }
  
  const authHeader = request.headers.get('x-admin-secret');
  return authHeader === process.env.ADMIN_SECRET;
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

// GET /api/leads — Fetch all leads (admin only), optionally filter by ?slug=
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    const leads = await prisma.lead.findMany({
      where: slug ? { clientSlug: slug } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
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

    const cleanSlug   = String(slug).toLowerCase().trim();
    const cleanName   = String(name).trim().slice(0, 100);
    const cleanPhone  = String(phone).trim().slice(0, 30);
    const cleanNotes  = notes ? String(notes).trim().slice(0, 500) : null;

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
    // Dynamic per profile: uses the specific card owner's WhatsApp number!
    const targetOwnerWhatsapp = (ownerWhatsapp ? String(ownerWhatsapp).replace(/[^0-9]/g, '') : '') || OWNER_WA;

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
