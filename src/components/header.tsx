'use client';
import Link from 'next/link';
import { ShoppingBag, Wind, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/hooks/use-cart.tsx';
import { CartSheet } from './cart-sheet';
import { UserNav } from './user-nav';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';

const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Productos" },
    { href: "/ofertas", label: "Ofertas" },
    { href: "/quienes-somos", label: "Quiénes Somos" },
    { href: "/blog", label: "Blog" },
    { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl font-headline">AromaCommerce</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
             <Link key={link.href} href={link.href} className="text-foreground/80 hover:text-primary transition-colors">{link.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="md:hidden">
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6"/>
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="p-4">
                        <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                            <Wind className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl font-headline">AromaCommerce</span>
                        </Link>
                        <nav className="flex flex-col gap-4">
                            {navLinks.map(link => (
                                 <Link key={link.href} href={link.href} className="text-lg text-foreground/80 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{link.label}</Link>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
          </div>

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
          <UserNav />
        </div>
      </div>
    </header>
  );
}
