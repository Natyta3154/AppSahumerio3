import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ShoppingBasket, Users, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Panel de Administración</h1>
      <p className="mb-8 text-muted-foreground">Bienvenido al panel de administración de AromaCommerce. Gestiona tu tienda desde aquí.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBasket className="text-primary" />
              Gestión de Productos
            </CardTitle>
            <CardDescription>Añade, edita y elimina productos de tu catálogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/products" className="text-primary font-semibold hover:underline flex items-center gap-2">
                Ir a Productos <ArrowRight className="h-4 w-4"/>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="text-primary" />
              Gestión de Pedidos
            </CardTitle>
            <CardDescription>Consulta y gestiona los pedidos de tus clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/orders" className="text-primary font-semibold hover:underline flex items-center gap-2">
                Ir a Pedidos <ArrowRight className="h-4 w-4"/>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>Administra los usuarios registrados en tu tienda.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users" className="text-primary font-semibold hover:underline flex items-center gap-2">
                Ir a Usuarios <ArrowRight className="h-4 w-4"/>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              Generador de Descripciones IA
            </CardTitle>
            <CardDescription>Genera descripciones de productos atractivas usando IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/generate-description" className="text-primary font-semibold hover:underline flex items-center gap-2">
                Generar Descripciones <ArrowRight className="h-4 w-4"/>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
