import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import {
  computeOperationalMetrics,
  getCurrentWeekId,
  getWeekDateRange,
  PRODUCTION_COST_PER_CARD,
} from '@/lib/settlement';

function isAuthorized(request: Request) {
  const session = cookies().get('admin_session');
  if (session && session.value === 'authenticated') return true;
  const authHeader = request.headers.get('x-admin-secret');
  return authHeader === process.env.ADMIN_SECRET;
}

// GET /api/settlements — Get live metrics & historical weekly ledgers
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentWeekId = getCurrentWeekId();
    const { start: weekStart, end: weekEnd } = getWeekDateRange(currentWeekId);

    // Fetch all orders to compute operational metrics
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Compute all-time live metrics
    const allTimeMetrics = computeOperationalMetrics(allOrders);

    // Compute current week's unsettled orders
    const currentWeekOrders = allOrders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= weekStart && createdAt <= weekEnd && !order.settlementId;
    });
    const currentWeekMetrics = computeOperationalMetrics(currentWeekOrders);

    // Fetch historical settlements
    const settlements = await prisma.weeklySettlement.findMany({
      orderBy: { weekId: 'desc' },
    });

    return NextResponse.json({
      currentWeekId,
      weekRange: {
        start: weekStart.toISOString(),
        end: weekEnd.toISOString(),
      },
      liveMetrics: allTimeMetrics,
      currentWeekMetrics,
      settlements,
    });
  } catch (error: any) {
    console.error('Failed to fetch settlements:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/settlements — Settle a week (Creates a permanent locked ledger)
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const weekId = body.weekId || getCurrentWeekId();
    const notes = body.notes || '';

    const { start: weekStart, end: weekEnd } = getWeekDateRange(weekId);

    // Find all paid orders for that week that are not yet settled
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
        settlementId: null,
      },
    });

    const metrics = computeOperationalMetrics(orders);

    // Create or update WeeklySettlement
    const settlement = await prisma.weeklySettlement.upsert({
      where: { weekId },
      create: {
        weekId,
        startDate: weekStart,
        endDate: weekEnd,
        totalCardsSold: metrics.totalCardsSold,
        totalRevenue: metrics.totalPaidRevenue,
        productionCostTotal: metrics.totalProductionCost,
        netProfitPool: metrics.netProfitPool,
        friendCommission: metrics.friendCommission,
        ownerProfit: metrics.ownerShare,
        settlementStatus: 'SETTLED',
        settledAt: new Date(),
        notes,
      },
      update: {
        totalCardsSold: metrics.totalCardsSold,
        totalRevenue: metrics.totalPaidRevenue,
        productionCostTotal: metrics.totalProductionCost,
        netProfitPool: metrics.netProfitPool,
        friendCommission: metrics.friendCommission,
        ownerProfit: metrics.ownerShare,
        settlementStatus: 'SETTLED',
        settledAt: new Date(),
        notes,
      },
    });

    // Mark the settled orders with this settlement ID
    if (orders.length > 0) {
      await prisma.order.updateMany({
        where: {
          id: { in: orders.map((o) => o.id) },
        },
        data: {
          settlementId: settlement.id,
        },
      });
    }

    return NextResponse.json({ success: true, settlement });
  } catch (error: any) {
    console.error('Failed to settle week:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
