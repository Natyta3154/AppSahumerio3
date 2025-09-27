'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateDescriptionAction, type FormState } from './actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Sparkles, Loader2 } from 'lucide-react';

const initialState: FormState = {
  description: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generar Descripción
        </>
      )}
    </Button>
  );
}

export default function GenerateDescriptionForm() {
  const [state, formAction] = useActionState(generateDescriptionAction, initialState);

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Nombre del Producto</Label>
              <Input id="productName" name="productName" placeholder="ej., Incienso Relajante de Lavanda" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Categoría del Producto</Label>
              <Input id="productCategory" name="productCategory" placeholder="ej., Varitas de Incienso" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyFeatures">Características Clave (separadas por comas)</Label>
              <Textarea id="keyFeatures" name="keyFeatures" placeholder="ej., Hecho a mano, Ingredientes naturales, Aroma duradero" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tono de Voz</Label>
              <Select name="tone" defaultValue="Informativo">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Informativo">Informativo</SelectItem>
                  <SelectItem value="Persuasivo">Persuasivo</SelectItem>
                  <SelectItem value="Humorístico">Humorístico</SelectItem>
                  <SelectItem value="Espiritual">Espiritual</SelectItem>
                  <SelectItem value="Lujoso">Lujoso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle>Descripción Generada</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea 
                readOnly 
                value={state.description ?? ''} 
                className="h-full min-h-[200px] resize-none"
                placeholder="La descripción generada por IA aparecerá aquí..." 
              />
            </CardContent>
          </Card>
          {state.error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </form>
  );
}
