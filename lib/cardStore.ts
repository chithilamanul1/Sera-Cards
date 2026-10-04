export interface StoredCard {
  id: string;
  slug: string;
  htmlContent: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  _count?: { leads: number };
}

declare const globalThis: {
  __gosera_cards?: Map<string, StoredCard>;
} & typeof global;

if (!globalThis.__gosera_cards) {
  globalThis.__gosera_cards = new Map();
}

/**
 * Persist or update card in resilient in-memory cache
 */
export function saveCardToMemory(
  slug: string,
  htmlContent: string,
  metadata?: any,
  cardId?: string
): StoredCard {
  if (!globalThis.__gosera_cards) {
    globalThis.__gosera_cards = new Map();
  }

  const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  const existing = globalThis.__gosera_cards.get(cleanSlug);
  const now = new Date().toISOString();

  const stored: StoredCard = {
    id: cardId || existing?.id || `mem_${cleanSlug}_${Date.now()}`,
    slug: cleanSlug,
    htmlContent,
    metadata: metadata || existing?.metadata,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    _count: existing?._count || { leads: 0 },
  };

  globalThis.__gosera_cards.set(cleanSlug, stored);
  return stored;
}

/**
 * Retrieve card by slug from memory store
 */
export function getCardFromMemory(slug: string): StoredCard | null {
  if (!globalThis.__gosera_cards) return null;
  const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  return globalThis.__gosera_cards.get(cleanSlug) || null;
}

/**
 * Retrieve all cards cached in memory
 */
export function getAllCardsFromMemory(): StoredCard[] {
  if (!globalThis.__gosera_cards) return [];
  return Array.from(globalThis.__gosera_cards.values());
}
