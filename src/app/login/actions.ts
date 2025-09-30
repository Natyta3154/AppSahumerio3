
'use server';

import { cookies } from 'next/headers';
import type { FormState } from './page';

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { message: 'Por favor, introduce el email y la contraseña.', success: false };
  }

  let responseData;
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
      return { message: errorData.message || 'Error al iniciar sesión. Verifica tus credenciales.', success: false };
    }

    responseData = await response.json();
    
    if (responseData.usuario?.rol) {
      cookies().set('user-role', responseData.usuario.rol, { path: '/' });
    }
    if (responseData.usuario?.nombre) {
      cookies().set('user-name', responseData.usuario.nombre, { path: '/' });
    }
    if (responseData.usuario?.email) {
      cookies().set('user-email', responseData.usuario.email, { path: '/' });
    }

    return {
      message: '¡Bienvenido!',
      success: true,
      user: {
        name: responseData.usuario.nombre,
        role: responseData.usuario.rol,
      }
    };

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
    });
    if (!res.ok) {
        console.error("Backend logout failed");
    }
  } catch (error) {
    console.error("Logout error", error);
  } finally {
    cookies().delete('user-role');
    cookies().delete('user-name');
    cookies().delete('user-email');
  }
}
