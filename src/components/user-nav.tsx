
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';
import { Skeleton } from './ui/skeleton';
import { useFormStatus } from 'react-dom';


type UserState = {
  isLoggedIn: boolean;
  userName: string | null;
  userRole: string | null;
  initials: string | null;
};

function LogoutMenuItem() {
    const { pending } = useFormStatus();

    return (
        <DropdownMenuItem disabled={pending} onClick={() => {}} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{pending ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
        </DropdownMenuItem>
    )
}

export function UserNav() {
  const [user, setUser] = useState<UserState | null>(null);
  
  useEffect(() => {
    const name = getCookie('user-name') || null;
    const role = getCookie('user-role') || null;
    
    if (name && typeof name === 'string') {
      const userInitials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
      setUser({
        isLoggedIn: true,
        userName: name,
        userRole: role,
        initials: userInitials,
      });
    } else {
      setUser({
        isLoggedIn: false,
        userName: null,
        userRole: null,
        initials: null,
      });
    }
  }, []);

  if (user === null) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user.isLoggedIn) {
    return (
      <Link href="/login" passHref>
        <Button variant="outline">
          <UserIcon className="mr-2 h-4 w-4" />
          Iniciar Sesión
        </Button>
      </Link>
    );
  }

  const isAdmin = user.userRole?.toUpperCase().includes('ADMIN');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Hola, {user.userName}</p>
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
            <LogoutMenuItem />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
