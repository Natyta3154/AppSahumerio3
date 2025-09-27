import { getProducts, type Product } from '@/lib/products';
import { Suspense } from 'react';
import ProductFilters from './product-filters';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

function ProductPageSkeleton() {
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

function FetchErrorAlert() {
  return (
      <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error al Cargar Productos</AlertTitle>
          <AlertDescription>
              No pudimos cargar los productos en este momento. Por favor, intenta de nuevo más tarde.
          </AlertDescription>
      </Alert>
  );
}


export default async function ProductosPage() {
  const { products, error } = await getProducts().then(
    (data) => ({ products: data, error: null }),
    (e) => ({ products: [], error: e instanceof Error ? e.message : "An unknown error occurred" })
  );

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
      <Suspense fallback={<ProductPageSkeleton />}>
        {error ? <FetchErrorAlert /> : <ProductFilters products={products} />}
      </Suspense>
    </div>
  );
}
