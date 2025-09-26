'use client';
import type { Product } from '@/lib/products';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useCart } from '@/hooks/use-cart.tsx';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

// Helper to check if an offer is active
const getActiveOffer = (product: Product) => {
  const now = new Date();
  return product.ofertas?.find(offer => {
    const startDate = new Date(offer.fechaInicio);
    const endDate = new Date(offer.fechaFin);
    return offer.estado && now >= startDate && now <= endDate;
  });
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const activeOffer = getActiveOffer(product);
  const displayPrice = activeOffer ? activeOffer.precio : product.precio;

  const handleAddToCart = () => {
    // We need to adapt the product object to what the cart expects
    const productForCart = {
      id: product.id.toString(),
      name: product.nombre,
      description: product.descripcion,
      price: displayPrice,
      imageId: '', // We use imageUrl directly now, this can be adapted
      category: product.categoriaNombre as any, // adapt category type
      imageUrl: product.imagenUrl,
    };
    
    addToCart(productForCart);
    toast({
      title: "Añadido al carrito",
      description: `${product.nombre} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
        <CardHeader className="p-0">
            <Link href={`/productos/${product.id}`} className='block aspect-square overflow-hidden relative'>
                <Image
                src={product.imagenUrl}
                alt={product.nombre}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
                />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="h-8 w-8 text-white" />
                </div>
                 {activeOffer && (
                   <Badge variant="destructive" className="absolute top-2 right-2">Oferta</Badge>
                )}
            </Link>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <Link href={`/productos/${product.id}`}>
                <CardTitle className="text-lg font-headline mb-2 hover:text-primary transition-colors">{product.nombre}</CardTitle>
            </Link>
            <div className="flex items-end gap-2">
              <p className={`text-2xl font-bold ${activeOffer ? 'text-destructive' : 'text-primary'}`}>${displayPrice.toFixed(2)}</p>
              {activeOffer && <p className="text-lg font-bold text-muted-foreground line-through">${product.precio.toFixed(2)}</p>}
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={product.stock === 0}>
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
