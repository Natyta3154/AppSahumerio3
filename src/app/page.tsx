import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';
import { incenseSticks } from '@/lib/products';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
          Find Your Inner Peace
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Discover our exclusive collection of handcrafted incense and unique merchandise, designed to elevate your senses and bring tranquility to your space.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-headline font-bold mb-6 border-b-2 border-primary/20 pb-2">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl font-headline font-bold mb-6 border-b-2 border-primary/20 pb-2">Incense Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {incenseSticks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
