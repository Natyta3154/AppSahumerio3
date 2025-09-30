'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { cookies } from 'next/headers';

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

async function apiRequest(url: string, options: RequestInit) {
  const token = cookies().get('token')?.value;
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Error en la operación en el servidor.' }));
    console.error("API Request Error:", errorBody);
    throw new Error(errorBody.message || `Error: ${response.status} ${response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
      return response.json();
  }
  return {}; 
}

export async function upsertProductAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ProductSchema.safeParse({
    id: formData.get('id') as string,
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: formData.get('precio'),
    stock: formData.get('stock'),
    categoriaId: formData.get('categoriaId'),
    imagenUrl: formData.get('imagenUrl') || `https://picsum.photos/seed/${Math.random()}/400/400`,
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

  const method = isEditing ? 'PUT' : 'POST';

  try {
    let bodyForApi;
    if (isEditing) {
        const { categoriaId, ...updateDto } = productData;
        bodyForApi = { ...updateDto, idCategoria: categoriaId };
    } else {
        const createDto = {
            ...productData,
            categoriaNombre: productData.categoriaId === 1 ? 'Incienso' : 'Quemador',
            precioMayorista: 0,
            activo: true,
        };
        bodyForApi = createDto;
    }

    await apiRequest(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyForApi),
    });

    revalidatePath('/admin/products');
    return { message: `Producto ${isEditing ? 'actualizado' : 'creado'} con éxito.`, errors: {} };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al procesar el producto.';
    console.error(`Error in upsertProductAction (isEditing: ${isEditing}):`, errorMessage);
    return { message: errorMessage, errors: {} };
  }
}

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
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar.';
        console.error(`Error deleting product ${productId}:`, errorMessage);
        return { message: errorMessage };
    }
}
