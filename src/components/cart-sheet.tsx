'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { useCart } from '@/hooks/use-cart.tsx';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Separator } from './ui/separator';

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { cart, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Tu Carrito ({totalItems})</SheetTitle>
        </SheetHeader>
        {cart.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="flex flex-col gap-4">
                {cart.map(({ product, quantity }) => {
                  const placeholder = PlaceHolderImages.find((p) => p.id === product.imageId);
                  return (
                    <div key={product.id} className="flex items-start gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
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
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">
                  Pagar con MercadoPago
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-20 w-20 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold">Tu carrito está vacío</h3>
            <p className="text-muted-foreground">Añade algunos productos para empezar.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
