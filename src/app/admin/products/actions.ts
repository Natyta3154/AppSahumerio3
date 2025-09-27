'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Define el esquema de validación con Zod
const ProductSchema = z.object({
  id: z.string().optional(), // El ID es opcional (solo presente al editar)
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  precio: z.coerce.number().positive('El precio debe ser un número positivo.'),
  stock: z.coerce.number().int().nonnegative('El stock no puede ser negativo.'),
  categoriaId: z.coerce.number().int().positive('Debes seleccionar una categoría.'),
  imagenUrl: z.string().url('La URL de la imagen no es válida.').or(z.literal('')), // Permite URL vacía
});

export type FormState = {
  message?: string | null;
  errors?: {
    nombre?: string[];
    descripcion?: string[];
    precio?: string[];
    stock?: string[];
    categoriaId?: string[];
    imagenUrl?: string[];
  };
};

// Función genérica para manejar las peticiones a la API
async function apiFetch(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error en la operación.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado.');
  }
  return response.json();
}

// Acción para crear o editar un producto
export async function upsertProductAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ProductSchema.safeParse({
    id: formData.get('id') as string,
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: formData.get('precio'),
    stock: formData.get('stock'),
    categoriaId: formData.get('categoriaId'),
    imagenUrl: formData.get('imagenUrl') || 'https://picsum.photos/seed/placeholder/400/400', // Default image
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo procesar el producto.',
    };
  }

  const { id, ...productData } = validatedFields.data;
  const url = id
    ? `https://apisahumerios.onrender.com/productos/editar/${id}`
    // La API espera un objeto anidado para la categoría al agregar
    : 'https://apisahumerios.onrender.com/productos/agregar';

  const body = id
    ? JSON.stringify(productData)
    // Al agregar, la API espera un formato específico para la categoría
    : JSON.stringify({
        ...productData,
        categoria: { id: productData.categoriaId },
        precioMayorista: 0, // Añadido campo requerido por API
        activo: true, // Añadido campo requerido por API
      });

  try {
    await apiFetch(url, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { message: `Error al guardar el producto: ${errorMessage}` };
  }

  revalidatePath('/admin/products');
  // Devolvemos un estado limpio en lugar de redirigir para poder mostrar un mensaje de éxito.
  // La redirección o cierre del modal se puede manejar en el cliente.
  return { message: `Producto ${id ? 'actualizado' : 'creado'} con éxito.` };
}

// Acción para eliminar un producto
export async function deleteProductAction(productId: number) {
    if (!productId) {
        return { message: 'ID de producto inválido.' };
    }
    
    try {
        await fetch(`https://apisahumerios.onrender.com/productos/eliminar/${productId}`, {
            method: 'DELETE',
        });
        revalidatePath('/admin/products');
        return { message: 'Producto eliminado con éxito.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        return { message: `Error al eliminar el producto: ${errorMessage}` };
    }
}
