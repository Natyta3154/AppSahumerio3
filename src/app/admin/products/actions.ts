
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const API_BASE_URL = 'https://apisahumerios.onrender.com';

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
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Error en la operación en el servidor.' }));
    throw new Error(errorBody.message || 'Ocurrió un error inesperado.');
  }
  // No todos los endpoints devuelven JSON, ej: DELETE
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
      return response.json();
  }
  return {}; // Devuelve un objeto vacío si no hay JSON
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
    ? `${API_BASE_URL}/productos/editar/${id}`
    : `${API_BASE_URL}/productos/agregar`;

  const bodyForApi = {
      ...productData,
      categoria: { id: productData.categoriaId },
      precioMayorista: 0, 
      activo: true,
  };
  
  if (isEditing) {
      // El endpoint de editar puede tener una estructura de DTO diferente.
      // Ajustamos el cuerpo para que coincida con lo esperado por el backend.
      const { categoriaId, ...updateDto } = productData;
      (updateDto as any).idCategoria = categoriaId;
       try {
        await apiRequest(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateDto),
        });
      } catch (error) {
        return { 
            message: `Error al actualizar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            errors: {} 
        };
      }
  } else {
      // Cuerpo para crear
      const createDto = {
        ...productData,
        categoriaNombre: productData.categoriaId === 1 ? 'Incienso' : 'Quemador',
        precioMayorista: 0, 
        activo: true,
      };
      try {
        await apiRequest(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createDto),
        });
      } catch (error) {
        return { 
            message: `Error al crear: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            errors: {} 
        };
      }
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
        await apiRequest(`${API_BASE_URL}/productos/eliminar/${productId}`, {
            method: 'DELETE',
        });

        revalidatePath('/admin/products');
        return { message: 'Producto eliminado con éxito.' };

    } catch (error) {
        return { message: `Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}` };
    }
}
