import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to check admin authorization
function isAuthorized(request: Request) {
  const authHeader = request.headers.get('x-admin-secret');
  return authHeader === process.env.ADMIN_SECRET;
}

// GET /api/leads - Fetch captured leads (admin only)
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
      take: 100,
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads - Public 2-way lead capture from digital card
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, name, phone, notes } = body;

    if (!slug || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields: slug, name, or phone' }, { status: 400 });
    }

    const cleanSlug = String(slug).toLowerCase().trim();
    const cleanName = String(name).trim().slice(0, 100);
    const cleanPhone = String(phone).trim().slice(0, 30);
    const cleanNotes = notes ? String(notes).trim().slice(0, 500) : null;

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { slug: cleanSlug },
      select: { id: true, slug: true },
    });

    const lead = await prisma.lead.create({
      data: {
        clientSlug: cleanSlug,
        name: cleanName,
        phone: cleanPhone,
        notes: cleanNotes,
      },
    });

    // Formulate a pre-formatted WhatsApp alert notification string
    const alertMessage = `🔥 *New Lead Alert on Sera Cards!*%0A%0A*Name:* ${encodeURIComponent(cleanName)}%0A*Phone:* ${encodeURIComponent(cleanPhone)}%0A*Card Slug:* ${cleanSlug}${cleanNotes ? `%0A*Note:* ${encodeURIComponent(cleanNotes)}` : ''}%0A%0ASent via Sera Cards Lead Capture Engine`;

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      alertMessage,
      message: 'Contact shared successfully!',
    });
  } catch (error) {
    console.error('Failed to capture lead:', error);
    return NextResponse.json({ error: 'Failed to record lead' }, { status: 500 });
  }
}
