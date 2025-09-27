
'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';
import { Skeleton } from './ui/skeleton';

export function UserNav() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reading cookies on the client side
    const name = getCookie('user-name');
    const role = getCookie('user-role');
    setUserName(typeof name === 'string' ? name : null);
    setUserRole(typeof role === 'string' ? role : null);
    setIsLoading(false);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!userName || !userRole) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="icon">
          <UserIcon className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  const isAdmin = userRole.toUpperCase() === 'ADMIN';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Hola, {userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {isAdmin ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Panel de Admin</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <form action={logoutAction}>
           <button type="submit" className="w-full">
            <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
            </DropdownMenuItem>
           </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
