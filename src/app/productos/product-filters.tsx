'use client';

import { useState, useMemo } from 'react';
import { type Product } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductFilters({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('price-desc');

  const categories = useMemo(() => {
    if (products.length === 0) return [];
    return ['All', ...Array.from(new Set(products.map(p => p.categoriaNombre)))];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (category !== 'All') {
      filtered = filtered.filter(p => p.categoriaNombre === category);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.precio - b.precio;
        case 'price-desc':
          return b.precio - a.precio;
        case 'name-asc':
          return a.nombre.localeCompare(b.nombre);
        case 'name-desc':
            return b.nombre.localeCompare(a.nombre);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, category, sortOrder]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-16 bg-background/90 py-4 z-10 backdrop-blur-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='flex gap-4'>
            <Select onValueChange={setCategory} defaultValue="All">
            <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
                {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
            </SelectContent>
            </Select>

            <Select onValueChange={setSortOrder} defaultValue="price-desc">
            <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </>
  );
}
