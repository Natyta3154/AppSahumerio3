
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const isLoggedIn = !!userRole;

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminRoute = pathname.startsWith('/admin');

  // If the user is logged in and tries to access login/register, redirect them.
  if (isLoggedIn && isAuthRoute) {
    const redirectUrl = userRole?.toUpperCase() === 'ADMIN' ? '/admin' : '/productos';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Protect admin routes
  if (isAdminRoute) {
    // If not logged in, redirect to login
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // If logged in but not an ADMIN, redirect away.
    if (userRole?.toUpperCase() !== 'ADMIN') {
       return NextResponse.redirect(new URL('/productos', request.url));
    }
  }

  return NextResponse.next()
}

// Ensure the matcher covers all admin sub-routes correctly.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
