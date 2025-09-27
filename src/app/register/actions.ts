'use server';

import { redirect } from 'next/navigation';

export type FormState = {
  message: string;
  success: boolean;
};

export async function registerAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!name || !email || !password) {
    return { message: 'Por favor, completa todos los campos.', success: false };
  }

  try {
    const response = await fetch('https://apisahumerios.onrender.com/usuarios/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        nombre: name,
        email, 
        password,
        rol: "ROLE_USER" // Hardcoded as requested
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al registrar. Inténtalo de nuevo.' }));
      return { message: errorData.message || 'Error al registrar. Verifica los datos introducidos.', success: false };
    }

  } catch (error) {
    console.error('Registration error:', error);
    return { message: 'No se pudo conectar al servidor. Inténtalo más tarde.', success: false };
  }

  redirect('/login?registered=true');
}
