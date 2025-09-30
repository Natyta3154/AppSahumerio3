'use client';
import type { Product, ProductVariant } from '@/lib/products';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Tag } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductDetailClientPageProps {
  product: Product;
}

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

export default function ProductDetailClientPage({ product }: ProductDetailClientPageProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const hasVariants = product.fragancias && product.fragancias.length > 0;
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    hasVariants ? product.fragancias[0] : undefined
  );

  const activeOffer = useMemo(() => getActiveOffer(product), [product]);
  const displayPrice = activeOffer ? activeOffer.precio : product.precio;
  const imageUrl = product.imagenUrl || 'https://picsum.photos/seed/placeholder/400/400';

  const handleAddToCart = () => {
    const productForCart = {
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id.toString(),
      name: selectedVariant ? `${product.nombre} - ${selectedVariant.nombre}` : product.nombre,
      description: product.descripcion,
      price: displayPrice,
      imageId: '',
      imageUrl: imageUrl,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
                 <Image
                  src={imageUrl}
                  alt={product.nombre}
                  fill
                  className="object-cover"
                  unoptimized
                />
                 {activeOffer && (
                   <Badge variant="destructive" className="absolute top-4 right-4 text-base flex items-center gap-1">
                     <Tag className="h-4 w-4"/>
                     Oferta
                   </Badge>
                )}
            </div>

            <div className="flex flex-col">
                <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.nombre}</h1>
                <p className="text-muted-foreground mt-2">{product.categoriaNombre}</p>
                
                <div className="flex items-end gap-3 my-4">
                  <p className={`text-4xl font-bold ${activeOffer ? 'text-destructive' : 'text-primary'}`}>${displayPrice.toFixed(2)}</p>
                  {activeOffer && <p className="text-2xl font-bold text-muted-foreground line-through">${product.precio.toFixed(2)}</p>}
                </div>
                
                <p className="text-foreground/80 leading-relaxed">{product.descripcion}</p>

                <div className="mt-8">
                     {hasVariants && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Elige una fragancia:</label>
                             <Select
                                value={selectedVariant?.id.toString()}
                                onValueChange={(variantId) => {
                                    const variant = product.fragancias.find(v => v.id.toString() === variantId);
                                    setSelectedVariant(variant);
                                }}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar aroma" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.fragancias.map((variant) => (
                                    <SelectItem key={variant.id} value={variant.id.toString()}>
                                        {variant.nombre}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-8">
                     <Button onClick={handleAddToCart} size="lg" className="w-full" disabled={product.stock === 0}>
                        {product.stock > 0 ? (
                            <>
                            <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
                            </>
                        ) : (
                            'Sin Stock'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
