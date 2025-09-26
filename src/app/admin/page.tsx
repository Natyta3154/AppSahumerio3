import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ShoppingBasket } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Admin Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Welcome to the AromaCommerce admin panel. Manage your store from here.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBasket className="text-primary" />
              Product Management
            </CardTitle>
            <CardDescription>Add, edit, and delete products from your catalog.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/products" className="text-primary font-semibold hover:underline">Go to Products</Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-accent" />
              AI Description Generator
            </CardTitle>
            <CardDescription>Generate engaging product descriptions using AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/generate-description" className="text-primary font-semibold hover:underline">Generate Descriptions</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
