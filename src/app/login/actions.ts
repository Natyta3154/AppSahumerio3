
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type LoginSuccessState = {
  success: true;
  message: string;
  user: {
    nombre: string;
    email: string;
    rol: string;
  };
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
      credentials: 'include', // <-- Añadido para enviar cookies
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { message: responseData.error || 'Error al iniciar sesión. Verifica tus credenciales.', success: false };
    }

    // El backend establece la cookie HttpOnly.
    // El frontend solo recibe los datos del usuario para la UI.
    return {
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: responseData.usuario,
    };

  } catch (error) {
    console.error('Login error:', error);
    return { message: 'No se pudo conectar al servidor. Inténtalo más tarde.', success: false };
  }
}


export async function logoutAction() {
  try {
    // Llama al backend para que borre su cookie HttpOnly
    const res = await fetch('https://apisahumerios.onrender.com/usuarios/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <-- Añadido para enviar cookies
    });
    if (!res.ok) {
        console.error("Backend logout failed");
    }
  } catch (error) {
    console.error("Logout error", error);
  }
  // Las cookies del lado del cliente para la UI se borrarán en el componente UserNav
}

