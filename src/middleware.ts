
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const isLoggedIn = !!userRole;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Proteger rutas de administrador
  if (isAdminRoute) {
    if (!isLoggedIn || userRole?.toUpperCase() !== 'ADMIN') {
      // Si no está logueado como admin, redirigir al login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Si está logueado como admin y está en una ruta de admin, permitir el acceso
    return NextResponse.next();
  }

  // Si está logueado y va a una ruta de autenticación, redirigir al panel correspondiente
  if (isLoggedIn && isAuthRoute) {
    const redirectUrl = userRole?.toUpperCase() === 'ADMIN' ? '/admin' : '/productos';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Para todas las demás rutas, permitir el acceso
  return NextResponse.next();
}

// El matcher se asegura de que el middleware se ejecute en las rutas relevantes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
