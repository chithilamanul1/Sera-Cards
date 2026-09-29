import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from './prisma';

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

    // Try finding user by ID or session token
    const user = await prisma.user.findUnique({
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
    });

    return user;
  } catch (error) {
    console.error('[Auth getCurrentUser Error]', error);
    return null;
  }
}
