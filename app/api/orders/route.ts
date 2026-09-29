import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { generatePayHereHash, PAYHERE_CONFIG } from '@/lib/payhere';
import { saveLogo } from '@/lib/logoStore';
import { sendOrderConfirmationEmail } from '@/lib/mail';

// Helper to check admin authorization
function isAuthorized(request: Request) {
  const session = cookies().get('admin_session');
  if (session && session.value === 'authenticated') {
    return true;
  }
  const authHeader = request.headers.get('x-admin-secret');
  return authHeader === process.env.ADMIN_SECRET;
}

// GET /api/orders — List customer orders (Admin only)
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const whereClause: any = {};
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

    const orders = await Promise.race([
      prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timed out')), 4000)
      ),
    ]);

    return NextResponse.json(orders);
  } catch (error: any) {
    console.warn('[Orders API] Database query warning (returning empty list):', error?.message);
    return NextResponse.json([]);
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

    // Prepare response based on payment method
    let payhereParams = null;
    let whatsappUrl = null;

    const brandWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP || process.env.OWNER_WHATSAPP_NUMBER || '94728382638';
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
    const origin = request.headers.get('origin') || `https://${rootDomain}`;
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

    // Build WhatsApp Order Link
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
      `*Payment Method:* ${paymentMethod}`,
      notes ? `*Notes:* ${notes}` : '',
      `---------------------------------`,
      `Please confirm my order and share design preview!`,
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
    });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to process order', details: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
