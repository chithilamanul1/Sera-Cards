import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { generatePayHereHash, PAYHERE_CONFIG } from '@/lib/payhere';
import { saveLogo } from '@/lib/logoStore';
import { sendOrderConfirmationEmail } from '@/lib/mail';

import { getUserFromMemory, saveUserToMemory } from '@/lib/userStore';
import { saveOrderToMemory, getAllOrdersFromMemory } from '@/lib/orderStore';
import { hashPassword } from '@/lib/auth';
import { saveCardToMemory, getCardFromMemory } from '@/lib/cardStore';
import { generateTemplateHtml } from '@/lib/templates';

// Helper to check authorization
async function getOrderAuth(request: Request) {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  if (session && session.value === 'authenticated') {
    return { isAdmin: true };
  }
  const authHeader = request.headers.get('x-admin-secret');
  if (authHeader && authHeader === process.env.ADMIN_SECRET) {
    return { isAdmin: true };
  }

  const userSession = cookieStore.get('user_session')?.value;
  if (userSession) {
    let user: any = null;
    try {
      user = await Promise.race([
        prisma.user.findUnique({
          where: { id: userSession },
          select: { id: true, email: true, phone: true, role: true, cardSlug: true },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
    } catch {
      // fallback
    }
    if (!user) {
      user = getUserFromMemory(userSession);
    }
    if (user) {
      return { isAdmin: user.role === 'ADMIN', user };
    }
  }

  return { isAdmin: false, user: null };
}

// GET /api/orders — List customer orders (Admin: all, Customer: their own)
export async function GET(request: Request) {
  const auth = await getOrderAuth(request);
  if (!auth.isAdmin && !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const whereClause: any = {};

    // Customer scoping: only return orders belonging to this user
    if (!auth.isAdmin && auth.user) {
      const orConditions: any[] = [];
      if (auth.user.email) orConditions.push({ customerEmail: auth.user.email });
      if (auth.user.phone) orConditions.push({ customerPhone: auth.user.phone });
      if (auth.user.cardSlug) orConditions.push({ slug: auth.user.cardSlug });

      if (orConditions.length > 0) {
        whereClause.OR = orConditions;
      } else {
        return NextResponse.json([]);
      }
    } else {
      // Admin filters
      if (status && status !== 'ALL') {
        whereClause.orderStatus = status;
      }

      if (search) {
        whereClause.OR = [
          { customerName: { contains: search, mode: 'insensitive' } },
          { customerPhone: { contains: search, mode: 'insensitive' } },
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    let dbOrders: any[] = [];
    try {
      dbOrders = (await Promise.race([
        prisma.order.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Database query timed out')), 2500)
        ),
      ])) as any[];
    } catch (dbErr: any) {
      console.warn('[Orders API] DB lookup warning (using memory orders):', dbErr?.message);
    }

    const memOrders = getAllOrdersFromMemory();
    const existingNumbers = new Set((dbOrders || []).map((o) => o.orderNumber));
    const merged = [
      ...(dbOrders || []),
      ...memOrders.filter((mo) => !existingNumbers.has(mo.orderNumber)),
    ];

    return NextResponse.json(merged);
  } catch (error: any) {
    console.warn('[Orders API] Database query warning (returning memory list):', error?.message);
    return NextResponse.json(getAllOrdersFromMemory());
  }
}

// POST /api/orders — Create a new customer card order
export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch (e: any) {
      return NextResponse.json(
        { error: 'Invalid request body format', details: 'Unable to parse request JSON' },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      city,
      brandName,
      tagline,
      nameOnCard,
      designation,
      slug,
      finish = 'Sera Signature PVC (LKR 3,500)',
      logoUrl,
      paymentMethod = 'WHATSAPP',
      paymentStatus = 'PENDING',
      fulfillmentStatus = 'ORDER_RECEIVED',
      customAmount,
      unitPrice,
      costPrice = 1500,
      deliveryFee = 350,
      notes,
      bio,
      instagram,
      linkedin,
      facebook,
      tiktok,
    } = body || {};

    // Validate minimum required fields
    if (!customerName || !customerName.toString().trim() || !customerPhone || !customerPhone.toString().trim()) {
      return NextResponse.json(
        { error: 'Please provide at least customer name and WhatsApp phone number.' },
        { status: 400 }
      );
    }

    const cName = customerName.toString().trim();
    const cPhone = customerPhone.toString().trim();
    const cEmail = customerEmail ? customerEmail.toString().trim() : null;
    const cAddress = deliveryAddress ? deliveryAddress.toString().trim() : 'To be confirmed on WhatsApp';
    const cCity = city ? city.toString().trim() : null;
    const bName = brandName ? brandName.toString().trim() : cName;
    const cTagline = tagline ? tagline.toString().trim() : null;
    const nOnCard = nameOnCard ? nameOnCard.toString().trim() : cName;
    const cDesignation = designation ? designation.toString().trim() : 'Professional';
    const cFinish = finish ? finish.toString().trim() : 'Sera Signature PVC (LKR 3,500)';

    const cleanSlug = (slug || nOnCard || cName)
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 24) || 'seracard';

    // Pricing calculation: Allow customAmount or unitPrice override, else default LKR 3,500
    const resolvedUnitPrice =
      customAmount !== undefined && customAmount !== ''
        ? Number(customAmount)
        : unitPrice !== undefined && unitPrice !== ''
        ? Number(unitPrice)
        : 3500;
    const resolvedDelivery = deliveryFee !== undefined && deliveryFee !== '' ? Number(deliveryFee) : 350;
    const totalAmount = resolvedUnitPrice + resolvedDelivery;

    // Generate unique order number (e.g. SERA-89421)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SERA-${randomSuffix}`;

    // Attempt saving order in MongoDB with a timeout fallback
    let orderRecord: any = null;
    let dbErrorMsg: string | null = null;

    try {
      const dbPromise = prisma.order.create({
        data: {
          orderNumber,
          customerName: cName,
          customerPhone: cPhone,
          customerEmail: cEmail,
          deliveryAddress: cAddress,
          city: cCity,
          brandName: bName,
          tagline: cTagline,
          nameOnCard: nOnCard,
          designation: cDesignation,
          slug: cleanSlug,
          finish: cFinish,
          logoUrl: logoUrl || null,
          unitPrice: resolvedUnitPrice,
          costPrice: Number(costPrice) || 1500,
          deliveryFee: resolvedDelivery,
          totalAmount,
          paymentMethod,
          paymentStatus,
          orderStatus: paymentStatus === 'PAID' ? 'PROCESSING' : 'PENDING',
          fulfillmentStatus,
          notes: notes ? notes.toString().trim() : null,
          bio: bio ? bio.toString().trim() : null,
          instagram: instagram ? instagram.toString().trim() : null,
          linkedin: linkedin ? linkedin.toString().trim() : null,
          facebook: facebook ? facebook.toString().trim() : null,
          tiktok: tiktok ? tiktok.toString().trim() : null,
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), 3500)
      );

      orderRecord = await Promise.race([dbPromise, timeoutPromise]);
    } catch (dbErr: any) {
      dbErrorMsg = dbErr?.message || 'Database unavailable';
      console.warn('[Orders API] Database write fallback triggered:', dbErrorMsg);
    }

    if (logoUrl) {
      saveLogo(orderNumber, logoUrl);
    }

    const finalOrder = orderRecord || {
      id: orderNumber,
      orderNumber,
      customerName: cName,
      customerPhone: cPhone,
      customerEmail: cEmail,
      deliveryAddress: cAddress,
      city: cCity,
      brandName: bName,
      tagline: cTagline,
      nameOnCard: nOnCard,
      designation: cDesignation,
      slug: cleanSlug,
      finish: cFinish,
      logoUrl: logoUrl || null,
      unitPrice: resolvedUnitPrice,
      costPrice: Number(costPrice) || 1500,
      deliveryFee: resolvedDelivery,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: paymentStatus === 'PAID' ? 'PROCESSING' : 'PENDING',
      fulfillmentStatus,
      notes: notes ? notes.toString().trim() : null,
      bio: bio ? bio.toString().trim() : null,
      createdAt: new Date().toISOString(),
    };

    // Always persist to resilient memory store
    saveOrderToMemory(finalOrder as any);

    // ─── AUTO-SIGNUP & ACCOUNT PROVISIONING ───
    // When a customer orders a card, provision/link their GoSera account
    const auth = await getOrderAuth(request);
    let matchedUser: any = auth?.user || null;
    let isNewUser = false;
    let plainPassword = '';

    const digitsOnly = cPhone.replace(/[^0-9]/g, '');
    const localPhone = digitsOnly.startsWith('94') ? '0' + digitsOnly.slice(2) : digitsOnly;
    const intlPhone = digitsOnly.startsWith('0') ? '94' + digitsOnly.slice(1) : digitsOnly;
    const plusIntlPhone = '+' + intlPhone;

    // 1. If not already logged in, check if user already exists (by email, phone variations, or cardSlug)
    if (!matchedUser) {
      const orConditions: any[] = [
        { cardSlug: { equals: cleanSlug, mode: 'insensitive' } },
      ];
      if (cEmail) {
        orConditions.push({ email: { equals: cEmail.toLowerCase(), mode: 'insensitive' } });
      }
      if (digitsOnly.length >= 7) {
        orConditions.push(
          { phone: { equals: cPhone } },
          { phone: { equals: digitsOnly } },
          { phone: { equals: localPhone } },
          { phone: { equals: intlPhone } },
          { phone: { equals: plusIntlPhone } }
        );
      }

      try {
        matchedUser = await Promise.race([
          prisma.user.findFirst({
            where: { OR: orConditions },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
        ]);
      } catch {}

      if (!matchedUser && cEmail) {
        matchedUser = getUserFromMemory(cEmail);
      }
      if (!matchedUser && digitsOnly) {
        matchedUser = getUserFromMemory(localPhone) || getUserFromMemory(digitsOnly);
      }
      if (!matchedUser) {
        matchedUser = getUserFromMemory(cleanSlug);
      }
    }

    let userEmail = cEmail || (matchedUser?.email ? matchedUser.email : `${cleanSlug}@seranex.lk`);

    if (matchedUser) {
      // User exists — link cardSlug if unassigned or upgrading
      try {
        if (!matchedUser.cardSlug || matchedUser.cardSlug === 'seracard') {
          await prisma.user.update({
            where: { id: matchedUser.id },
            data: { cardSlug: cleanSlug, plan: 'PRO' },
          });
        }
      } catch {}
      saveUserToMemory({
        ...matchedUser,
        cardSlug: matchedUser.cardSlug || cleanSlug,
        plan: 'PRO',
      });
    } else {
      // New customer — Auto sign-up with generated credentials!
      isNewUser = true;
      plainPassword = cleanSlug.length >= 4 ? `${cleanSlug}1234` : `${cleanSlug}2026`;
      const passwordHash = hashPassword(plainPassword);

      // Verify email doesn't collide
      try {
        const existingEmailUser = await prisma.user.findUnique({
          where: { email: userEmail.toLowerCase() },
        });
        if (existingEmailUser) {
          userEmail = `${cleanSlug}${digitsOnly.slice(-4) || Math.floor(100 + Math.random() * 900)}@seranex.lk`;
        }
      } catch {}

      try {
        matchedUser = await Promise.race([
          prisma.user.create({
            data: {
              name: nOnCard || cName,
              email: userEmail.toLowerCase(),
              phone: cPhone,
              passwordHash,
              role: 'USER',
              plan: 'PRO',
              cardSlug: cleanSlug,
            },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
        ]);
      } catch (createErr: any) {
        console.warn('[Orders API] Database user creation fallback engaged:', createErr?.message);
      }

      if (!matchedUser) {
        matchedUser = {
          id: `usr_${cleanSlug}_${Date.now()}`,
          name: nOnCard || cName,
          email: userEmail.toLowerCase(),
          phone: cPhone,
          passwordHash,
          role: 'USER',
          plan: 'PRO',
          cardSlug: cleanSlug,
          createdAt: new Date().toISOString(),
        };
      }

      saveUserToMemory({
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone,
        passwordHash: matchedUser.passwordHash,
        role: matchedUser.role,
        plan: matchedUser.plan,
        cardSlug: matchedUser.cardSlug,
        createdAt: matchedUser.createdAt?.toString() || new Date().toISOString(),
      });
    }

    // Set user session cookie (30 days) so customer is immediately authenticated
    try {
      const cookieStore = cookies();
      cookieStore.set({
        name: 'user_session',
        value: String(matchedUser.id),
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });
    } catch (cookieErr) {
      console.warn('[Orders API] Cookie session set warning:', cookieErr);
    }

    // ─── AUTO-DEPLOY DIGITAL CARD PROFILE (PRESERVE IF ALREADY EXISTS) ───
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
    const origin = request.headers.get('origin') || `https://${rootDomain}`;

    let existingClient: any = null;
    try {
      existingClient = await Promise.race([
        prisma.client.findUnique({ where: { slug: cleanSlug } }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
    } catch {}
    const existingMemCard = getCardFromMemory(cleanSlug);

    // Only create/generate digital profile if user does not already have an active profile
    if (!existingClient?.htmlContent && !existingMemCard?.htmlContent) {
      try {
        const generatedCardHtml = generateTemplateHtml('personal_hero', {
          slug: cleanSlug,
          name: nOnCard || cName,
          title: cDesignation || 'Professional',
          company: bName || 'GoSera',
          phone: cPhone,
          whatsapp: cPhone.replace(/[^0-9]/g, ''),
          email: cEmail || '',
          avatarUrl: logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          bio: bio || (cTagline ? `${bName} — ${cTagline}` : `Welcome to ${nOnCard || cName}'s official GoSera digital profile.`),
          location: cCity ? `${cCity}, Sri Lanka` : 'Colombo, Sri Lanka',
          website: `https://${cleanSlug}.${rootDomain}`,
          instagram: instagram || undefined,
          linkedin: linkedin || undefined,
          facebook: facebook || undefined,
          tiktok: tiktok || undefined,
        });

        // Upsert Client profile in DB
        try {
          await Promise.race([
            prisma.client.upsert({
              where: { slug: cleanSlug },
              update: {},
              create: {
                slug: cleanSlug,
                htmlContent: generatedCardHtml,
              },
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
          ]);
        } catch (clientDbErr) {
          console.warn('[Orders API] Client profile DB upsert fallback:', clientDbErr);
        }

        // Save in resilient in-memory card store
        saveCardToMemory(cleanSlug, generatedCardHtml, {
          name: nOnCard || cName,
          title: cDesignation,
          company: bName,
          phone: cPhone,
          email: cEmail,
        });
      } catch (tmplErr) {
        console.warn('[Orders API] Template generation warning:', tmplErr);
      }
    }

    // Prepare response based on payment method
    let payhereParams = null;
    let whatsappUrl = null;

    const brandWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP || process.env.OWNER_WHATSAPP_NUMBER || '94728382638';
    const logoViewUrl = `${origin}/api/orders/logo?id=${orderNumber}`;

    if (paymentMethod === 'PAYHERE') {
      const hash = generatePayHereHash(orderNumber, totalAmount);
      const nameParts = cName.split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || 'Name';

      payhereParams = {
        merchant_id: PAYHERE_CONFIG.merchantId,
        return_url: `${origin}/order/success?order_id=${finalOrder.id || orderNumber}`,
        cancel_url: `${origin}/#pricing`,
        notify_url: `${origin}/api/payhere/notify`,
        order_id: orderNumber,
        items: `Sera PVC Pro Card (${cFinish}) - ${cleanSlug}.${rootDomain}`,
        currency: PAYHERE_CONFIG.currency,
        amount: totalAmount.toFixed(2),
        first_name: firstName,
        last_name: lastName,
        email: cEmail || 'orders@seranex.lk',
        phone: cPhone,
        address: cAddress,
        city: cCity || 'Colombo',
        country: 'Sri Lanka',
        hash,
        checkout_url: PAYHERE_CONFIG.checkoutUrl,
      };
    }

    // Build WhatsApp Order Link with Credentials & Portal Link
    const waMessage = [
      `*NEW SERA CARD ORDER #${orderNumber}*`,
      `---------------------------------`,
      `*Customer:* ${cName}`,
      `*Phone:* ${cPhone}`,
      cEmail ? `*Email:* ${cEmail}` : '',
      `*Delivery Address:* ${cAddress}${cCity ? ', ' + cCity : ''}`,
      ``,
      `*CARD DETAILS:*`,
      `*Package / Finish:* ${cFinish}`,
      `*Brand (Front):* ${bName}`,
      cTagline ? `*Tagline:* ${cTagline}` : '',
      `*Name (Back):* ${nOnCard}`,
      cDesignation ? `*Title:* ${cDesignation}` : '',
      `*Sub-page:* ${cleanSlug}.${rootDomain}`,
      logoUrl
        ? `*Uploaded Logo:* ${logoViewUrl}\n*(Click the link above to view/download the logo, or attach it directly in this chat)*`
        : `*Logo:* To be sent directly in this chat`,
      ``,
      `*PAYMENT & TOTAL:*`,
      `*Price:* LKR ${resolvedUnitPrice.toLocaleString()}`,
      `*Delivery Fee:* LKR ${resolvedDelivery.toLocaleString()}`,
      `*Total Amount:* LKR ${totalAmount.toLocaleString()}`,
      `*Payment Method:* ${paymentMethod === 'MINTPAY' ? `Mintpay (3x Installments: 3 x LKR ${(totalAmount / 3).toFixed(2)})` : paymentMethod}`,
      notes ? `*Notes:* ${notes}` : '',
      `---------------------------------`,
      `*PORTAL & PROFILE ACCESS:*`,
      `*Live Profile:* https://${cleanSlug}.${rootDomain}`,
      `*Portal Login:* ${origin}/login`,
      `*Username / Email:* ${userEmail}`,
      isNewUser
        ? `*Temporary Password:* ${plainPassword}\n*(You can change this anytime in your dashboard)*`
        : `*(Linked to your existing GoSera account)*`,
      `---------------------------------`,
      paymentMethod === 'MINTPAY'
        ? `Please send me the Mintpay payment link and confirm my card design proof!`
        : `Please confirm my order and share design preview!`,
    ]
      .filter(Boolean)
      .join('\n');

    whatsappUrl = `https://wa.me/${brandWhatsapp}?text=${encodeURIComponent(waMessage)}`;

    // Dispatch Order Confirmation Email via Resend if email was provided
    if (cEmail) {
      sendOrderConfirmationEmail({
        to: cEmail,
        name: cName,
        orderNumber,
        totalAmount,
        finish: cFinish,
        slug: cleanSlug,
        accountEmail: userEmail,
        temporaryPassword: isNewUser ? plainPassword : undefined,
        loginUrl: `${origin}/login`,
      }).catch((emailErr) => {
        console.warn('[Orders API] Email confirmation delivery warning:', emailErr?.message);
      });
    }

    return NextResponse.json({
      success: true,
      order: finalOrder,
      payhereParams,
      whatsappUrl,
      dbStatus: dbErrorMsg ? 'fallback' : 'saved',
      accountCreated: isNewUser,
      accountDetails: {
        isNewUser,
        email: userEmail,
        password: isNewUser ? plainPassword : null,
        slug: cleanSlug,
        dashboardUrl: `${origin}/dashboard`,
        loginUrl: `${origin}/login`,
        liveProfileUrl: `https://${cleanSlug}.${rootDomain}`,
      },
    });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to process order', details: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
