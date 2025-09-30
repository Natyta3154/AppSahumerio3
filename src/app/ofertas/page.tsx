
'use client';

import { useEffect, useState } from 'react';
import { getProducts, type Product } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const getActiveOffer = (product: Product) => {
  if (!product.ofertas || product.ofertas.length === 0) return undefined;
  const now = new Date();
  return product.ofertas.find(offer => {
    const startDate = new Date(offer.fechaInicio);
    const endDate = new Date(offer.fechaFin);
    endDate.setDate(endDate.getDate() + 1);
    return offer.estado && now >= startDate && now < endDate;
  });
};

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

function FetchErrorAlert({ error }: { error: string | null }) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error al Cargar Ofertas</AlertTitle>
      <AlertDescription>
        No pudimos cargar las ofertas en este momento. Esto puede deberse a un problema de red o de configuración del servidor (CORS).
        {error && <><br /><strong>Detalle:</strong> {error}</>}
      </AlertDescription>
    </Alert>
  );
}

export default function OfertasPage() {
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOfferProducts() {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        const filtered = allProducts.filter(product => getActiveOffer(product));
        setOfferProducts(filtered);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    loadOfferProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
          Ofertas Especiales
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Aprovecha nuestros descuentos exclusivos por tiempo limitado.
        </p>
      </div>

      {loading ? (
        <ProductsLoadingSkeleton />
      ) : error ? (
        <FetchErrorAlert error={error} />
      ) : offerProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No hay ofertas disponibles en este momento. ¡Vuelve pronto!
          </p>
        </div>
      )}
    </div>
  );
}
