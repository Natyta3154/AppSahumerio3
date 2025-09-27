import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;

  // Protege las rutas de administrador
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!userRole || userRole.toUpperCase() !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Si un usuario ya logueado intenta acceder a login/register, lo redirige
  if (userRole && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
      const redirectUrl = userRole.toUpperCase() === 'ADMIN' ? '/admin' : '/productos';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
  }


  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
}
