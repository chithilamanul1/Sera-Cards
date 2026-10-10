export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  role: string;
  plan: string;
  cardSlug: string;
  createdAt: string;
}

declare const globalThis: {
  __gosera_users?: Map<string, StoredUser>;
} & typeof global;

function getStore(): Map<string, StoredUser> {
  if (!globalThis.__gosera_users) {
    globalThis.__gosera_users = new Map();
  }
  return globalThis.__gosera_users;
}

/**
 * Cache user in resilient memory store (keyed by both email and id)
 */
export function saveUserToMemory(user: StoredUser) {
  const store = getStore();
  store.set(user.email.toLowerCase().trim(), user);
  store.set(user.id, user);
}

/**
 * Retrieve user from memory store by email or ID
 */
export function getUserFromMemory(identifier: string): StoredUser | null {
  const store = getStore();
  const clean = identifier.toLowerCase().trim();
  return (
    store.get(clean) ||
    store.get(identifier) ||
    null
  );
}
