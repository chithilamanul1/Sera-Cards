import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. pradeep.serenex.lk, serenex.lk, or localhost:3000)
  let hostname = req.headers.get('host') || '';

  // Remove port for local dev
  hostname = hostname.replace(/:\d+$/, '');

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk';
  
  // Extract subdomain (e.g. "pradeep" from "pradeep.serenex.lk")
  const isSubdomain = hostname.endsWith(`.${rootDomain}`) && !hostname.startsWith('www.');
  const subdomain = isSubdomain ? hostname.replace(`.${rootDomain}`, '') : null;

  // SECURITY: Subdomain isolation
  if (subdomain && subdomain !== 'www') {
    // Prevent client subdomains from accessing /admin on the subdomain
    if (url.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL(`https://${rootDomain}/admin`));
    }

    // Allow /api/leads to be called from subdomains for lead capture
    if (url.pathname.startsWith('/api/leads')) {
      return NextResponse.next();
    }

    // Block other API routes from direct subdomain execution
    if (url.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Not available on client subdomains' }, { status: 403 });
    }

    // Rewrite client subdomain to dynamic raw HTML serving route /c/[slug]
    const rewriteUrl = new URL(`/c/${subdomain}${url.pathname === '/' ? '' : url.pathname}`, req.url);
    const response = NextResponse.rewrite(rewriteUrl);

    // Edge Security Headers for client subdomains
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');

    return response;
  }

  // Root domain requests
  return NextResponse.next();
}
