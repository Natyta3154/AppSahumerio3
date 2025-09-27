import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ShoppingBasket, Users, Package, ArrowRight, DollarSign, Activity, Users2 } from "lucide-react";
import Link from "next/link";
import { orders } from "@/lib/orders";
import { users } from "@/lib/users";
import { getProducts } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const latestOrders = orders.slice(0, 5);
  const products = await getProducts();
  const totalRevenue = orders.reduce((acc, order) => order.status === 'Completado' ? acc + order.total : acc, 0);
  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  const stats = [
    { title: "Ingresos Totales", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
    { title: "Total de Pedidos", value: totalOrders, icon: Package },
    { title: "Total de Clientes", value: totalCustomers, icon: Users2 },
    { title: "Productos sin Stock", value: outOfStockProducts, icon: ShoppingBasket, isWarning: outOfStockProducts > 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Panel de Administración</h1>
        <p className="text-muted-foreground mt-1">Un resumen general de tu tienda AromaCommerce.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.isWarning ? 'text-destructive' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.isWarning ? 'text-destructive' : ''}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
            <CardDescription>Los últimos 5 pedidos realizados en la tienda.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === 'Completado' ? 'default' : 
                          order.status === 'Pendiente' ? 'secondary' : 
                          'destructive'
                        }
                        className={order.status === 'Completado' ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30' : ''}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBasket className="text-primary" />
                Gestión de Productos
              </CardTitle>
              <CardDescription>Añade, edita y elimina productos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/products">
                 <Button className="w-full">
                    Ir a Productos <ArrowRight className="ml-2 h-4 w-4"/>
                 </Button>
              </Link>
            </CardContent>
          </Card>

           <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" />
                Generador IA
              </CardTitle>
              <CardDescription>Crea descripciones de productos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/generate-description">
                 <Button className="w-full" variant="secondary">
                    Generar Descripciones <ArrowRight className="ml-2 h-4 w-4"/>
                 </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
