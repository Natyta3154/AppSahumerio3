
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  descripcion: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  precio: z.coerce.number().positive({ message: 'El precio debe ser un número positivo.' }),
  stock: z.coerce.number().int().nonnegative({ message: 'El stock no puede ser negativo.' }),
  categoriaId: z.coerce.number().int().positive({ message: 'Debes seleccionar una categoría.' }),
  imagenUrl: z.string().url({ message: 'La URL de la imagen no es válida.' }).or(z.literal('')),
});

export type FormState = {
  message: string | null;
  errors?: {
    nombre?: string[];
    descripcion?: string[];
    precio?: string[];
    stock?: string[];
    categoriaId?: string[];
    imagenUrl?: string[];
  };
};

// Generic API fetch function
async function apiRequest(url: string, options: RequestInit) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include'
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Error en la operación en el servidor.' }));
    throw new Error(errorBody.message || 'Ocurrió un error inesperado.');
  }
  return response.json();
}

// Create or Edit Product Action
export async function upsertProductAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ProductSchema.safeParse({
    id: formData.get('id') as string,
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: formData.get('precio'),
    stock: formData.get('stock'),
    categoriaId: formData.get('categoriaId'),
    imagenUrl: formData.get('imagenUrl') || 'https://picsum.photos/seed/placeholder/400/400',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos o hay errores. No se pudo procesar el producto.',
    };
  }

  const { id, ...productData } = validatedFields.data;

  const isEditing = !!id;
  const url = isEditing
    ? `/api/productos/editar/${id}`
    : '/api/productos/agregar';

  const bodyForApi = isEditing
    ? { ...productData }
    : {
        ...productData,
        categoria: { id: productData.categoriaId },
        precioMayorista: 0, 
        activo: true,
      };

  try {
    await apiRequest(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyForApi),
    });
  } catch (error) {
    return { 
        message: `Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        errors: {} 
    };
  }

  revalidatePath('/admin/products');
  return { message: `Producto ${isEditing ? 'actualizado' : 'creado'} con éxito.`, errors: {} };
}


// Delete Product Action
export async function deleteProductAction(productId: number): Promise<{ message: string }> {
    if (!productId) {
        return { message: 'Error: ID de producto inválido.' };
    }
    
    try {
        const response = await fetch(`/api/productos/eliminar/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'Error del servidor al eliminar.' }));
            throw new Error(errorBody.message || 'No se pudo eliminar el producto.');
        }

        revalidatePath('/admin/products');
        return { message: 'Producto eliminado con éxito.' };

    } catch (error) {
        return { message: `Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}` };
    }
}
