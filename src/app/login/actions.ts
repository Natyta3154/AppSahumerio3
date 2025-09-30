
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

  try {
    const response = await fetch('https://apisahumerios.onrender.com/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Extract Set-Cookie header from the backend response
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
        cookies().set('token', setCookieHeader.split(';')[0].split('=')[1], {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });
    }

    const responseData = await response.json();

    if (!response.ok) {
      return { message: responseData.error || 'Error al iniciar sesión. Verifica tus credenciales.', success: false };
    }
    
    const user = responseData.usuario;

    // Set client-side cookies for UI purposes
    cookies().set('user-name', user.nombre, { path: '/' });
    cookies().set('user-email', user.email, { path: '/' });
    cookies().set('user-role', user.rol, { path: '/' });

    // Return success state, the component will handle the refresh
    return { message: 'Login successful', success: true };

  } catch (error) {
    console.error('Login error:', error);
    return { message: 'No se pudo conectar al servidor. Inténtalo más tarde.', success: false };
  }
}


export async function logoutAction() {
  try {
    const res = await fetch('https://apisahumerios.onrender.com/usuarios/logout', {
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
