import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { generatePayHereHash, PAYHERE_CONFIG } from '@/lib/payhere';

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

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders — Create a new customer card order
export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      finish = 'Standard PVC',
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
    } = body;

    // Validate minimum required fields
    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Please provide at least customer name and WhatsApp phone number.' },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || nameOnCard || customerName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 24);

    // Pricing calculation: Allow customAmount or unitPrice override, else default LKR 3,500
    const resolvedUnitPrice = customAmount !== undefined ? Number(customAmount) : (unitPrice !== undefined ? Number(unitPrice) : 3500);
    const resolvedDelivery = deliveryFee !== undefined ? Number(deliveryFee) : 350;
    const totalAmount = resolvedUnitPrice + resolvedDelivery;

    // Generate unique order number (e.g. SERA-89421)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SERA-${randomSuffix}`;

    // Save order in MongoDB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        deliveryAddress: deliveryAddress ? deliveryAddress.trim() : 'To be confirmed on WhatsApp',
        city: city ? city.trim() : null,
        brandName: brandName ? brandName.trim() : customerName.trim(),
        tagline: tagline ? tagline.trim() : null,
        nameOnCard: nameOnCard ? nameOnCard.trim() : customerName.trim(),
        designation: designation ? designation.trim() : 'Professional',
        slug: cleanSlug,
        finish,
        logoUrl: logoUrl || null,
        unitPrice: resolvedUnitPrice,
        costPrice: Number(costPrice) || 1500,
        deliveryFee: resolvedDelivery,
        totalAmount,
        paymentMethod,
        paymentStatus,
        orderStatus: paymentStatus === 'PAID' ? 'PROCESSING' : 'PENDING',
        fulfillmentStatus,
        notes: notes ? notes.trim() : null,
        bio: bio ? bio.trim() : null,
        instagram: instagram ? instagram.trim() : null,
        linkedin: linkedin ? linkedin.trim() : null,
        facebook: facebook ? facebook.trim() : null,
        tiktok: tiktok ? tiktok.trim() : null,
      },
    });

    // Prepare response based on payment method
    let payhereParams = null;
    let whatsappUrl = null;

    const brandWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '94728382638';
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

    if (paymentMethod === 'PAYHERE') {
      const hash = generatePayHereHash(orderNumber, totalAmount);
      const nameParts = customerName.trim().split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || 'Name';

      const origin = request.headers.get('origin') || `https://${rootDomain}`;

      payhereParams = {
        merchant_id: PAYHERE_CONFIG.merchantId,
        return_url: `${origin}/order/success?order_id=${order.id}`,
        cancel_url: `${origin}/#pricing`,
        notify_url: `${origin}/api/payhere/notify`,
        order_id: orderNumber,
        items: `Sera PVC Pro Card (${finish}) - ${cleanSlug}.${rootDomain}`,
        currency: PAYHERE_CONFIG.currency,
        amount: totalAmount.toFixed(2),
        first_name: firstName,
        last_name: lastName,
        email: customerEmail || 'orders@seranex.lk',
        phone: customerPhone,
        address: deliveryAddress,
        city: city || 'Colombo',
        country: 'Sri Lanka',
        hash,
        checkout_url: PAYHERE_CONFIG.checkoutUrl,
      };
    }

    // Build WhatsApp Order Link
    const waMessage = [
      `*NEW SERA CARD ORDER #${orderNumber}*`,
      `---------------------------------`,
      `*Customer:* ${customerName}`,
      `*Phone:* ${customerPhone}`,
      customerEmail ? `*Email:* ${customerEmail}` : '',
      `*Delivery Address:* ${deliveryAddress}${city ? ', ' + city : ''}`,
      ``,
      `*CARD DETAILS:*`,
      `*Brand (Front):* ${brandName}`,
      tagline ? `*Tagline:* ${tagline}` : '',
      `*Name (Back):* ${nameOnCard}`,
      designation ? `*Title:* ${designation}` : '',
      `*Sub-page:* ${cleanSlug}.${rootDomain}`,
      `*Finish:* ${finish}`,
      logoUrl ? `*Logo:* Included (Uploaded in portal)` : `*Logo:* To be sent on WhatsApp`,
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

    return NextResponse.json({
      success: true,
      order,
      payhereParams,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to process order', details: error.message },
      { status: 500 }
    );
  }
}
