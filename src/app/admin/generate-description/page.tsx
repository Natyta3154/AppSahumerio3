import GenerateDescriptionForm from "./generate-description-form";

export default function GenerateDescriptionPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">AI Product Description Generator</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the product details below to generate a unique and engaging product description.
        </p>
      </div>
      
      <GenerateDescriptionForm />
    </div>
  );
}
