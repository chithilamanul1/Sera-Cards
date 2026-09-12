import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params;
    const cleanSlug = slug.toLowerCase().trim();

    const client = await prisma.client.findUnique({
      where: { slug: cleanSlug },
      select: { htmlContent: true },
    });

    if (!client) {
      // Return a styled 404
      const notFoundHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Card Not Found | Sera Cards</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #fafafa; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .container { text-align: center; max-width: 400px; padding: 2rem; border-radius: 12px; background: #18181b; border: 1px solid #27272a; }
              h1 { margin-top: 0; color: #ef4444; }
              p { color: #a1a1aa; line-height: 1.5; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>404</h1>
              <p>The digital business card you are looking for does not exist or has been removed.</p>
          </div>
      </body>
      </html>
      `;
      return new Response(notFoundHtml, {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Return the raw custom HTML
    return new Response(client.htmlContent, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error serving card:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
