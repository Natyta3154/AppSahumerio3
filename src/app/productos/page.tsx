
'use client';
import { getProducts } from '@/lib/products';
import ProductFilters from './product-filters';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { type Product } from '@/lib/products';

function FetchErrorAlert({ error }: { error: string | null }) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error al Cargar Productos</AlertTitle>
      <AlertDescription>
        No pudimos cargar los productos en este momento. Esto puede deberse a un problema de red o de configuración del servidor (CORS).
        {error && <><br /><strong>Detalle:</strong> {error}</>}
      </AlertDescription>
    </Alert>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
          Nuestra Colección Completa
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Explora todos nuestros productos y encuentra tus nuevos favoritos.
        </p>
      </div>
      {loading ? <ProductsLoadingSkeleton /> : error ? <FetchErrorAlert error={error} /> : <ProductFilters products={products} />}
    </div>
  );
}
