
'use client';

import { useEffect, useRef, useState } from 'react';
import Autoplay from "embla-carousel-autoplay";
import { ProductCard } from '@/components/product-card';
import { type Product } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Tag } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

const blogPosts = [
  {
    id: '1',
    title: 'Los 5 Beneficios del Incienso de Sándalo para la Meditación',
    excerpt: 'Descubre cómo el aroma terroso y amaderado del sándalo puede profundizar tu práctica de meditación...',
    date: '15 de Julio, 2024',
    imageId: 'blog-sandalwood',
  },
  {
    id: '2',
    title: 'Creando un Ritual Matutino con Aromaterapia',
    excerpt: 'Empieza tu día con intención y energía positiva. Te mostramos cómo incorporar la aromaterapia en tu rutina.',
    date: '10 de Julio, 2024',
    imageId: 'blog-ritual',
  },
  {
    id: '3',
    title: 'Guía para Principiantes: Quemadores de Incienso',
    excerpt: 'Estos fascinantes quemadores crean un efecto de cascada de humo. Aprende a usarlos de forma segura.',
    date: '5 de Julio, 2024',
    imageId: 'burner-waterfall',
  },
];

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch('https://apisahumerios.onrender.com/productos/listado', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products for home page", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const featuredProducts = [...allProducts].sort((a, b) => b.precio - a.precio).slice(0, 4);
  const offerProducts = allProducts.filter(p => p.ofertas && p.ofertas.some(o => o.estado)).slice(0, 8);

  return (
    <div className="dark">
       <section className="relative h-[60vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Fondo de bienvenida"
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary mb-4 animate-fade-in-down">
            Encuentra tu Paz Interior
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto animate-fade-in-up">
            Descubre nuestra colección exclusiva de inciensos artesanales y productos únicos, diseñados para elevar tus sentidos y traer tranquilidad a tu espacio.
          </p>
          <div className="mt-8">
            <Link href="/productos">
              <Button size="lg">Explorar Colección</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="mb-20 p-8 md:p-12"><ProductsLoadingSkeleton /></div>
        ) : offerProducts.length > 0 && (
          <section className="mb-20 bg-accent/10 rounded-xl p-8 md:p-12 border border-accent/20 shadow-lg">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-headline font-bold text-primary mb-3 flex items-center justify-center gap-3">
                    <Tag className="h-8 w-8" />
                    Ofertas Imperdibles
                </h2>
                <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                    Aprovecha estos descuentos exclusivos por tiempo limitado.
                </p>
            </div>
            <div className="flex justify-center">
              <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {offerProducts.map((product) => (
                    <CarouselItem key={product.id} className="h-full md:basis-1/2 lg:basis-1/3">
                      <div className='p-1 h-full'>
                         <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          </section>
        )}
        
        <section className="mb-16">
          <h2 className="text-3xl font-headline font-bold mb-8 text-center border-b-2 border-primary/20 pb-4">Productos Premium</h2>
          {loading ? (
            <ProductsLoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-8 border-b-2 border-primary/20 pb-4">
            <h2 className="text-3xl font-headline font-bold">Desde Nuestro Blog</h2>
            <Link href="/blog">
              <Button variant="outline">Ver todo</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
                const placeholder = PlaceHolderImages.find((p) => p.id === post.imageId);
                return (
                    <Card key={post.id} className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="p-0">
                        <div className="aspect-video overflow-hidden relative">
                        {placeholder && (
                            <Image
                            src={placeholder.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            data-ai-hint={placeholder.imageHint}
                            />
                        )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                        <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                        <CardTitle className="text-xl font-headline mb-2 leading-tight">{post.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Link href={`/blog/${post.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                            Leer más <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        </Link>
                    </CardFooter>
                    </Card>
                );
            })}
           </div>
        </section>
      </div>
    </div>
  );
}
