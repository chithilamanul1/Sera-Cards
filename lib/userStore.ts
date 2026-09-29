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

if (!globalThis.__gosera_users) {
  globalThis.__gosera_users = new Map();
}

/**
 * Cache user in resilient memory store (keyed by both email and id)
 */
export function saveUserToMemory(user: StoredUser) {
  if (!globalThis.__gosera_users) {
    globalThis.__gosera_users = new Map();
  }
  globalThis.__gosera_users.set(user.email.toLowerCase().trim(), user);
  globalThis.__gosera_users.set(user.id, user);
}

/**
 * Retrieve user from memory store by email or ID
 */
export function getUserFromMemory(identifier: string): StoredUser | null {
  if (!globalThis.__gosera_users) return null;
  const clean = identifier.toLowerCase().trim();
  return (
    globalThis.__gosera_users.get(clean) ||
    globalThis.__gosera_users.get(identifier) ||
    null
  );
}
