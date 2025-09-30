import { getProducts, type Product } from '@/lib/products';
import HomePageClient from './home-page-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

async function getProductsData(): Promise<{ products: Product[], error: string | null }> {
  try {
    const products = await getProducts();
    return { products, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred";
    console.error("Failed to fetch initial products:", error);
    // Devuelve el error para que el componente de la página pueda manejarlo.
    return { products: [], error };
  }
}

function FetchErrorAlert({ error }: { error: string }) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error al Cargar Productos</AlertTitle>
            <AlertDescription>
                No pudimos cargar los productos en este momento. Esto puede deberse a un problema de red o de configuración del servidor (CORS).
                <br />
                <strong>Detalle del error:</strong> {error}
            </AlertDescription>
        </Alert>
    );
}

export default async function HomePage() {
  const { products, error } = await getProductsData();

  // Aunque haya un error, pasamos los productos (posiblemente vacíos) y el error al componente cliente.
  // El cliente decidirá cómo renderizar en función de esta información.
  return <HomePageClient initialProducts={products} initialError={error} />;
}
