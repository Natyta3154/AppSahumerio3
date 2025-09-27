import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const isLoggedIn = !!userRole;

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Si el usuario está logueado y trata de acceder a login/register, lo redirigimos.
  if (isLoggedIn && isAuthRoute) {
    const redirectUrl = userRole?.toUpperCase() === 'ADMIN' ? '/admin' : '/productos';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Si el usuario no está logueado e intenta acceder a una ruta de admin, lo redirigimos a login.
  if (!isLoggedIn && isAdminRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si el usuario está logueado pero no es ADMIN e intenta acceder a una ruta de admin, lo redirigimos.
  if (isLoggedIn && isAdminRoute && userRole?.toUpperCase() !== 'ADMIN') {
     return NextResponse.redirect(new URL('/productos', request.url));
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register', '/admin'],
}
