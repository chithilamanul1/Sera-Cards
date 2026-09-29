import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLogoFromMemoryOrDisk, saveLogo } from '@/lib/logoStore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('order') || searchParams.get('orderNumber');

    if (!id) {
      return new Response('Order ID required', { status: 400 });
    }

    // 1. Try fast in-memory or disk cache
    const cached = getLogoFromMemoryOrDisk(id);
    if (cached) {
      return new Response(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          'Content-Type': cached.mime,
          'Content-Length': cached.buffer.length.toString(),
          'Content-Disposition': `inline; filename="gosera-logo-${id}.png"`,
          'Cache-Control': 'public, max-age=604800, immutable',
        },
      });
    }

    // 2. Query MongoDB with timeout protection
    let order: any = null;
    try {
      const orConditions: any[] = [{ orderNumber: id }];
      if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        orConditions.push({ id });
      }

      order = await Promise.race([
        prisma.order.findFirst({
          where: {
            OR: orConditions,
          },
          select: {
            logoUrl: true,
            orderNumber: true,
            brandName: true,
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Database query timed out')), 3500)
        ),
      ]);
    } catch (dbErr: any) {
      console.warn('[Orders Logo API] DB query warning:', dbErr?.message);
    }

    if (order && order.logoUrl) {
      // If it's a base64 data URL
      const match = order.logoUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        saveLogo(order.orderNumber || id, order.logoUrl);
        const mime = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        return new Response(new Uint8Array(buffer), {
          status: 200,
          headers: {
            'Content-Type': mime,
            'Content-Length': buffer.length.toString(),
            'Content-Disposition': `inline; filename="gosera-logo-${id}.png"`,
            'Cache-Control': 'public, max-age=604800, immutable',
          },
        });
      }

      // If it's an external URL
      if (order.logoUrl.startsWith('http://') || order.logoUrl.startsWith('https://')) {
        return NextResponse.redirect(order.logoUrl);
      }
    }

    // 3. Fallback: Return nice SVG placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
  <rect width="100%" height="100%" fill="#0a0a0c" rx="16"/>
  <rect x="20" y="20" width="560" height="260" rx="12" fill="none" stroke="#27272a" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="50%" y="45%" text-anchor="middle" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="20">
    GOSERA SMART NFC CARD
  </text>
  <text x="50%" y="60%" text-anchor="middle" fill="#a1a1aa" font-family="sans-serif" font-size="14">
    Order #${id} - No digital logo uploaded
  </text>
  <text x="50%" y="72%" text-anchor="middle" fill="#71717a" font-family="sans-serif" font-size="12">
    (Please send your logo file directly in the WhatsApp chat)
  </text>
</svg>`;

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('[Orders Logo API] Error:', error);
    return new Response('Failed to retrieve logo', { status: 500 });
  }
}
