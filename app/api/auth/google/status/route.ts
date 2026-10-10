import { NextResponse } from 'next/server';
import { getGoogleOAuthStatus } from '@/lib/oauth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const oauthStatus = getGoogleOAuthStatus(request);

  let dbStatus = 'DISCONNECTED';
  try {
    const testQuery = await Promise.race([
      prisma.client.findFirst({ select: { id: true } }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500)),
    ]);
    dbStatus = 'CONNECTED';
  } catch (err: any) {
    dbStatus = err?.message || 'ERROR';
  }

  return NextResponse.json({
    ...oauthStatus,
    database: dbStatus,
  });
}
