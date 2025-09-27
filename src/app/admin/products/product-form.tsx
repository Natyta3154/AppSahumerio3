'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Product } from '@/lib/products';
import { upsertProductAction, type FormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

const initialState: FormState = {
  message: null,
  errors: {},
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? 'Guardando Cambios...' : 'Añadiendo Producto...') : (isEditing ? 'Guardar Cambios' : 'Añadir Producto')}
    </Button>
  );
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [state, formAction] = useActionState(upsertProductAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!product?.id;

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message.includes('Error') ? "Error" : "Éxito",
        description: state.message,
        variant: state.message.includes('Error') ? "destructive" : "default",
      });
      if (state.message.includes('éxito')) {
        onSuccess();
        formRef.current?.reset();
      }
    }
  }, [state, toast, onSuccess]);

  return (
    <form ref={formRef} action={formAction}>
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-4 py-4">
        <div className="space-y-1">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" defaultValue={product?.nombre ?? ''} required />
          {state.errors?.nombre && <p className="text-sm text-destructive">{state.errors.nombre[0]}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea id="descripcion" name="descripcion" defaultValue={product?.descripcion ?? ''} required />
          {state.errors?.descripcion && <p className="text-sm text-destructive">{state.errors.descripcion[0]}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="precio">Precio</Label>
            <Input id="precio" name="precio" type="number" step="0.01" defaultValue={product?.precio ?? ''} required />
            {state.errors?.precio && <p className="text-sm text-destructive">{state.errors.precio[0]}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" defaultValue={product?.stock ?? ''} required />
            {state.errors?.stock && <p className="text-sm text-destructive">{state.errors.stock[0]}</p>}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="categoriaId">Categoría</Label>
          <Select name="categoriaId" defaultValue={product?.categoriaNombre === 'Incienso' ? '1' : '2'}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Incienso</SelectItem>
              <SelectItem value="2">Quemador</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.categoriaId && <p className="text-sm text-destructive">{state.errors.categoriaId[0]}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="imagenUrl">URL de Imagen</Label>
          <Input id="imagenUrl" name="imagenUrl" defaultValue={product?.imagenUrl ?? ''} placeholder="https://example.com/image.jpg" />
           {state.errors?.imagenUrl && <p className="text-sm text-destructive">{state.errors.imagenUrl[0]}</p>}
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <SubmitButton isEditing={isEditing} />
      </DialogFooter>
    </form>
  );
}
