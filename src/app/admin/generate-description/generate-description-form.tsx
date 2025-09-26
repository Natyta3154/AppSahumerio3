'use client';

import { useFormState, useFormStatus } from 'react-dom';
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
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Description
        </>
      )}
    </Button>
  );
}

export default function GenerateDescriptionForm() {
  const [state, formAction] = useFormState(generateDescriptionAction, initialState);

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="productName" placeholder="e.g., Calming Lavender Incense" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Product Category</Label>
              <Input id="productCategory" name="productCategory" placeholder="e.g., Incense Sticks" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyFeatures">Key Features (comma-separated)</Label>
              <Textarea id="keyFeatures" name="keyFeatures" placeholder="e.g., Hand-rolled, All-natural ingredients, Long-lasting aroma" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone of Voice</Label>
              <Select name="tone" defaultValue="Informative">
                <SelectTrigger>
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Informative">Informative</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                  <SelectItem value="Humorous">Humorous</SelectItem>
                  <SelectItem value="Spiritual">Spiritual</SelectItem>
                  <SelectItem value="Luxurious">Luxurious</SelectItem>
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
              <CardTitle>Generated Description</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea 
                readOnly 
                value={state.description ?? ''} 
                className="h-full min-h-[200px] resize-none"
                placeholder="AI-generated description will appear here..." 
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
