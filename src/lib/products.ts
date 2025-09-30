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
    const res = await fetch('/api/productos/listado', {
      cache: 'no-store',
    
    });
    if (!res.ok) {
      // Lanza un error más descriptivo
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }
    const products = await res.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Relanza el error para que pueda ser capturado por los componentes que llaman a esta función
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/productos/detalle/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
    }
    const product = await res.json();
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
}
