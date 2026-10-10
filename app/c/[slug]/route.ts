import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCardFromMemory, saveCardToMemory } from '@/lib/cardStore';
import { getTeamMemberBySlug, getTeam, compileMemberCard } from '@/lib/teamStore';
import { generateTemplateHtml } from '@/lib/templates';
import { getUserFromMemory } from '@/lib/userStore';
import { getActivation } from '@/lib/activationStore';

export const dynamic = 'force-dynamic';

function checkIsLocked(html: string | null, slug: string): boolean {
  if (!html) return false;
  const memCard = getCardFromMemory(slug);
  if (memCard?.metadata?.isLocked === true || memCard?.metadata?.status === 'LOCKED') {
    return true;
  }
  const match = html.match(/<!--\s*GOSERA_METADATA:\s*({[\s\S]*?})\s*-->/);
  if (match && match[1]) {
    try {
      const meta = JSON.parse(match[1]);
      if (meta.isLocked === true || meta.status === 'LOCKED') {
        return true;
      }
    } catch {}
  }
  return false;
}

function getLockedHtml(slug: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Card Locked | GoSera</title>
      <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #050506; color: #fafafa; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
          .container { text-align: center; max-width: 440px; padding: 2.75rem 2rem; border-radius: 24px; background: #0e0e12; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); }
          .icon { font-size: 3rem; margin-bottom: 0.75rem; }
          .badge { display: inline-block; padding: 0.35rem 0.9rem; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.25rem; }
          h1 { margin: 0 0 0.5rem 0; font-size: 1.6rem; color: #f59e0b; font-weight: 700; letter-spacing: -0.02em; }
          p { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.75rem; }
          a { display: inline-block; padding: 0.8rem 1.75rem; background: #10b981; color: #022c22; font-weight: 700; border-radius: 999px; text-decoration: none; font-size: 0.875rem; transition: background-color 0.2s; }
          a:hover { background: #34d399; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="icon">🔒</div>
          <div class="badge">Temporarily Locked</div>
          <h1>Card Frozen by Owner</h1>
          <p>The digital NFC card for <strong>${slug}</strong> is temporarily frozen. If you are the cardholder, you can unlock it anytime from your dashboard.</p>
          <a href="/login">Unlock in Dashboard</a>
      </div>
  </body>
  </html>
  `;
}

function getNotFoundHtml(cleanSlug: string): string {
  return `
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
          <a href="https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk'}">Get Your Sera Card</a>
      </div>
  </body>
  </html>
  `;
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const rawSlug = params?.slug || '';
    const cleanSlug = decodeURIComponent(rawSlug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    if (!cleanSlug) {
      return new Response(getNotFoundHtml('unknown'), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
    let htmlContent: string | null = null;

    // ─── Layer 1: Check MongoDB Client table ──────────────────────────────────────
    try {
      let client = await Promise.race([
        prisma.client.findUnique({
          where: { slug: cleanSlug },
          select: { htmlContent: true },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 5000)),
      ]) as any;

      if (!client?.htmlContent) {
        // Case-insensitive query fallback
        try {
          client = await Promise.race([
            prisma.client.findFirst({
              where: { slug: { equals: cleanSlug, mode: 'insensitive' } },
              select: { htmlContent: true },
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
          ]) as any;
        } catch {}
      }

      if (client?.htmlContent) {
        htmlContent = client.htmlContent;
        saveCardToMemory(cleanSlug, htmlContent);
      }
    } catch (dbErr) {
      console.warn('[Serve Card] DB fetch warning:', dbErr);
    }

    // ─── Layer 2: Check in-memory card store ──────────────────────────────────────
    if (!htmlContent) {
      const memCard = getCardFromMemory(cleanSlug);
      if (memCard?.htmlContent) {
        htmlContent = memCard.htmlContent;
      }
    }

    // ─── Layer 3: Check User accounts (auto-generate if user exists) ─────────────
    if (!htmlContent) {
      try {
        let user: any = null;
        try {
          user = await Promise.race([
            prisma.user.findFirst({
              where: {
                OR: [
                  { cardSlug: { equals: cleanSlug, mode: 'insensitive' } },
                  { name: { equals: cleanSlug, mode: 'insensitive' } },
                ],
              },
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
          ]);
        } catch {}

        if (!user) {
          user = getUserFromMemory(cleanSlug);
        }

        if (user) {
          const userName = user.name || cleanSlug;
          htmlContent = generateTemplateHtml('personal_hero', {
            slug: cleanSlug,
            name: userName,
            title: user.plan === 'TEAMS' ? 'Corporate Associate' : 'Professional',
            company: 'Sera Cards',
            phone: user.phone || '',
            whatsapp: (user.phone || '').replace(/[^0-9]/g, ''),
            email: user.email || '',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            bio: `Welcome to ${userName}'s official digital business card. Tap connect to exchange details!`,
            location: 'Colombo, Sri Lanka',
            website: `https://${cleanSlug}.${rootDomain}`,
          });

          saveCardToMemory(cleanSlug, htmlContent, {
            name: userName,
            email: user.email,
            slug: cleanSlug,
            phone: user.phone,
          });

          // Asynchronously upsert to Client table
          prisma.client.upsert({
            where: { slug: cleanSlug },
            update: { htmlContent },
            create: { slug: cleanSlug, htmlContent },
          }).catch(() => {});
        }
      } catch (uErr) {
        console.warn('[Serve Card] User fallback warning:', uErr);
      }
    }

    // ─── Layer 4: Check Orders table (auto-generate from placed order) ────────────
    if (!htmlContent) {
      try {
        const order = await Promise.race([
          prisma.order.findFirst({
            where: { slug: { equals: cleanSlug, mode: 'insensitive' } },
            orderBy: { createdAt: 'desc' },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 4000)),
        ]) as any;

        if (order) {
          htmlContent = generateTemplateHtml('modern_grid', {
            slug: cleanSlug,
            name: order.nameOnCard || order.customerName,
            title: order.designation || 'Cardholder',
            company: order.brandName || 'Sera Cards',
            phone: order.customerPhone || '',
            whatsapp: (order.customerPhone || '').replace(/[^0-9]/g, ''),
            email: order.customerEmail || '',
            avatarUrl: order.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
            bio: order.bio || `Welcome to ${order.nameOnCard}'s digital identity.`,
            location: order.city || 'Sri Lanka',
            website: `https://${cleanSlug}.${rootDomain}`,
            instagram: order.instagram || '',
            linkedin: order.linkedin || '',
            facebook: order.facebook || '',
            tiktok: order.tiktok || '',
          });

          saveCardToMemory(cleanSlug, htmlContent, {
            name: order.nameOnCard,
            slug: cleanSlug,
          });

          prisma.client.upsert({
            where: { slug: cleanSlug },
            update: { htmlContent },
            create: { slug: cleanSlug, htmlContent },
          }).catch(() => {});
        }
      } catch (oErr) {
        console.warn('[Serve Card] Order fallback warning:', oErr);
      }
    }

    // ─── Layer 5: Check Card Activation records ──────────────────────────────────
    if (!htmlContent) {
      try {
        const act = await Promise.race([
          (prisma as any).cardActivation.findFirst({
            where: { assignedSlug: { equals: cleanSlug, mode: 'insensitive' } },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
        ]);

        if (act) {
          htmlContent = generateTemplateHtml('personal_hero', {
            slug: cleanSlug,
            name: cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1),
            title: 'Verified Member',
            company: 'Sera Cards',
            phone: '',
            whatsapp: '',
            email: '',
            bio: 'Welcome to this verified Sera NFC digital identity.',
            location: 'Sri Lanka',
            website: `https://${cleanSlug}.${rootDomain}`,
          });

          saveCardToMemory(cleanSlug, htmlContent);
          prisma.client.upsert({
            where: { slug: cleanSlug },
            update: { htmlContent },
            create: { slug: cleanSlug, htmlContent },
          }).catch(() => {});
        }
      } catch {}
    }

    // ─── Layer 6: Check Team fleet store ──────────────────────────────────────────
    if (!htmlContent) {
      try {
        const teamMember = await getTeamMemberBySlug(cleanSlug);
        if (teamMember) {
          const team = await getTeam(teamMember.teamId);
          if (team) {
            if (teamMember.status === 'DEACTIVATED') {
              const suspendedHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>${teamMember.name} - Profile Deactivated</title>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #050506; color: #fafafa; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
                    .card { max-width: 440px; background: #0e0e12; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 2.5rem 2rem; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); }
                    .icon { width: 4rem; height: 4rem; border-radius: 1rem; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); color: #fbbf24; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.75rem; }
                    h1 { font-size: 1.35rem; font-weight: 700; margin: 0 0 0.5rem; color: #fff; }
                    p { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin: 0 0 1.5rem; }
                    a { display: inline-block; padding: 0.75rem 1.5rem; border-radius: 999px; background: rgba(255,255,255,0.1); color: #fff; font-size: 0.85rem; font-weight: 600; text-decoration: none; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="icon">🔒</div>
                    <h1>${team.name}</h1>
                    <p>This corporate card profile for <strong>${teamMember.name}</strong> has been retired or deactivated by the company administrator.</p>
                    <a href="${team.brandSettings?.website || `https://${team.slug}.${rootDomain}`}">&larr; Visit Company Website</a>
                  </div>
                </body>
                </html>
              `;
              return new Response(suspendedHtml, {
                status: 403,
                headers: {
                  'Content-Type': 'text/html; charset=utf-8',
                  'X-Content-Type-Options': 'nosniff',
                  'Cache-Control': 'no-store, max-age=0',
                },
              });
            }

            // Compile dynamic member card
            htmlContent = compileMemberCard(team, teamMember);
          }
        }
      } catch (teamErr) {
        console.warn('[Serve Card] Team member lookup warning:', teamErr);
      }
    }

    // ─── Layer 7: Founder & Core Persona Guaranteed Fallback ─────────────────────
    if (!htmlContent && (cleanSlug === 'chithila' || cleanSlug === 'chithilaa')) {
      htmlContent = generateTemplateHtml('personal_hero', {
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

      saveCardToMemory(cleanSlug, htmlContent, {
        name: 'Chithila Manul',
        slug: cleanSlug,
        email: 'chithilamanul1@gmail.com',
        phone: '0728382638',
      });

      prisma.client.upsert({
        where: { slug: cleanSlug },
        update: { htmlContent },
        create: { slug: cleanSlug, htmlContent },
      }).catch(() => {});
    }

    // ─── Layer 8: Check Remote Freeze / Lock ─────────────────────────────────────
    if (htmlContent && checkIsLocked(htmlContent, cleanSlug)) {
      return new Response(getLockedHtml(cleanSlug), {
        status: 403,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // ─── Layer 9: If card still not found, return branded 404 ─────────────────────
    if (!htmlContent) {
      return new Response(getNotFoundHtml(cleanSlug), {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // ─── Layer 10: Return Live HTML with edge headers ─────────────────────────────
    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error serving card:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
