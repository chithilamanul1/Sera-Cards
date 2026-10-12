import { NextResponse } from 'next/server';
import { getGoogleRedirectUri, getGoogleCredentials } from '@/lib/oauth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { clientId, hasClientId } = getGoogleCredentials();
  const redirectUri = getGoogleRedirectUri(request);

  if (!hasClientId || !clientId) {
    // If Google Client ID is not yet provided, redirect with helpful message
    return NextResponse.redirect(new URL('/login?error=google_not_configured', request.url));
  }

  const scope = encodeURIComponent('openid email profile');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&prompt=select_account`;

  return NextResponse.redirect(googleAuthUrl);
}

