import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const isLoggedIn = !!userRole;

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminRoute = pathname.startsWith('/admin');

  // Si el usuario está logueado y trata de acceder a login/register, lo redirigimos.
  if (isLoggedIn && isAuthRoute) {
    const redirectUrl = userRole?.toUpperCase() === 'ADMIN' ? '/admin' : '/productos';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Proteger las rutas de administrador
  if (isAdminRoute) {
    // Si no está logueado, redirigir a login
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Si está logueado pero no es ADMIN, redirigir a productos
    if (userRole?.toUpperCase() !== 'ADMIN') {
       return NextResponse.redirect(new URL('/productos', request.url));
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
}
