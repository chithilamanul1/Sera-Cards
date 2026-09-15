import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const cleanSlug = slug.toLowerCase().trim();

    const client = await prisma.client.findUnique({
      where: { slug: cleanSlug },
      select: { htmlContent: true },
    });

    if (!client) {
      // Branded high-contrast 404
      const notFoundHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Card Not Found | Sera Cards</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #050506; color: #fafafa; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 1rem; }
              .container { text-align: center; max-width: 420px; padding: 2.5rem 2rem; border-radius: 20px; background: #0e0e12; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
              .icon { font-size: 3rem; margin-bottom: 1rem; }
              h1 { margin: 0 0 0.5rem 0; font-size: 1.75rem; color: #e0c274; font-weight: 700; }
              p { color: #94a3b8; line-height: 1.5; font-size: 0.95rem; margin-bottom: 1.5rem; }
              a { display: inline-block; padding: 0.75rem 1.5rem; background: #c9a24a; color: #0a0a0c; font-weight: 600; border-radius: 999px; text-decoration: none; font-size: 0.875rem; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="icon">💳</div>
              <h1>Card Not Found</h1>
              <p>The digital card <strong>${cleanSlug}</strong> has not been registered or may have been deactivated.</p>
              <a href="https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk'}">Get Your Sera Card</a>
          </div>
      </body>
      </html>
      `;
      return new Response(notFoundHtml, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // Return the raw custom HTML with strict isolation headers
    return new Response(client.htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        // Disallow setting any cookies from raw user HTML
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error serving card:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
