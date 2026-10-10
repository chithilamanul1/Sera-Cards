/**
 * Google OAuth Canonical URL and Helper Functions
 */

export function getGoogleRedirectUri(request?: Request): string {
  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const host = forwardedHost || request.headers.get('host');
    if (host) {
      const proto = forwardedProto || (host.includes('localhost') ? 'http' : 'https');
      return `${proto}://${host}/api/auth/google/callback`;
    }
  }

  // Fallback to configured app URL or default domains
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && appUrl.startsWith('http')) {
    return `${appUrl.replace(/\/$/, '')}/api/auth/google/callback`;
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  return `https://${rootDomain}/api/auth/google/callback`;
}

export function getGoogleOAuthStatus(request?: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  const hasClientId = !!clientId && !clientId.includes('your_google_client_id');
  const hasClientSecret = !!clientSecret && !clientSecret.includes('your_google_client_secret');

  const currentRedirectUri = getGoogleRedirectUri(request);
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  const authorizedUris = Array.from(new Set([
    currentRedirectUri,
    `https://sera-cards.vercel.app/api/auth/google/callback`,
    `https://${rootDomain}/api/auth/google/callback`,
    `https://card.${rootDomain}/api/auth/google/callback`,
    `http://localhost:3000/api/auth/google/callback`,
  ]));

  const authorizedOrigins = Array.from(new Set([
    `https://sera-cards.vercel.app`,
    `https://${rootDomain}`,
    `https://card.${rootDomain}`,
    `http://localhost:3000`,
  ]));

  return {
    isFullyConfigured: hasClientId && hasClientSecret,
    hasClientId,
    clientIdPreview: hasClientId ? `${clientId.slice(0, 12)}...${clientId.slice(-18)}` : null,
    hasClientSecret,
    clientSecretStatus: hasClientSecret ? 'CONFIGURED' : 'MISSING_OR_NEEDS_ATTENTION',
    currentRedirectUri,
    authorizedUris,
    authorizedOrigins,
  };
}
