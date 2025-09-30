'use client';
import type { Product, ProductVariant } from '@/lib/products';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useCart } from '@/hooks/use-cart.tsx';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Tag } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ProductCardProps {
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

export function ProductCard({ product }: ProductCardProps) {
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
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-lg group">
        <CardHeader className="p-0">
            <div className='block aspect-square overflow-hidden relative bg-secondary'>
                <Image
                  src={imageUrl}
                  alt={product.nombre}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                 {activeOffer && (
                   <Badge variant="destructive" className="absolute top-2 right-2 flex items-center gap-1">
                     <Tag className="h-3 w-3"/>
                     Oferta
                   </Badge>
                )}
            </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
            <CardTitle className="text-lg font-headline mb-2 transition-colors">{product.nombre}</CardTitle>
            <div className="flex items-end gap-2 mb-4">
              <p className={`text-2xl font-bold ${activeOffer ? 'text-destructive' : 'text-primary'}`}>${displayPrice.toFixed(2)}</p>
              {activeOffer && <p className="text-lg font-bold text-muted-foreground line-through">${product.precio.toFixed(2)}</p>}
            </div>
            
            {hasVariants && (
              <div className="mt-auto space-y-2">
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
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
            <Button onClick={handleAddToCart} className="w-full" disabled={product.stock === 0}>
              {product.stock > 0 ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Añadir al Carrito
                </>
              ) : (
                'Sin Stock'
              )}
            </Button>
      </CardFooter>
    </Card>
  );
}
