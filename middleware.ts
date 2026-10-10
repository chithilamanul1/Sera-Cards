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

const RESERVED_SUBDOMAINS = new Set(['www', 'card', 'app', 'api', 'admin', 'mail', 'auth']);
const RESERVED_ROOT_PATHS = new Set([
  'admin',
  'dashboard',
  'login',
  'register',
  'pricing',
  'how-it-works',
  'teams',
  'order',
  'activate',
  'api',
  'c',
  '_next',
  'robots.txt',
  'sitemap.xml',
]);

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. kosala.seranex.lk, seranex.lk, card.seranex.lk, sera-cards.vercel.app, or localhost:3000)
  let hostname = req.headers.get('host') || '';

  // Remove port for local dev
  hostname = hostname.replace(/:\d+$/, '').toLowerCase();

  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk').toLowerCase();
  
  // 1. Check Subdomain (e.g. "kosala" from "kosala.seranex.lk" or "kosala.sera-cards.vercel.app")
  let subdomain: string | null = null;
  if (hostname.endsWith(`.${rootDomain}`)) {
    subdomain = hostname.replace(`.${rootDomain}`, '');
  } else if (hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('.');
    if (parts.length > 3) {
      subdomain = parts[0];
    }
  }

  // Handle client card subdomain
  if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain)) {
    // Prevent client subdomains from accessing /admin, /dashboard, or /teams on the subdomain
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/teams')) {
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

  // 2. Direct Top-Level Path Rewrite (e.g. /kosala -> /c/kosala)
  // If the path is a single slug like /kosala, and not a reserved route, rewrite to /c/kosala
  const pathParts = url.pathname.split('/').filter(Boolean);
  if (pathParts.length === 1) {
    const slug = pathParts[0].toLowerCase();
    if (!RESERVED_ROOT_PATHS.has(slug) && !slug.includes('.')) {
      const rewriteUrl = new URL(`/c/${slug}`, req.url);
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // 3. Admin route protection
  if (url.pathname.startsWith('/admin')) {
    const session = req.cookies.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/login?redirect=/admin', req.url));
    }
  }

  // 4. Customer Dashboard route protection
  if (url.pathname.startsWith('/dashboard')) {
    const userSession = req.cookies.get('user_session')?.value;
    const adminSession = req.cookies.get('admin_session')?.value;
    if (!userSession && adminSession !== 'authenticated') {
      return NextResponse.redirect(new URL('/login?redirect=/dashboard', req.url));
    }
  }

  return NextResponse.next();
}
