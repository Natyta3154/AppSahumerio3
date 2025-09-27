
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
      return { message: errorData.message || 'Error al iniciar sesión. Verifica tus credenciales.' };
    }

    responseData = await response.json();
    
    // Store user info from the nested "usuario" object in cookies
    if (responseData.usuario?.rol) {
      cookies().set('user-role', responseData.usuario.rol, { httpOnly: true, path: '/' });
    }
    if (responseData.usuario?.nombre) {
      cookies().set('user-name', responseData.usuario.nombre, { httpOnly: true, path: '/' });
    }
    if (responseData.usuario?.email) {
      cookies().set('user-email', responseData.usuario.email, { httpOnly: true, path: '/' });
    }

  } catch (error) {
    console.error('Login error:', error);
    return { message: 'No se pudo conectar al servidor. Inténtalo más tarde.' };
  }

  // Redirect based on user role from the nested "usuario" object
  if (responseData?.usuario?.rol) {
    if (responseData.usuario.rol.toUpperCase() === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/productos');
    }
  }

  // Fallback redirect if role is not present
  redirect('/productos');
}

export async function logoutAction() {
  cookies().delete('user-role');
  cookies().delete('user-name');
  cookies().delete('user-email');
  redirect('/');
}
