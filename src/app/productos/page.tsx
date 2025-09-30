import { getProducts } from '@/lib/products';
import ProductFilters from './product-filters';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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
      {error ? <FetchErrorAlert error={error} /> : <ProductFilters products={products} />}
    </div>
  );
}
