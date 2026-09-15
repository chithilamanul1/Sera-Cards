import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { cookies } from 'next/headers';

// Helper to check auth
function isAuthorized(request: Request) {
  const session = cookies().get('admin_session');
  if (session && session.value === 'authenticated') {
    return true;
  }
  
  const authHeader = request.headers.get('x-admin-secret');
  return authHeader === process.env.ADMIN_SECRET;
}

// GET /api/cards — List all cards with lead counts
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cards = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { leads: true },
        },
      },
    });
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// POST /api/cards — Create or update (upsert) a card by slug
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug, html_content } = await request.json();

    if (!slug || !html_content) {
      return NextResponse.json({ error: 'Missing slug or html_content' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    const card = await prisma.client.upsert({
      where: { slug: cleanSlug },
      update: { htmlContent: html_content },
      create: {
        slug: cleanSlug,
        htmlContent: html_content,
      },
    });

    return NextResponse.json(card);
  } catch (error: any) {
    console.error('Failed to upsert card:', error);
    return NextResponse.json({ error: 'Failed to save card', details: error.message || String(error) }, { status: 500 });
  }
}
