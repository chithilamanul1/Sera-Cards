import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { generateTemplateHtml, TemplateData } from '@/lib/templates';
import { saveCardToMemory, getCardFromMemory } from '@/lib/cardStore';
import { getUserFromMemory, saveUserToMemory } from '@/lib/userStore';
import { sendOnboardingCompleteEmail, sendAdminOnboardingAlert } from '@/lib/mail';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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

// GET /api/onboarding?checkSlug=myname
// Real-time slug availability check
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const checkSlug = searchParams.get('checkSlug');

    if (!checkSlug) {
      return NextResponse.json({ error: 'checkSlug query parameter is required' }, { status: 400 });
    }

    const cleanSlug = checkSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '').slice(0, 24);

    if (cleanSlug.length < 2) {
      return NextResponse.json({ available: false, message: 'Slug must be at least 2 characters.' });
    }

    // Reserved system routes that cannot be used as subdomains
    const reserved = ['admin', 'api', 'dashboard', 'login', 'register', 'pricing', 'onboarding', 'how-it-works', 'teams', 'c', 'vcard'];
    if (reserved.includes(cleanSlug)) {
      return NextResponse.json({ available: false, message: 'This handle is reserved by the system.' });
    }

    // Check memory store
    const memCard = getCardFromMemory(cleanSlug);

    // Check DB
    let dbCard: any = null;
    try {
      dbCard = await Promise.race([
        prisma.client.findUnique({
          where: { slug: cleanSlug },
          select: { id: true, slug: true },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
    } catch {}

    const isTaken = !!dbCard || !!memCard;

    // Check current user session: if the current user already owns this slug, it's available to them
    const userSession = cookies().get('user_session')?.value;
    if (isTaken && userSession) {
      let currentUser: any = null;
      try {
        currentUser = await prisma.user.findUnique({
          where: { id: userSession },
          select: { id: true, cardSlug: true },
        });
      } catch {}
      if (!currentUser) currentUser = getUserFromMemory(userSession);

      if (currentUser && currentUser.cardSlug === cleanSlug) {
        return NextResponse.json({ available: true, slug: cleanSlug, isOwner: true });
      }
    }

    return NextResponse.json({
      available: !isTaken,
      slug: cleanSlug,
      message: isTaken ? 'This handle is already taken. Try adding your city or initials.' : 'Handle is available!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/onboarding
// Complete onboarding: compiles HTML card, saves to DB & memory, links to user, and sends emails
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      slug,
      name,
      title = '',
      company = '',
      bio = '',
      phone = '',
      whatsapp = '',
      email = '',
      location = 'Colombo, Sri Lanka',
      website = '',
      preset = 'personal_hero',
      avatarUrl = '',
      coverUrl = '',
      instagram = '',
      linkedin = '',
      facebook = '',
      tiktok = '',
      lankaQrText = '',
      googleReviewUrl = '',
      catalogPdfUrl = '',
      catalogPdfTitle = '',
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    // Sanitize slug
    const rawSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
    const cleanSlug = rawSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '').slice(0, 24);

    if (cleanSlug.length < 2) {
      return NextResponse.json({ error: 'Card handle must be at least 2 characters.' }, { status: 400 });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Check existing card ownership
    let existingCard: any = null;
    try {
      existingCard = await Promise.race([
        prisma.client.findUnique({ where: { slug: cleanSlug } }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
    } catch {}

    if (!existingCard) {
      existingCard = getCardFromMemory(cleanSlug);
    }

    // Identify current user
    const cookieStore = cookies();
    const userSession = cookieStore.get('user_session')?.value;
    let currentUser: any = null;

    if (userSession) {
      try {
        currentUser = await prisma.user.findUnique({ where: { id: userSession } });
      } catch {}
      if (!currentUser) currentUser = getUserFromMemory(userSession);
    }

    // If card exists, verify ownership
    if (existingCard) {
      const existingMeta = extractMetadata(existingCard.htmlContent || '') || existingCard.metadata;
      const isOwner =
        (currentUser && currentUser.cardSlug === cleanSlug) ||
        (cleanEmail && existingMeta && existingMeta.email === cleanEmail);

      if (!isOwner && !cookieStore.get('admin_session')?.value) {
        return NextResponse.json(
          { error: `The handle "${cleanSlug}" is already registered. Please pick another unique handle.` },
          { status: 409 }
        );
      }
    }

    // Build TemplateData
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    const defaultCover = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80';

    const templateData: TemplateData = {
      slug: cleanSlug,
      name: name.trim(),
      title: title.trim(),
      company: company.trim(),
      bio: bio.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone || '').trim(),
      email: cleanEmail || currentUser?.email || '',
      location: location.trim(),
      website: website.trim(),
      avatarUrl: avatarUrl.trim() || defaultAvatar,
      coverUrl: coverUrl.trim() || defaultCover,
      instagram: instagram.trim(),
      linkedin: linkedin.trim(),
      facebook: facebook.trim(),
      tiktok: tiktok.trim(),
      lankaQrText: lankaQrText.trim(),
      googleReviewUrl: googleReviewUrl.trim(),
      catalogPdfUrl: catalogPdfUrl.trim(),
      catalogPdfTitle: catalogPdfTitle.trim(),
    };

    // 1. Generate full production HTML
    const compiledHtml = generateTemplateHtml(preset, templateData);

    // 2. Embed metadata comment
    const metadata = {
      ...templateData,
      preset,
      onboardedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const htmlWithMetadata = `<!-- GOSERA_METADATA: ${JSON.stringify(metadata)} -->\n${compiledHtml}`;

    // 3. Upsert Card in Prisma / MongoDB
    let savedDbCard: any = null;
    try {
      savedDbCard = await Promise.race([
        prisma.client.upsert({
          where: { slug: cleanSlug },
          update: { htmlContent: htmlWithMetadata },
          create: {
            slug: cleanSlug,
            htmlContent: htmlWithMetadata,
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500)),
      ]);
    } catch (dbErr: any) {
      console.warn('[Onboarding POST] Database upsert timeout/warning:', dbErr?.message);
    }

    // 4. Always persist in fast resilient memory store
    const memCard = saveCardToMemory(cleanSlug, htmlWithMetadata, metadata, savedDbCard?.id);

    // 5. User link or creation
    let targetUserId = currentUser?.id;

    if (currentUser) {
      try {
        await prisma.user.update({
          where: { id: currentUser.id },
          data: {
            name: templateData.name,
            phone: templateData.phone || currentUser.phone,
            cardSlug: cleanSlug,
          },
        });
      } catch {}
      saveUserToMemory({
        ...currentUser,
        name: templateData.name,
        phone: templateData.phone || currentUser.phone,
        cardSlug: cleanSlug,
      });
    } else if (cleanEmail) {
      // Find or create User by email
      let userByEmail: any = null;
      try {
        userByEmail = await prisma.user.findUnique({ where: { email: cleanEmail } });
      } catch {}
      if (!userByEmail) userByEmail = getUserFromMemory(cleanEmail);

      if (userByEmail) {
        targetUserId = userByEmail.id;
        try {
          await prisma.user.update({
            where: { id: userByEmail.id },
            data: {
              name: templateData.name,
              phone: templateData.phone || userByEmail.phone,
              cardSlug: cleanSlug,
            },
          });
        } catch {}
        saveUserToMemory({
          ...userByEmail,
          name: templateData.name,
          phone: templateData.phone || userByEmail.phone,
          cardSlug: cleanSlug,
        });
      } else {
        // Auto-provision user account for instant seamless access
        const generatedPassword = 'sc_' + Math.random().toString(36).slice(2, 10);
        const passwordHash = hashPassword(generatedPassword);
        let createdUser: any = null;

        try {
          createdUser = await prisma.user.create({
            data: {
              name: templateData.name,
              email: cleanEmail,
              phone: templateData.phone || null,
              passwordHash,
              role: 'USER',
              plan: 'BASIC',
              cardSlug: cleanSlug,
            },
          });
          targetUserId = createdUser.id;
        } catch {}

        if (!createdUser) {
          targetUserId = 'usr_' + Date.now();
          createdUser = {
            id: targetUserId,
            name: templateData.name,
            email: cleanEmail,
            phone: templateData.phone || null,
            passwordHash,
            role: 'USER',
            plan: 'BASIC',
            cardSlug: cleanSlug,
            createdAt: new Date().toISOString(),
          };
        }

        saveUserToMemory(createdUser);
      }

      // Establish session cookie for 30 days
      if (targetUserId) {
        cookieStore.set({
          name: 'user_session',
          value: String(targetUserId),
          httpOnly: true,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax',
        });
      }
    }

    // 6. Dispatch Onboarding Emails (non-blocking)
    const emailToUse = cleanEmail || currentUser?.email;
    if (emailToUse) {
      sendOnboardingCompleteEmail({
        to: emailToUse,
        name: templateData.name,
        slug: cleanSlug,
        title: templateData.title,
        company: templateData.company,
        phone: templateData.phone,
      }).catch((mailErr) => {
        console.warn('[Onboarding Complete Email Warning]', mailErr?.message);
      });
    }

    sendAdminOnboardingAlert({
      name: templateData.name,
      email: emailToUse || 'no-email@seranex.lk',
      phone: templateData.phone,
      slug: cleanSlug,
      title: templateData.title,
      company: templateData.company,
    }).catch((alertErr) => {
      console.warn('[Admin Onboarding Alert Warning]', alertErr?.message);
    });

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully! Your digital card is live.',
      card: {
        id: savedDbCard?.id || memCard.id,
        slug: cleanSlug,
        url: `https://${cleanSlug}.${rootDomain}`,
        directUrl: `/c/${cleanSlug}`,
        dashboardUrl: '/dashboard',
      },
    });
  } catch (error: any) {
    console.error('[Onboarding API Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to finish onboarding.' },
      { status: 500 }
    );
  }
}
