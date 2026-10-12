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

function getStore(): Map<string, StoredCard> {
  if (!globalThis.__gosera_cards) {
    globalThis.__gosera_cards = new Map();
  }
  return globalThis.__gosera_cards;
}

/**
 * Persist or update card in resilient in-memory cache
 */
export function saveCardToMemory(
  slug: string,
  htmlContent?: string | null,
  metadata?: any,
  cardId?: string
): StoredCard {
  const store = getStore();
  const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  const existing = store.get(cleanSlug);
  const now = new Date().toISOString();

  const stored: StoredCard = {
    id: cardId || existing?.id || `mem_${cleanSlug}_${Date.now()}`,
    slug: cleanSlug,
    htmlContent: htmlContent || existing?.htmlContent || '',
    metadata: metadata || existing?.metadata,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    _count: existing?._count || { leads: 0 },
  };

  store.set(cleanSlug, stored);
  return stored;
}

/**
 * Retrieve card by slug from memory store
 */
export function getCardFromMemory(slug: string): StoredCard | null {
  const store = getStore();
  const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  return store.get(cleanSlug) || null;
}

/**
 * Retrieve all cards cached in memory
 */
export function getAllCardsFromMemory(): StoredCard[] {
  const store = getStore();
  return Array.from(store.values());
}

/**
 * Remove card from memory store by slug or ID
 */
export function deleteCardFromMemory(slugOrId: string): boolean {
  const store = getStore();
  const cleanSlug = slugOrId.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  if (store.has(cleanSlug)) {
    return store.delete(cleanSlug);
  }
  for (const [key, card] of store.entries()) {
    if (card.id === slugOrId || card.slug === cleanSlug) {
      return store.delete(key);
    }
  }
  return false;
}

