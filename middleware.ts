import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. pradeep.serenex.lk, serenex.lk, or localhost:3000)
  let hostname = req.headers.get('host') || '';

  // Only allow alphanumeric subdomains, remove ports for dev
  hostname = hostname.replace(/:\d+$/, '');

  // Define allowed root domains (local and prod)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk';
  
  // Ignore specific paths that shouldn't be rewritten
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Extract the subdomain
  // e.g., if hostname is "pradeep.serenex.lk" and rootDomain is "serenex.lk", subdomain is "pradeep"
  const isSubdomain = hostname.endsWith(`.${rootDomain}`);
  const subdomain = isSubdomain ? hostname.replace(`.${rootDomain}`, '') : null;

  // Ignore 'www' or empty subdomain
  if (subdomain && subdomain !== 'www') {
    // Rewrite to our dynamic route
    return NextResponse.rewrite(new URL(`/c/${subdomain}${url.pathname === '/' ? '' : url.pathname}`, req.url));
  }

  return NextResponse.next();
}
