'use client';
import type { Product } from '@/lib/products';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCart } from '@/hooks/use-cart.tsx';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const placeholder = PlaceHolderImages.find((p) => p.id === product.imageId);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Añadido al carrito",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
        <CardHeader className="p-0">
            <Link href={`/productos/${product.id}`} className='block aspect-square overflow-hidden relative'>
                {placeholder && (
                    <Image
                    src={placeholder.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={placeholder.imageHint}
                    />
                )}
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="h-8 w-8 text-white" />
                </div>
            </Link>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <Link href={`/productos/${product.id}`}>
                <CardTitle className="text-lg font-headline mb-2 hover:text-primary transition-colors">{product.name}</CardTitle>
            </Link>
            <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <ShoppingCart className="mr-2 h-4 w-4" /> Añadir al Carrito
            </Button>
      </CardFooter>
    </Card>
  );
}
