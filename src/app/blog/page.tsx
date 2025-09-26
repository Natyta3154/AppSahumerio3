import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

// Mock data for blog posts
const blogPosts = [
  {
    id: '1',
    title: 'Los 5 Beneficios del Incienso de Sándalo para la Meditación',
    excerpt: 'Descubre cómo el aroma terroso y amaderado del sándalo puede profundizar tu práctica de meditación y promover la claridad mental...',
    date: '15 de Julio, 2024',
    imageId: 'blog-sandalwood',
  },
  {
    id: '2',
    title: 'Creando un Ritual Matutino con Aromaterapia',
    excerpt: 'Empieza tu día con intención y energía positiva. Te mostramos cómo incorporar la aromaterapia en tu rutina matutina para un comienzo perfecto.',
    date: '10 de Julio, 2024',
    imageId: 'blog-ritual',
  },
  {
    id: '3',
    title: 'Guía para Principiantes: Cómo Usar un Quemador de Incienso de Reflujo',
    excerpt: 'Estos fascinantes quemadores crean un efecto de cascada de humo. Aprende a usarlos de forma segura y a sacarles el máximo partido.',
    date: '5 de Julio, 2024',
    imageId: 'burner-waterfall',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
          Nuestro Blog de Bienestar
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Artículos, guías y consejos para una vida más consciente y aromática.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => {
          const placeholder = PlaceHolderImages.find((p) => p.id === post.imageId);
          return (
            <Card key={post.id} className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="aspect-video overflow-hidden relative">
                  {placeholder && (
                    <Image
                      src={placeholder.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      data-ai-hint={placeholder.imageHint}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                <CardTitle className="text-xl font-headline mb-2 leading-tight">{post.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/blog/${post.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Leer más <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
