import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPayHereNotification } from '@/lib/payhere';

export const dynamic = 'force-dynamic';

/**
 * POST /api/payhere/notify
 * PayHere Instant Payment Notification (IPN) webhook listener
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any = {};

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        body[key] = value.toString();
      });
    } else {
      body = await request.json();
    }

    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = body;

    console.log('[PayHere IPN] Received notification for Order:', order_id, 'Status:', status_code);

    if (!merchant_id || !order_id || !md5sig) {
      return new Response('Invalid payload', { status: 400 });
    }

    // Verify MD5 signature
    const isValid = verifyPayHereNotification({
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    });

    if (!isValid) {
      console.error('[PayHere IPN] Invalid MD5 signature for Order:', order_id);
      return new Response('Signature verification failed', { status: 400 });
    }

    // Check status code: 2 = Success, 0 = Pending, -1 = Canceled, -2 = Failed
    if (status_code === '2') {
      await prisma.order.updateMany({
        where: { orderNumber: order_id },
        data: {
          paymentStatus: 'PAID',
          orderStatus: 'PROCESSING',
          payherePaymentId: payment_id,
        },
      });
      console.log(`[PayHere IPN] Order ${order_id} marked as PAID.`);
    } else if (status_code === '-2') {
      await prisma.order.updateMany({
        where: { orderNumber: order_id },
        data: {
          paymentStatus: 'FAILED',
        },
      });
      console.warn(`[PayHere IPN] Order ${order_id} payment failed.`);
    }

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('[PayHere IPN Error]:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
