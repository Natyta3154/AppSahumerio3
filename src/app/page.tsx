import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';
import { incenseSticks } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  
  // Example offers - you can create a separate list for these
  const offerProducts = products.slice(4, 8);

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
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-headline font-bold mb-8 text-center border-b-2 border-primary/20 pb-4">Productos Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        
        <section className="mb-16 bg-secondary/30 rounded-lg p-8">
          <h2 className="text-3xl font-headline font-bold mb-8 text-center border-b-2 border-primary/20 pb-4">Ofertas Especiales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {offerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-headline font-bold mb-8 text-center border-b-2 border-primary/20 pb-4">Colección de Inciensos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {incenseSticks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
