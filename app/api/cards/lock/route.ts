import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { getUserFromMemory } from '@/lib/userStore';
import { getCardFromMemory, saveCardToMemory } from '@/lib/cardStore';
import { getTeamMemberBySlug, updateTeamMember } from '@/lib/teamStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin_session')?.value;
    const userSession = cookieStore.get('user_session')?.value;

    const isAdmin = adminSession === 'authenticated';
    let currentUser: any = null;

    if (!isAdmin && userSession) {
      try {
        currentUser = await prisma.user.findUnique({
          where: { id: userSession },
          select: { id: true, cardSlug: true, role: true },
        });
      } catch {}

      if (!currentUser) {
        currentUser = getUserFromMemory(userSession);
      }
    }

    if (!isAdmin && !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, isLocked } = body;

    if (!slug || typeof isLocked !== 'boolean') {
      return NextResponse.json({ error: 'Slug and isLocked boolean required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    // Authorization: User can only lock their own slug unless admin
    if (!isAdmin && currentUser?.role !== 'ADMIN') {
      const authorizedSlug = (currentUser?.cardSlug || '').toLowerCase().trim();
      if (authorizedSlug !== cleanSlug) {
        return NextResponse.json(
          { error: 'You are only authorized to lock/unlock your own card.' },
          { status: 403 }
        );
      }
    }

    // 1. Update in Team Store if it's a corporate fleet member
    try {
      const teamMember = await getTeamMemberBySlug(cleanSlug);
      if (teamMember) {
        await updateTeamMember(teamMember.teamId, teamMember.id, {
          status: isLocked ? 'DEACTIVATED' : 'ACTIVE',
        });
      }
    } catch (teamErr) {
      console.warn('[Card Lock] Team update warning:', teamErr);
    }

    // 2. Update in Card Store
    const memCard = getCardFromMemory(cleanSlug);
    if (memCard) {
      const updatedMeta = {
        ...(memCard.metadata || {}),
        isLocked,
        status: isLocked ? 'LOCKED' : 'ACTIVE',
        lockedAt: isLocked ? new Date().toISOString() : null,
      };
      saveCardToMemory(cleanSlug, memCard.htmlContent, updatedMeta, memCard.id);
    }

    // 3. Update in MongoDB Client if exists
    try {
      const client = await prisma.client.findUnique({
        where: { slug: cleanSlug },
      });
      if (client?.htmlContent) {
        const serialized = `<!-- GOSERA_METADATA: ${JSON.stringify({
          isLocked,
          status: isLocked ? 'LOCKED' : 'ACTIVE',
        })} -->\n`;
        let newHtml = client.htmlContent;
        if (/<!--\s*GOSERA_METADATA:\s*{[\s\S]*?}\s*-->\n?/.test(newHtml)) {
          newHtml = newHtml.replace(/<!--\s*GOSERA_METADATA:\s*{[\s\S]*?}\s*-->\n?/, serialized);
        } else {
          newHtml = serialized + newHtml;
        }

        await prisma.client.update({
          where: { slug: cleanSlug },
          data: { htmlContent: newHtml },
        });
      }
    } catch (dbErr) {
      console.warn('[Card Lock] DB update warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      slug: cleanSlug,
      isLocked,
      message: isLocked
        ? `Card ${cleanSlug} is now remotely locked. NFC taps and URL visits are frozen.`
        : `Card ${cleanSlug} has been unlocked and is now live.`,
    });
  } catch (error: any) {
    console.error('[Card Lock Error]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
