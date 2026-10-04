import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getUserFromMemory } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

interface AuthInfo {
  isAdmin: boolean;
  userId?: string;
  userEmail?: string;
  userCardSlug?: string;
}

// Helper to check auth and return role info
async function getAuthInfo(request: Request): Promise<AuthInfo> {
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session')?.value;
  const userSession = cookieStore.get('user_session')?.value;
  const authHeader = request.headers.get('x-admin-secret');

  if (adminSession === 'authenticated' || (authHeader && authHeader === process.env.ADMIN_SECRET)) {
    return { isAdmin: true };
  }

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
    } catch {
      // fallback to memory store
    }

    if (!user) {
      user = getUserFromMemory(userSession);
    }

    if (user) {
      if (user.role === 'ADMIN') {
        return { isAdmin: true, userId: user.id, userEmail: user.email, userCardSlug: user.cardSlug };
      }
      return { isAdmin: false, userId: user.id, userEmail: user.email, userCardSlug: user.cardSlug };
    }
  }

  return { isAdmin: false };
}

// Extract JSON metadata embedded in HTML comments: <!-- GOSERA_METADATA: {...} -->
function extractMetadata(html: string): any {
  if (!html) return null;
  const match = html.match(/<!--\s*GOSERA_METADATA:\s*({[\s\S]*?})\s*-->/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }
  return null;
}

// Embed or update JSON metadata in HTML
function embedMetadata(html: string, metadata: any): string {
  if (!metadata || typeof metadata !== 'object') return html;
  const serialized = `<!-- GOSERA_METADATA: ${JSON.stringify(metadata)} -->\n`;
  // If metadata comment already exists, replace it
  if (/<!--\s*GOSERA_METADATA:\s*{[\s\S]*?}\s*-->\n?/.test(html)) {
    return html.replace(/<!--\s*GOSERA_METADATA:\s*{[\s\S]*?}\s*-->\n?/, serialized);
  }
  return serialized + html;
}

// GET /api/cards — List cards (admin or user's own), or fetch single card with metadata by ?slug=
export async function GET(request: Request) {
  const auth = await getAuthInfo(request);
  const { searchParams } = new URL(request.url);
  const requestedSlug = searchParams.get('slug');

  // Single card lookup by slug (e.g. /api/cards?slug=kosala)
  if (requestedSlug) {
    const cleanSlug = requestedSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
    try {
      const card = await prisma.client.findUnique({
        where: { slug: cleanSlug },
        include: {
          _count: {
            select: { leads: true },
          },
        },
      });

      if (!card) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 });
      }

      const metadata = extractMetadata(card.htmlContent);
      return NextResponse.json({
        id: card.id,
        slug: card.slug,
        htmlContent: card.htmlContent,
        metadata,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        _count: card._count,
      });
    } catch (error: any) {
      console.error('Failed to fetch card by slug:', error);
      return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
    }
  }

  // Listing multiple cards requires authorization
  if (!auth.isAdmin && !auth.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // If admin, return all cards
    if (auth.isAdmin) {
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
    }

    // If customer, return their card(s)
    const userSlug = auth.userCardSlug;
    if (!userSlug) {
      return NextResponse.json([]);
    }

    const cards = await prisma.client.findMany({
      where: { slug: userSlug },
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
  const auth = await getAuthInfo(request);
  if (!auth.isAdmin && !auth.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, html_content, metadata } = body;

    if (!slug || !html_content) {
      return NextResponse.json({ error: 'Missing slug or html_content' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    // Authorization check for customers: they can only edit their own slug (or assign it if unassigned)
    if (!auth.isAdmin && auth.userId) {
      if (auth.userCardSlug && auth.userCardSlug !== cleanSlug) {
        return NextResponse.json(
          { error: 'You are only authorized to manage your assigned card slug.' },
          { status: 403 }
        );
      }

      // If user had no slug assigned yet, link this slug to their User account
      if (!auth.userCardSlug) {
        try {
          await prisma.user.update({
            where: { id: auth.userId },
            data: { cardSlug: cleanSlug },
          });
        } catch (linkErr) {
          console.warn('[Cards POST] Could not link cardSlug to user:', linkErr);
        }
      }
    }

    // Embed metadata into HTML if provided
    const finalHtml = metadata ? embedMetadata(html_content, metadata) : html_content;

    const card = await prisma.client.upsert({
      where: { slug: cleanSlug },
      update: { htmlContent: finalHtml },
      create: {
        slug: cleanSlug,
        htmlContent: finalHtml,
      },
    });

    return NextResponse.json({
      success: true,
      card: {
        id: card.id,
        slug: card.slug,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      },
      metadata: metadata || extractMetadata(card.htmlContent),
    });
  } catch (error: any) {
    console.error('Failed to upsert card:', error);
    return NextResponse.json(
      { error: 'Failed to save card', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
