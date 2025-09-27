import { getProducts, type Product } from '@/lib/products';
import HomePageClient from './home-page-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

async function getProductsData() {
  try {
    const products = await getProducts();
    return { products, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred";
    console.error("Failed to fetch initial products:", error);
    return { products: [], error };
  }
}

function FetchErrorAlert({ error }: { error: string }) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error al Cargar Productos</AlertTitle>
            <AlertDescription>
                No pudimos cargar los productos en este momento. Error: {error}
            </AlertDescription>
        </Alert>
    );
}

export default async function HomePage() {
  const { products, error } = await getProductsData();

  if (error && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <FetchErrorAlert error={error} />
      </div>
    );
  }

  return <HomePageClient initialProducts={products} initialError={error} />;
}
