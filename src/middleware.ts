import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const isLoggedIn = !!userRole;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProfileRoute = pathname.startsWith('/profile');
  const isAdmin = userRole?.toUpperCase().includes('ADMIN');

  // 1. Redirect authenticated users from auth routes
  if (isLoggedIn && isAuthRoute) {
    const redirectUrl = isAdmin ? '/admin' : '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  
  // 2. Protect admin routes for non-admins or unauthenticated users
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // 3. Protect profile route for non-authenticated users
  if (isProfileRoute && !isLoggedIn) {
     return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Allow all other requests
  return NextResponse.next();
}

// The matcher ensures the middleware runs on the necessary routes.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
