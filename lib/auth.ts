import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from './prisma';
import { getUserFromMemory } from './userStore';

/**
 * Hashes a plain password using Node.js standard built-in crypto (scrypt)
 * Zero C++ compilation issues, secure and lightweight.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against the stored salt:hash string
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(':');
    if (!salt || !key) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(hash, 'hex'));
  } catch (error) {
    return false;
  }
}

/**
 * Returns current authenticated user from cookie session
 */
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const userSession = cookieStore.get('user_session')?.value;

    if (!userSession) {
      return null;
    }

    // Try finding user by ID or session token in DB with timeout
    try {
      const user = await Promise.race([
        prisma.user.findUnique({
          where: { id: userSession },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            plan: true,
            cardSlug: true,
            createdAt: true,
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500)),
      ]) as any;

      if (user) return user;
    } catch {}

    // Fall back to resilient memory store
    const memUser = getUserFromMemory(userSession);
    if (memUser) {
      return {
        id: memUser.id,
        email: memUser.email,
        name: memUser.name,
        phone: memUser.phone,
        role: memUser.role,
        plan: memUser.plan,
        cardSlug: memUser.cardSlug,
        createdAt: memUser.createdAt,
      };
    }

    return null;
  } catch (error) {
    console.error('[Auth getCurrentUser Error]', error);
    return null;
  }
}
