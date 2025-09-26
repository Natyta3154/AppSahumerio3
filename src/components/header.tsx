'use client';
import Link from 'next/link';
import { ShoppingBag, User, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './cart-sheet';

export function Header() {
  const { totalItems } = useCart();
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl font-headline">AromaCommerce</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</Link>
          <Link href="/admin" className="text-foreground/80 hover:text-primary transition-colors">Admin</Link>
          <Link href="/profile" className="text-foreground/80 hover:text-primary transition-colors">Profile</Link>
        </nav>

        <div className="flex items-center gap-4">
          <CartSheet>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </CartSheet>
          <Link href="/login">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
