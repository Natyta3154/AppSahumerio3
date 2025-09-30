
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type LoginSuccessState = {
  success: true;
  message: string;
};

export type LoginErrorState = {
  success: false;
  message: string;
};

export type LoginFormState = LoginSuccessState | LoginErrorState;

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { message: 'Por favor, introduce el email y la contraseña.', success: false };
  }

  let responseData;
  try {
    const response = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Extraer la cookie 'token' de la respuesta del backend
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
      // Extraemos solo el valor del token
      const tokenValue = setCookieHeader.split(';')[0].split('=')[1];
      if (tokenValue) {
        cookies().set('token', tokenValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // 'lax' es más compatible que 'none' en muchos casos
          path: '/',
        });
      }
    }

    responseData = await response.json();

    if (!response.ok) {
      return { message: responseData.error || 'Error al iniciar sesión. Verifica tus credenciales.', success: false };
    }

  } catch (error) {
    console.error('Login error:', error);
    return { message: 'No se pudo conectar al servidor. Inténtalo más tarde.', success: false };
  }
  
  // Si la autenticación fue exitosa, procedemos
  const user = responseData.usuario;
  if (!user || !user.rol) {
      return { message: 'Respuesta inesperada del servidor.', success: false };
  }

  // Establecer cookies del lado del cliente para la UI
  cookies().set('user-name', user.nombre, { path: '/' });
  cookies().set('user-email', user.email, { path: '/' });
  cookies().set('user-role', user.rol, { path: '/' });

  // Redirección desde el servidor
  const isAdmin = user.rol.toUpperCase().includes('ADMIN');
  redirect(isAdmin ? '/admin' : '/');
}


export async function logoutAction() {
  try {
    const res = await fetch('/api/usuarios/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) {
        console.error("Backend logout failed");
    }
  } catch (error) {
    console.error("Logout error", error);
  }
  
  // Clear all relevant cookies
  cookies().delete('token');
  cookies().delete('user-name');
  cookies().delete('user-email');
  cookies().delete('user-role');

  redirect('/');
}
