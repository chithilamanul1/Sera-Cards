export interface StoredOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  city?: string | null;
  brandName: string;
  tagline?: string | null;
  nameOnCard: string;
  designation?: string | null;
  slug: string;
  finish: string;
  logoUrl?: string | null;
  unitPrice: number;
  costPrice: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  fulfillmentStatus: string;
  notes?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt?: string;
}

declare const globalThis: {
  __gosera_orders?: Map<string, StoredOrder>;
} & typeof global;

function getStore(): Map<string, StoredOrder> {
  if (!globalThis.__gosera_orders) {
    globalThis.__gosera_orders = new Map();

    // Pre-seed sample showcase orders
    const seedOrders: StoredOrder[] = [
      {
        id: 'ord_demo_01',
        orderNumber: 'SERA-78210',
        customerName: 'Chithila Manul',
        customerPhone: '0728382638',
        customerEmail: 'chithilamanul1@gmail.com',
        deliveryAddress: 'No. 20 A Amuna Rd, Seeduwa',
        city: 'Seeduwa',
        brandName: 'SERANEX',
        tagline: 'Web & Software Solutions',
        nameOnCard: 'Chithila Manul',
        designation: 'CEO & Founder',
        slug: 'chithila',
        finish: 'Sera Signature PVC (LKR 3,500)',
        unitPrice: 3500,
        costPrice: 1500,
        deliveryFee: 350,
        totalAmount: 3850,
        paymentMethod: 'WHATSAPP',
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
        fulfillmentStatus: 'ENCODING_CHIP',
        notes: 'Priority UV print with high contrast dynamic QR',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'ord_demo_02',
        orderNumber: 'SERA-64192',
        customerName: 'Kosala Fernando',
        customerPhone: '0711691008',
        customerEmail: 'kosala.codeaeron@gmail.com',
        deliveryAddress: 'No 113A, Hakmana Road, Matara',
        city: 'Matara',
        brandName: 'CODEAERON',
        tagline: 'Enterprise Software Engineering',
        nameOnCard: 'Kosala Fernando',
        designation: 'Founder & Managing Director',
        slug: 'kosala',
        finish: 'Matte & Gloss UV Print (LKR 5,000)',
        unitPrice: 5000,
        costPrice: 1500,
        deliveryFee: 350,
        totalAmount: 5350,
        paymentMethod: 'PAYHERE',
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
        fulfillmentStatus: 'PRINTING',
        notes: 'Matte black finish with gold foil text',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];

    for (const ord of seedOrders) {
      globalThis.__gosera_orders.set(ord.orderNumber, ord);
      globalThis.__gosera_orders.set(ord.id, ord);
    }
  }
  return globalThis.__gosera_orders;
}

export function saveOrderToMemory(order: StoredOrder): StoredOrder {
  const store = getStore();
  store.set(order.orderNumber, order);
  store.set(order.id, order);
  return order;
}

export function getOrderFromMemory(identifier: string): StoredOrder | null {
  const store = getStore();
  return store.get(identifier) || null;
}

export function getAllOrdersFromMemory(): StoredOrder[] {
  const store = getStore();
  const seen = new Set<string>();
  const list: StoredOrder[] = [];
  for (const ord of store.values()) {
    if (!seen.has(ord.orderNumber)) {
      seen.add(ord.orderNumber);
      list.push(ord);
    }
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function deleteOrderFromMemory(identifier: string): boolean {
  const store = getStore();
  const existing = store.get(identifier);
  if (existing) {
    store.delete(existing.orderNumber);
    store.delete(existing.id);
    return true;
  }
  return false;
}
