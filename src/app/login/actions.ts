
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
    
    // The backend now sends the token in an HttpOnly cookie, which is handled automatically by the browser.
    // We just need to check if the request was successful and get the user data from the body.
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Credenciales incorrectas.' }));
      return { message: errorData.message || 'Error al iniciar sesión. Verifica tus credenciales.' };
    }

    responseData = await response.json();
    
    // The backend now sends user data directly in cookies, we can remove manual setting
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
  // The backend has a bug in redirection logic, so we do it here.
  if (responseData?.usuario?.rol) {
    if (responseData.usuario.rol.toUpperCase().includes('ADMIN')) {
      redirect('/admin');
    } else {
      redirect('/productos');
    }
  }

  // Fallback redirect if role is not present
  redirect('/productos');
}

export async function logoutAction() {
  // We need to call the backend to clear the HttpOnly cookie
  try {
     await fetch('https://apisahumerios.onrender.com/usuarios/logout', {
        method: 'POST',
        headers: {
            // Include credentials to send cookies
            'Credentials': 'include'
        }
    });
  } catch (error) {
    console.error("Logout error", error);
  } finally {
    // Also clear client-side cookies as a fallback
    cookies().delete('user-role');
    cookies().delete('user-name');
    cookies().delete('user-email');
    redirect('/');
  }
}
