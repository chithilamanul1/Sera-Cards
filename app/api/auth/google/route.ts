import { NextResponse } from 'next/server';
import { getGoogleRedirectUri } from '@/lib/oauth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = getGoogleRedirectUri(request);

  if (!googleClientId || googleClientId.includes('your_google_client_id')) {
    // If Google Client ID is not yet provided, redirect with helpful message
    return NextResponse.redirect(new URL('/login?error=google_not_configured', request.url));
  }

  const scope = encodeURIComponent('openid email profile');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&prompt=select_account`;

  return NextResponse.redirect(googleAuthUrl);
}
