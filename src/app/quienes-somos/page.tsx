import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Leaf, Target, Users } from "lucide-react";

export default function QuienesSomosPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
          Sobre AromaCommerce
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Nuestra pasión es crear ambientes de paz y serenidad a través de aromas que inspiran el alma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-4">Nuestra Historia</h2>
          <p className="text-muted-foreground mb-4">
            AromaCommerce nació de un profundo aprecio por las antiguas tradiciones del incienso y la aromaterapia. Creemos que los aromas tienen el poder de transformar espacios, calmar la mente y elevar el espíritu. 
          </p>
          <p className="text-muted-foreground">
            Comenzamos como un pequeño taller, elaborando inciensos a mano con ingredientes naturales y sostenibles. Hoy, hemos crecido para ofrecer una cuidada selección de productos que comparten nuestra filosofía de calidad, artesanía y bienestar.
          </p>
        </div>
        <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
           {aboutImage && (
            <Image
              src={aboutImage.imageUrl}
              alt="Taller de AromaCommerce"
              fill
              className="object-cover"
              data-ai-hint={aboutImage.imageHint}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Nuestra Misión</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ofrecer productos aromáticos de la más alta calidad que promuevan el bienestar, la relajación y la conexión espiritual en la vida cotidiana de nuestros clientes.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Nuestra Visión</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ser la marca líder y de mayor confianza en productos de aromaterapia y bienestar, inspirando a personas de todo el mundo a crear sus propios santuarios de paz.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Nuestros Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Calidad, autenticidad, sostenibilidad y un profundo respeto por nuestros clientes y el medio ambiente. Creemos en el comercio justo y el abastecimiento ético.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
