import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getOrderFromMemory, saveOrderToMemory, deleteOrderFromMemory } from '@/lib/orderStore';

export const dynamic = 'force-dynamic';

function isAuthorized(request: Request) {
  const session = cookies().get('admin_session');
  if (session && session.value === 'authenticated') {
    return true;
  }
  const authHeader = request.headers.get('x-admin-secret');
  return authHeader === process.env.ADMIN_SECRET;
}

// GET /api/orders/[id] — Fetch specific order
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let order: any = null;
    try {
      order = await Promise.race([
        prisma.order.findUnique({ where: { id: params.id } }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500)),
      ]);
    } catch {}

    if (!order) {
      order = getOrderFromMemory(params.id);
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('[Orders/[id] GET] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/orders/[id] — Update order status / payment status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderStatus, fulfillmentStatus, paymentStatus, unitPrice, notes } = body;

    const dataToUpdate: any = {};
    if (orderStatus) dataToUpdate.orderStatus = orderStatus;
    if (fulfillmentStatus) dataToUpdate.fulfillmentStatus = fulfillmentStatus;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;
    if (unitPrice !== undefined) {
      dataToUpdate.unitPrice = Number(unitPrice);
      dataToUpdate.totalAmount = Number(unitPrice) + 350;
    }
    if (notes !== undefined) dataToUpdate.notes = notes;

    let updated: any = null;
    try {
      updated = await Promise.race([
        prisma.order.update({
          where: { id: params.id },
          data: dataToUpdate,
        }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500)),
      ]);
    } catch (dbErr: any) {
      console.warn('[Orders/[id] PATCH] DB update fallback:', dbErr?.message);
    }

    // Always update memory store
    const memOrder = getOrderFromMemory(params.id);
    if (memOrder) {
      const merged = { ...memOrder, ...dataToUpdate, updatedAt: new Date().toISOString() };
      saveOrderToMemory(merged);
      if (!updated) updated = merged;
    }

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[Orders/[id] PATCH] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/orders/[id] — Delete an order
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    try {
      await Promise.race([
        prisma.order.delete({ where: { id: params.id } }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500)),
      ]);
    } catch (dbErr: any) {
      console.warn('[Orders/[id] DELETE] DB delete warning:', dbErr?.message);
    }

    deleteOrderFromMemory(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Orders/[id] DELETE] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

