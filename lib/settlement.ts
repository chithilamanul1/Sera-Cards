/**
 * Settlement & Financial Calculator for Sera Cards
 * Standard production cost per card: LKR 1,500 (Reserved for raw PVC/NTAG215 chips)
 * Profit Split: 50% to Friend / Partner, 50% to Owner / You
 */

export const PRODUCTION_COST_PER_CARD = 1500;
export const PARTNER_COMMISSION_PERCENT = 0.50; // 50%
export const OWNER_PROFIT_PERCENT = 0.50; // 50%

/**
 * Returns current ISO week identifier, e.g. "2026-W40"
 */
export function getCurrentWeekId(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Get date range (Monday to Sunday) for an ISO week string
 */
export function getWeekDateRange(weekId: string): { start: Date; end: Date } {
  const parts = weekId.split('-W');
  const year = parseInt(parts[0], 10);
  const week = parseInt(parts[1], 10);

  // 4th of January is always in week 1
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const mondayWeek1 = new Date(jan4.getTime() - (dayOfWeek - 1) * 86400000);

  const start = new Date(mondayWeek1.getTime() + (week - 1) * 7 * 86400000);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start.getTime() + 6 * 86400000);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
}

export interface OperationalMetrics {
  uncollectedCash: number;       // Pending cash from clients
  totalMaterialBuffer: number;   // LKR 1,500 * paid cards (strictly for restocking PVC/chips)
  totalPaidRevenue: number;      // Total collected revenue
  totalProductionCost: number;   // Total production cost
  netProfitPool: number;         // Total net profit pool
  friendCommission: number;      // 50% commission ready for friend
  ownerShare: number;            // 50% profit share to transfer to you
  totalCardsSold: number;        // Paid cards count
  pendingCardsCount: number;     // Pending orders count
}

export function computeOperationalMetrics(orders: any[]): OperationalMetrics {
  let uncollectedCash = 0;
  let totalMaterialBuffer = 0;
  let totalPaidRevenue = 0;
  let totalPaidCards = 0;
  let pendingCards = 0;

  for (const order of orders) {
    const isPaid = order.paymentStatus === 'PAID';
    const amount = Number(order.totalAmount || order.unitPrice || 3500);
    const cost = Number(order.costPrice || PRODUCTION_COST_PER_CARD);

    if (isPaid) {
      totalPaidRevenue += amount;
      totalMaterialBuffer += cost;
      totalPaidCards += 1;
    } else {
      uncollectedCash += amount;
      pendingCards += 1;
    }
  }

  // Net Profit Pool = Revenue collected - Material/Production Buffer
  const netProfitPool = Math.max(0, totalPaidRevenue - totalMaterialBuffer);
  const friendCommission = Math.round(netProfitPool * PARTNER_COMMISSION_PERCENT);
  const ownerShare = netProfitPool - friendCommission;

  return {
    uncollectedCash,
    totalMaterialBuffer,
    totalPaidRevenue,
    totalProductionCost: totalMaterialBuffer,
    netProfitPool,
    friendCommission,
    ownerShare,
    totalCardsSold: totalPaidCards,
    pendingCardsCount: pendingCards,
  };
}
