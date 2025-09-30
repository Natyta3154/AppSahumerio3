
export type Offer = {
  idOferta: number;
  valorDescuento: number;
  tipoDescuento: 'PORCENTAJE' | 'MONTO';
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
  precio: number;
};

export type ProductVariant = {
  id: number;
  nombre: string;
};

export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioMayorista: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  categoriaNombre: string;
  fragancias: ProductVariant[];
  ofertas: Offer[];
};

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('https://apisahumerios.onrender.com/productos/listado', {
      cache: 'no-store',
      credentials: 'include' // <-- Añadido para enviar cookies
    });
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await res.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Devolvemos un array vacío en caso de error para no romper la UI
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    // The API seems to list all products, so we fetch all and find by id
    const products = await getProducts();
    const product = products.find((p) => p.id.toString() === id);
    return product || null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}
