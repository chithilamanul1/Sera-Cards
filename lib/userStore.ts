import crypto from 'crypto';

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

function hashPass(pwd: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pwd, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function getStore(): Map<string, StoredUser> {
  if (!globalThis.__gosera_users) {
    globalThis.__gosera_users = new Map();

    // Pre-seed demo users for immediate login testing
    const demoUsers: StoredUser[] = [
      {
        id: 'usr_apex_kasun',
        name: 'Kasun Jayawardena',
        email: 'kasun.j@apexcapital.lk',
        phone: '+94 77 112 3456',
        passwordHash: hashPass('apex1234'),
        role: 'USER',
        plan: 'ENTERPRISE',
        cardSlug: 'apex-kasun',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_apex_sarah',
        name: 'Sarah Mendis',
        email: 'sarah.m@apexcapital.lk',
        phone: '+94 77 445 6789',
        passwordHash: hashPass('apex1234'),
        role: 'USER',
        plan: 'ENTERPRISE',
        cardSlug: 'apex-sarah',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_kosala',
        name: 'Kosala Fernando',
        email: 'kosala.codeaeron@gmail.com',
        phone: '+94711691008',
        passwordHash: hashPass('kosala1234'),
        role: 'USER',
        plan: 'PRO',
        cardSlug: 'kosala',
        createdAt: new Date().toISOString(),
      },
    ];

    for (const u of demoUsers) {
      globalThis.__gosera_users.set(u.email.toLowerCase().trim(), u);
      globalThis.__gosera_users.set(u.id, u);
    }
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

/**
 * Get all users currently in memory
 */
export function getAllUsersFromMemory(): StoredUser[] {
  const store = getStore();
  const seen = new Set<string>();
  const list: StoredUser[] = [];
  for (const user of store.values()) {
    if (!seen.has(user.id)) {
      seen.add(user.id);
      list.push(user);
    }
  }
  return list;
}

/**
 * Delete user from memory store by email or ID
 */
export function deleteUserFromMemory(identifier: string): boolean {
  const store = getStore();
  const clean = identifier.toLowerCase().trim();
  const user = store.get(clean) || store.get(identifier);
  if (user) {
    store.delete(user.email.toLowerCase().trim());
    store.delete(user.id);
    return true;
  }
  return false;
}

/**
 * Update an existing user in memory
 */
export function updateUserInMemory(identifier: string, updates: Partial<StoredUser>): StoredUser | null {
  const store = getStore();
  const clean = identifier.toLowerCase().trim();
  const existing = store.get(clean) || store.get(identifier);
  if (!existing) return null;

  const updated: StoredUser = {
    ...existing,
    ...updates,
  };

  store.set(updated.email.toLowerCase().trim(), updated);
  store.set(updated.id, updated);
  return updated;
}
