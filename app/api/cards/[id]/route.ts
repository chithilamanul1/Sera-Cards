import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function isAuthorized(request: Request) {
  const session = cookies().get('admin_session');
  if (session && session.value === 'authenticated') {
    return true;
  }
  const authHeader = request.headers.get('x-admin-secret');
  return authHeader === process.env.ADMIN_SECRET;
}

// GET /api/cards/[id] — Fetch raw HTML for preview (admin only)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const card = await Promise.race([
      prisma.client.findUnique({
        where: { id },
        select: { id: true, slug: true, htmlContent: true, createdAt: true, updatedAt: true },
      }),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
    ]);

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Failed to fetch card:', error);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  }
}

// DELETE /api/cards/[id] — Delete a card and all its leads
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    // Delete all leads for this card first (cascade)
    const card = await Promise.race([
      prisma.client.findUnique({ where: { id }, select: { slug: true } }),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
    ]);

    if (card) {
      await Promise.race([
        prisma.lead.deleteMany({ where: { clientSlug: card.slug } }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
      ]);
    }

    await Promise.race([
      prisma.client.delete({ where: { id } }),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
