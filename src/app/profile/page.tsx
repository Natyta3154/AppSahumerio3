
'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Edit } from 'lucide-react';

export default function ProfilePage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reading cookies on the client side
    const name = getCookie('user-name');
    const email = getCookie('user-email');
    setUserName(typeof name === 'string' ? name : null);
    setUserEmail(typeof email === 'string' ? email : null);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-headline mb-8">Mi Perfil</h1>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Mi Perfil</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>
            Aquí puedes ver y editar los detalles de tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="name" value={userName ?? 'No disponible'} readOnly className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="email" type="email" value={userEmail ?? 'No disponible'} readOnly className="pl-10" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
