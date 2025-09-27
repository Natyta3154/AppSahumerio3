'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export type FormState = {
  message: string;
};

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { message: 'Por favor, introduce el email y la contraseña.' };
  }

  try {
    const response = await fetch('https://apisahumerios.onrender.com/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Credenciales incorrectas.' }));
      return { message: errorData.message || 'Error al iniciar sesión. Verifica tus credenciales.' };
    }

    // Forward the session cookie from the API to the browser
    const responseCookies = response.headers.get('set-cookie');
    if (responseCookies) {
      cookies().set('session', responseCookies);
    }

  } catch (error) {
    console.error('Login error:', error);
    return { message: 'No se pudo conectar al servidor. Inténtalo más tarde.' };
  }

  // Redirect to admin dashboard on successful login
  redirect('/admin');
}
