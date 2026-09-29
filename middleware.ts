import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon and app icon files
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|icon\\.png|apple-icon\\.png).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. pradeep.serenex.lk, serenex.lk, or localhost:3000)
  let hostname = req.headers.get('host') || '';

  // Remove port for local dev
  hostname = hostname.replace(/:\d+$/, '');

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  
  // Extract subdomain (e.g. "pradeep" from "pradeep.seranex.lk")
  const isSubdomain = hostname.endsWith(`.${rootDomain}`) && !hostname.startsWith('www.');
  const subdomain = isSubdomain ? hostname.replace(`.${rootDomain}`, '') : null;

  // SECURITY: Subdomain isolation
  if (subdomain && subdomain !== 'www') {
    // Prevent client subdomains from accessing /admin or /dashboard on the subdomain
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL(`https://${rootDomain}${url.pathname}`));
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
  
  // Admin route protection
  if (url.pathname.startsWith('/admin')) {
    const session = req.cookies.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/login?redirect=/admin', req.url));
    }
  }

  // Customer Dashboard route protection
  if (url.pathname.startsWith('/dashboard')) {
    const userSession = req.cookies.get('user_session')?.value;
    const adminSession = req.cookies.get('admin_session')?.value;
    if (!userSession && adminSession !== 'authenticated') {
      return NextResponse.redirect(new URL('/login?redirect=/dashboard', req.url));
    }
  }

  return NextResponse.next();
}
