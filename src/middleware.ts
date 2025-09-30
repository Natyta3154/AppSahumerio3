
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ahora leemos la cookie 'user-role' que establecimos en el cliente.
  // Es importante notar que esta cookie es solo para la UI y la redirección,
  // la seguridad real está en el backend con la cookie HttpOnly.
  const userRole = request.cookies.get('user-role')?.value;
  const isLoggedIn = !!userRole;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProfileRoute = pathname.startsWith('/profile');

  // 1. Proteger rutas de admin y perfil
  if (isAdminRoute) {
    if (!isLoggedIn || !userRole?.toUpperCase().includes('ADMIN')) {
      // Si no es admin y trata de acceder a /admin, lo mandamos a login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  if (isProfileRoute && !isLoggedIn) {
     return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Redirigir a usuarios logueados si intentan acceder a login/register
  if (isLoggedIn && isAuthRoute) {
    const redirectUrl = userRole?.toUpperCase().includes('ADMIN') ? '/admin' : '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 3. Permitir el resto de las solicitudes
  return NextResponse.next();
}

// El matcher asegura que el middleware se ejecute en las rutas necesarias.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
