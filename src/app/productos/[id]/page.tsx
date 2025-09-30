
import { getProductById, type Product } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductDetailClientPage from './product-detail-client-page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getProductData(id: string): Promise<{ product: Product | null, error: string | null }> {
  try {
    const product = await getProductById(id);
    if (!product) {
      return { product: null, error: 'Product not found.' };
    }
    return { product, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred";
    console.error(`Failed to fetch product ${id}:`, error);
    return { product: null, error };
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { product, error } = await getProductData(params.id);

  if (error && !product) {
     return (
      <div className="container mx-auto px-4 py-12">
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error al Cargar el Producto</AlertTitle>
            <AlertDescription>
                No pudimos cargar los detalles del producto. Esto puede ser un problema de red o de CORS.
                <br />
                <strong>Detalle:</strong> {error}
                 <div className="mt-4">
                    <Link href="/productos">
                        <Button variant="secondary">Volver a Productos</Button>
                    </Link>
                </div>
            </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!product) {
    notFound();
  }

  return <ProductDetailClientPage product={product} />;
}
