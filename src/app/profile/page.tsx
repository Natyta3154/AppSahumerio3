
'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail } from 'lucide-react';

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
              Estos son los detalles asociados a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2 text-muted-foreground"><User className="h-5 w-5" /> Nombre</h3>
              <p className="text-lg font-semibold">{userName || 'No disponible'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2 text-muted-foreground"><Mail className="h-5 w-5" /> Correo Electrónico</h3>
              <p className="text-lg font-semibold">{userEmail || 'No disponible'}</p>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
