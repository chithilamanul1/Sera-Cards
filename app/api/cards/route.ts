import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getUserFromMemory } from '@/lib/userStore';
import { saveCardToMemory, getCardFromMemory, getAllCardsFromMemory } from '@/lib/cardStore';
import { getTeamMemberBySlug, getTeam, compileMemberCard } from '@/lib/teamStore';

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
      const card = await Promise.race([
        prisma.client.findUnique({
          where: { slug: cleanSlug },
          include: {
            _count: {
              select: { leads: true },
            },
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
      ]) as any;

      if (card) {
        const metadata = extractMetadata(card.htmlContent);
        saveCardToMemory(cleanSlug, card.htmlContent, metadata, card.id);
        return NextResponse.json({
          id: card.id,
          slug: card.slug,
          htmlContent: card.htmlContent,
          metadata,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
          _count: card._count,
        });
      }
    } catch (error: any) {
      console.warn('[Cards GET] DB lookup warning (checking memory store):', error?.message);
    }

    // Check memory store and team store fallback
    let memCard = getCardFromMemory(cleanSlug);
    if (!memCard) {
      try {
        const teamMember = await getTeamMemberBySlug(cleanSlug);
        if (teamMember) {
          const team = await getTeam(teamMember.teamId);
          if (team) {
            compileMemberCard(team, teamMember);
            memCard = getCardFromMemory(cleanSlug);
          }
        }
      } catch (tErr) {
        console.warn('[Cards GET] Team fallback error:', tErr);
      }
    }

    // Check User table fallback
    if (!memCard) {
      try {
        const user = await Promise.race([
          prisma.user.findFirst({
            where: {
              OR: [
                { cardSlug: { equals: cleanSlug, mode: 'insensitive' } },
                { name: { equals: cleanSlug, mode: 'insensitive' } },
              ],
            },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
        ]) as any;

        if (user) {
          const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
          const { generateTemplateHtml } = await import('@/lib/templates');
          const genHtml = generateTemplateHtml('personal_hero', {
            slug: cleanSlug,
            name: user.name || cleanSlug,
            title: user.plan === 'TEAMS' ? 'Corporate Associate' : 'Professional',
            company: 'Sera Cards',
            phone: user.phone || '',
            whatsapp: (user.phone || '').replace(/[^0-9]/g, ''),
            email: user.email || '',
            bio: `Welcome to ${user.name}'s official digital card profile.`,
            location: 'Colombo, Sri Lanka',
            website: `https://${cleanSlug}.${rootDomain}`,
          });
          memCard = saveCardToMemory(cleanSlug, genHtml, {
            name: user.name,
            email: user.email,
            slug: cleanSlug,
            phone: user.phone,
          });
        }
      } catch {}
    }

    // Founder fallback for chithila / chithilaa
    if (!memCard && (cleanSlug === 'chithila' || cleanSlug === 'chithilaa')) {
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
      const { generateTemplateHtml } = await import('@/lib/templates');
      const genHtml = generateTemplateHtml('personal_hero', {
        slug: cleanSlug,
        name: 'Chithila Manul',
        title: 'Founder & CEO',
        company: 'Sera Cards',
        phone: '0728382638',
        whatsapp: '94728382638',
        email: 'chithilamanul1@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        bio: 'Founder & CEO of Sera Cards & Seranex. Next-gen NFC networking and smart business hardware.',
        location: 'Colombo, Sri Lanka',
        website: `https://${cleanSlug}.${rootDomain}`,
      });
      memCard = saveCardToMemory(cleanSlug, genHtml, {
        name: 'Chithila Manul',
        slug: cleanSlug,
        email: 'chithilamanul1@gmail.com',
      });
    }

    if (memCard) {
      return NextResponse.json({
        id: memCard.id,
        slug: memCard.slug,
        htmlContent: memCard.htmlContent,
        metadata: memCard.metadata || extractMetadata(memCard.htmlContent),
        createdAt: memCard.createdAt,
        updatedAt: memCard.updatedAt,
        _count: memCard._count,
      });
    }

    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  // Listing multiple cards requires authorization
  if (!auth.isAdmin && !auth.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // If admin, return all cards
    if (auth.isAdmin) {
      const cards = await Promise.race([
        prisma.client.findMany({
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
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
      ]) as any[];

      // Merge with memory cards
      const memCards = getAllCardsFromMemory();
      const existingSlugs = new Set((cards || []).map((c: any) => c.slug));
      const merged = [...(cards || [])];
      for (const mc of memCards) {
        if (!existingSlugs.has(mc.slug)) {
          merged.push({
            id: mc.id,
            slug: mc.slug,
            createdAt: mc.createdAt,
            updatedAt: mc.updatedAt,
            _count: mc._count,
          });
        }
      }
      return NextResponse.json(merged);
    }

    // If customer, return their card(s)
    const userSlug = auth.userCardSlug;
    if (!userSlug) {
      return NextResponse.json([]);
    }

    let cards: any[] = [];
    try {
      cards = await Promise.race([
        prisma.client.findMany({
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
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
      ]) as any[];
    } catch {}

    if (!cards || cards.length === 0) {
      const memCard = getCardFromMemory(userSlug);
      if (memCard) {
        cards = [{
          id: memCard.id,
          slug: memCard.slug,
          createdAt: memCard.createdAt,
          updatedAt: memCard.updatedAt,
          _count: memCard._count,
        }];
      }
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    // Fall back to memory cards on any unhandled DB error
    const memCards = getAllCardsFromMemory();
    return NextResponse.json(memCards);
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

    let card: any = null;
    try {
      card = await Promise.race([
        prisma.client.upsert({
          where: { slug: cleanSlug },
          update: { htmlContent: finalHtml },
          create: {
            slug: cleanSlug,
            htmlContent: finalHtml,
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500)),
      ]);
    } catch (dbErr: any) {
      console.warn('[Cards POST] Database upsert warning (falling back to memory store):', dbErr?.message);
    }

    // Always persist to resilient memory store
    const memCard = saveCardToMemory(cleanSlug, finalHtml, metadata, card?.id);

    return NextResponse.json({
      success: true,
      card: {
        id: card?.id || memCard.id,
        slug: cleanSlug,
        createdAt: card?.createdAt || memCard.createdAt,
        updatedAt: card?.updatedAt || memCard.updatedAt,
      },
      metadata: metadata || extractMetadata(finalHtml),
    });
  } catch (error: any) {
    console.error('Failed to process card save request:', error);
    return NextResponse.json(
      { error: 'Failed to save card', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
