
'use client';
import { useState } from 'react';
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

// Helper to check if an offer is active
const getActiveOffer = (product: Product) => {
  if (!product.ofertas || product.ofertas.length === 0) return undefined;
  const now = new Date();
  return product.ofertas.find(offer => {
    const startDate = new Date(offer.fechaInicio);
    const endDate = new Date(offer.fechaFin);
    // Add a day to the end date to make it inclusive
    endDate.setDate(endDate.getDate() + 1);
    return offer.estado && now >= startDate && now < endDate;
  });
};

interface ProductDetailClientPageProps {
  product: Product;
}

export default function ProductDetailClientPage({ product }: ProductDetailClientPageProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.fragancias && product.fragancias.length > 0 ? product.fragancias[0] : undefined
  );

  const { addToCart } = useCart();
  const { toast } = useToast();

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
                value={selectedVariant?.id.toString() ?? ''}
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
