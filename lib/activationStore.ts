import prisma from '@/lib/prisma';

export interface StoredActivation {
  id: string;
  code: string;
  batch: string;
  status: 'UNCLAIMED' | 'ACTIVATED';
  claimedBy?: string | null;
  assignedSlug?: string | null;
  activatedAt?: string | null;
  createdAt: string;
}

declare const globalThis: {
  __gosera_activations?: Map<string, StoredActivation>;
} & typeof global;

if (!globalThis.__gosera_activations) {
  globalThis.__gosera_activations = new Map();
  // Pre-seed a few sample ready-to-test unassigned cards
  const initialCodes = ['SERA-7001', 'SERA-7002', 'SERA-7003', 'SERA-VIP-01', 'SERA-VIP-02'];
  for (const c of initialCodes) {
    globalThis.__gosera_activations.set(c.toUpperCase(), {
      id: `act_${c.toLowerCase()}`,
      code: c.toUpperCase(),
      batch: 'BATCH-ALPHA',
      status: 'UNCLAIMED',
      createdAt: new Date().toISOString(),
    });
  }
}

/**
 * Retrieve activation record by code
 */
export async function getActivation(code: string): Promise<StoredActivation | null> {
  const cleanCode = code.trim().toUpperCase();

  // 1. Check memory store first for instant response
  if (globalThis.__gosera_activations && globalThis.__gosera_activations.has(cleanCode)) {
    return globalThis.__gosera_activations.get(cleanCode)!;
  }

  // 2. Check MongoDB with timeout
  try {
    const dbRecord = await Promise.race([
      (prisma as any).cardActivation.findUnique({
        where: { code: cleanCode },
      }),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
    ]);

    if (dbRecord) {
      const stored: StoredActivation = {
        id: dbRecord.id,
        code: dbRecord.code,
        batch: dbRecord.batch || 'DEFAULT',
        status: dbRecord.status as any,
        claimedBy: dbRecord.claimedBy,
        assignedSlug: dbRecord.assignedSlug,
        activatedAt: dbRecord.activatedAt?.toISOString() || null,
        createdAt: dbRecord.createdAt?.toISOString() || new Date().toISOString(),
      };
      globalThis.__gosera_activations.set(cleanCode, stored);
      return stored;
    }
  } catch {
    // DB not available or table not migrated yet
  }

  return null;
}

/**
 * Mark activation code as claimed & linked to user/slug
 */
export async function claimActivation(
  code: string,
  claimedBy: string,
  assignedSlug: string
): Promise<StoredActivation> {
  const cleanCode = code.trim().toUpperCase();
  const now = new Date().toISOString();

  const existing = await getActivation(cleanCode);
  const updated: StoredActivation = {
    id: existing?.id || `act_${cleanCode.toLowerCase()}`,
    code: cleanCode,
    batch: existing?.batch || 'DIRECT',
    status: 'ACTIVATED',
    claimedBy,
    assignedSlug,
    activatedAt: now,
    createdAt: existing?.createdAt || now,
  };

  globalThis.__gosera_activations.set(cleanCode, updated);

  // Try updating DB in background
  try {
    await Promise.race([
      (prisma as any).cardActivation.upsert({
        where: { code: cleanCode },
        create: {
          code: cleanCode,
          batch: updated.batch,
          status: 'ACTIVATED',
          claimedBy,
          assignedSlug,
          activatedAt: new Date(),
        },
        update: {
          status: 'ACTIVATED',
          claimedBy,
          assignedSlug,
          activatedAt: new Date(),
        },
      }),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
    ]);
  } catch (err) {
    console.warn('[Activation] DB write fallback engaged:', err);
  }

  return updated;
}

/**
 * Generate a new batch of unassigned activation codes
 */
export async function createBatchCodes(
  count: number = 10,
  prefix: string = 'SERA',
  batchName: string = 'BATCH-1'
): Promise<StoredActivation[]> {
  const created: StoredActivation[] = [];

  for (let i = 0; i < count; i++) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${prefix}-${randomNum}`.toUpperCase();

    const record: StoredActivation = {
      id: `act_${Date.now()}_${i}`,
      code,
      batch: batchName,
      status: 'UNCLAIMED',
      createdAt: new Date().toISOString(),
    };

    globalThis.__gosera_activations.set(code, record);
    created.push(record);

    // Persist to DB in background
    try {
      (prisma as any).cardActivation
        ?.create({
          data: {
            code,
            batch: batchName,
            status: 'UNCLAIMED',
          },
        })
        .catch(() => {});
    } catch {}
  }

  return created;
}

/**
 * List all activation codes
 */
export function getAllActivations(): StoredActivation[] {
  if (!globalThis.__gosera_activations) return [];
  return Array.from(globalThis.__gosera_activations.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
