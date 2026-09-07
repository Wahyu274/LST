import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lst-secret-key-change-in-production-2026'
);

const COOKIE_NAME = 'lst_session_token';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isCSRoute = pathname.startsWith('/cs');

  if (!isAdminRoute && !isCSRoute) {
    return NextResponse.next();
  }

  // Retrieve session token from cookie
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    // Determine default role parameter if CS route
    const roleParam = isCSRoute ? '?role=CUSTOMER_SERVICE' : '';
    const loginUrl = new URL(`/login${roleParam}`, req.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'Otentikasi diperlukan untuk mengakses portal.');
    return NextResponse.redirect(loginUrl);
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { userId: string; role: string; email: string };

    // 1. CUSTOMER SERVICE Role Isolation: CS must ALWAYS be in /cs/inbox
    if (payload.role === 'CUSTOMER_SERVICE') {
      if (isAdminRoute) {
        // Automatically redirect CS from admin route to CS Live Chat Workspace
        return NextResponse.redirect(new URL('/cs/inbox', req.url));
      }
      return NextResponse.next();
    }

    // 2. SALES Role Isolation: Allowed only on sales & crm admin routes
    if (payload.role === 'SALES') {
      const allowedSalesRoutes = [
        '/admin/leads',
        '/admin/quotations',
        '/admin/sales',
        '/admin/projects',
        '/admin/products',
        '/admin/profile',
      ];
      const isAllowed = allowedSalesRoutes.some((route) => pathname.startsWith(route));
      if (isAdminRoute && !isAllowed) {
        return NextResponse.redirect(new URL('/admin/leads', req.url));
      }
    }

    // 3. CONTENT EDITOR Role Isolation: Allowed only on CMS & catalog admin routes
    if (payload.role === 'CONTENT_EDITOR') {
      const allowedCMS = ['/admin/products', '/admin/cms', '/admin/portfolio', '/admin/profile'];
      const isAllowed = allowedCMS.some((route) => pathname.startsWith(route));
      if (isAdminRoute && !isAllowed) {
        return NextResponse.redirect(new URL('/admin/products', req.url));
      }
    }

    // 4. ADMIN & SUPER_ADMIN Route Access
    if (isAdminRoute) {
      const allowedAdminRoles = ['SUPER_ADMIN', 'SALES', 'CONTENT_EDITOR'];
      if (!allowedAdminRoles.includes(payload.role)) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('error', 'Akses ditolak untuk portal ini.');
        return NextResponse.redirect(loginUrl);
      }
    }

    if (isCSRoute) {
      const allowedCSRoles = ['SUPER_ADMIN', 'CUSTOMER_SERVICE'];
      if (!allowedCSRoles.includes(payload.role)) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('error', 'Akses ditolak untuk CS Workspace.');
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid/Expired session -> Clear cookie and redirect to login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('error', 'Sesi telah kadaluwarsa. Silakan masuk kembali.');
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/cs/:path*'],
};
