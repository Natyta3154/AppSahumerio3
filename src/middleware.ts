
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const isLoggedIn = !!userRole;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // 1. Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn || userRole?.toUpperCase() !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect logged-in users from auth routes
  if (isLoggedIn && isAuthRoute) {
    const redirectUrl = userRole?.toUpperCase() === 'ADMIN' ? '/admin' : '/productos';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 3. Allow all other requests
  return NextResponse.next();
}

// The matcher ensures the middleware runs on all routes except static assets and API calls.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
