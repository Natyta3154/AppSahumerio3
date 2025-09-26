'use client';
import { useState } from 'react';
import { products, type ProductVariant } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product?.variants?.[0]);

  const { addToCart } = useCart();
  const { toast } = useToast();

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

  const currentVariant = product.variants ? selectedVariant : undefined;
  const displayPrice = product.price + (currentVariant?.priceModifier || 0);
  const displayImageId = currentVariant?.imageId || product.imageId;
  const placeholder = PlaceHolderImages.find((p) => p.id === displayImageId);

  const handleAddToCart = () => {
    // Create a product representation for the cart
    const productToAdd = {
      ...product,
      // If there's a variant, we create a unique ID and name for the cart item
      id: currentVariant ? `${product.id}-${currentVariant.id}` : product.id,
      name: currentVariant ? `${product.name} - ${currentVariant.name}` : product.name,
      price: displayPrice,
      imageId: displayImageId,
    };

    addToCart(productToAdd);
    toast({
      title: "Añadido al carrito",
      description: `${productToAdd.name} ha sido añadido a tu carrito.`,
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
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-foreground mb-6">${displayPrice.toFixed(2)}</p>
          <p className="text-muted-foreground mb-8">{product.description}</p>

          {product.variants && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Elige una fragancia:</h2>
              <RadioGroup
                value={selectedVariant?.id}
                onValueChange={(variantId) => {
                  const variant = product.variants?.find((v) => v.id === variantId);
                  setSelectedVariant(variant);
                }}
                className="flex flex-wrap gap-4"
              >
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                     <RadioGroupItem value={variant.id} id={variant.id} className="peer sr-only" />
                     <Label 
                        htmlFor={variant.id}
                        className={cn(
                            "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        )}
                     >
                        {variant.name} {variant.priceModifier ? `(+$${variant.priceModifier.toFixed(2)})` : ''}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
