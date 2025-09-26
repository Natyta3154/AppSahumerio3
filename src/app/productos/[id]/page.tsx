'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { type Product, type ProductVariant } from '@/lib/products';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart.tsx';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to check if an offer is active
const getActiveOffer = (product: Product) => {
  if (!product.ofertas) return undefined;
  const now = new Date();
  return product.ofertas.find(offer => {
    const startDate = new Date(offer.fechaInicio);
    const endDate = new Date(offer.fechaFin);
    return offer.estado && now >= startDate && now <= endDate;
  });
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!params.id) return;
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`https://apisahumerios.onrender.com/productos/listar`, { cache: 'no-store' });
        const products = await res.json();
        const foundProduct = products.find((p: Product) => p.id.toString() === params.id);
        setProduct(foundProduct || null);
        if (foundProduct?.fragancias?.length > 0) {
          setSelectedVariant(foundProduct.fragancias[0]);
        }
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <Link href="/productos">
          <Button variant="link" className="mt-4">
            Volver a Productos
          </Button>
        </Link>
      </div>
    );
  }

  const activeOffer = getActiveOffer(product);
  const displayPrice = activeOffer ? activeOffer.precio : product.precio;

  const handleAddToCart = () => {
    const productForCart = {
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id.toString(),
      name: selectedVariant ? `${product.nombre} - ${selectedVariant.nombre}` : product.nombre,
      description: product.descripcion,
      price: displayPrice,
      imageId: '', // Not used
      imageUrl: product.imagenUrl,
      category: product.categoriaNombre as any,
    };

    addToCart(productForCart);
    toast({
      title: "Añadido al carrito",
      description: `${productForCart.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
        <Link href="/productos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4"/>
            Volver a todos los productos
        </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.imagenUrl}
            alt={product.nombre}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">{product.nombre}</h1>
          <div className="flex items-end gap-2 mb-6">
              <p className={`text-3xl font-bold ${activeOffer ? 'text-destructive' : 'text-foreground'}`}>${displayPrice.toFixed(2)}</p>
              {activeOffer && <p className="text-xl font-bold text-muted-foreground line-through">${product.precio.toFixed(2)}</p>}
          </div>
          <p className="text-muted-foreground mb-8">{product.descripcion}</p>

          {product.fragancias && product.fragancias.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Elige una fragancia:</h2>
              <RadioGroup
                value={selectedVariant?.id.toString()}
                onValueChange={(variantId) => {
                  const variant = product.fragancias?.find((v) => v.id.toString() === variantId);
                  setSelectedVariant(variant);
                }}
                className="flex flex-wrap gap-4"
              >
                {product.fragancias.map((variant) => (
                  <div key={variant.id}>
                     <RadioGroupItem value={variant.id.toString()} id={variant.id.toString()} className="peer sr-only" />
                     <Label 
                        htmlFor={variant.id.toString()}
                        className={cn(
                            "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        )}
                     >
                        {variant.nombre}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
             {product.stock > 0 ? (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Añadir al Carrito
                </>
              ) : (
                'Sin Stock'
              )}
          </Button>
        </div>
      </div>
    </div>
  );
}
