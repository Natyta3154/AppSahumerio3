import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProducts, type Product } from "@/lib/products";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddProductForm } from "./add-product-form";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  const products: Product[] = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gestionar Productos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Producto</DialogTitle>
              <DialogDescription>
                Completa los detalles para añadir un nuevo producto a tu tienda.
              </DialogDescription>
            </DialogHeader>
            <AddProductForm />
          </DialogContent>
        </Dialog>
      </div>
      
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
              {products.map((product) => {
                 return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                         <Image
                          src={product.imagenUrl}
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
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                 )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
