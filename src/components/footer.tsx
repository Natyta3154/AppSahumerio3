import { Wind, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
             <Link href="/" className="flex items-center gap-2 mb-4">
              <Wind className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl font-headline">AromaCommerce</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Elevando tus sentidos y trayendo tranquilidad a tu espacio.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary">Inicio</Link></li>
              <li><Link href="/quienes-somos" className="text-muted-foreground hover:text-primary">Quiénes Somos</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contacto" className="text-muted-foreground hover:text-primary">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Términos de Servicio</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Política de Privacidad</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Política de Reembolso</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contacto@aromacomerce.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (234) 567-890</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} AromaCommerce. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
