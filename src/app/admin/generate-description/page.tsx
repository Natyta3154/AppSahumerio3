import GenerateDescriptionForm from "./generate-description-form";

export default function GenerateDescriptionPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Generador de Descripciones de Productos con IA</h1>
        <p className="text-muted-foreground mt-2">
          Completa los detalles del producto a continuación para generar una descripción única y atractiva.
        </p>
      </div>
      
      <GenerateDescriptionForm />
    </div>
  );
}
