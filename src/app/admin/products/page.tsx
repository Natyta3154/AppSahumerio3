'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProducts, type Product } from "@/lib/products";
import { Pencil, PlusCircle, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { DeleteProductDialog } from "./delete-product-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    loadProducts(); // Reload products on success
  };
  
  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
        </TableRow>
      ));
    }

    if (error) {
       return (
        <TableRow>
          <TableCell colSpan={6}>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error al Cargar Productos</AlertTitle>
              <AlertDescription>
                No se pudieron cargar los productos. Por favor, verifica la conexión con el servidor.
                <br />
                <strong>Detalle:</strong> {error}
              </AlertDescription>
            </Alert>
          </TableCell>
        </TableRow>
      );
    }

    return products.map((product) => (
      <TableRow key={product.id}>
        <TableCell>
          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
            <Image
              src={product.imagenUrl || 'https://picsum.photos/seed/placeholder/100/100'}
              alt={product.nombre}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </TableCell>
        <TableCell className="font-medium">{product.nombre}</TableCell>
        <TableCell>
          <Badge variant="secondary">{product.categoriaNombre}</Badge>
        </TableCell>
        <TableCell>${product.precio.toFixed(2)}</TableCell>
        <TableCell>{product.stock}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleOpenDialog(product)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteProductDialog productId={product.id} productName={product.nombre} onSuccess={handleSuccess} />
        </TableCell>
      </TableRow>
    ));
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gestionar Productos</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modifica los detalles del producto.' : 'Completa los detalles para añadir un nuevo producto.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm product={editingProduct} onSuccess={handleSuccess} onCancel={handleCloseDialog} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderContent()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
