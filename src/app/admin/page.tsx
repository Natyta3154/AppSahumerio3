import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ShoppingBasket } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Panel de Administración</h1>
      <p className="mb-8 text-muted-foreground">Bienvenido al panel de administración de AromaCommerce. Gestiona tu tienda desde aquí.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBasket className="text-primary" />
              Gestión de Productos
            </CardTitle>
            <CardDescription>Añade, edita y elimina productos de tu catálogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/products" className="text-primary font-semibold hover:underline">Ir a Productos</Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-accent" />
              Generador de Descripciones IA
            </CardTitle>
            <CardDescription>Genera descripciones de productos atractivas usando IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/generate-description" className="text-primary font-semibold hover:underline">Generar Descripciones</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
