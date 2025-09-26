'use server';

import { generateProductDescription, GenerateProductDescriptionInput } from "@/ai/flows/generate-product-descriptions";

export type FormState = {
  description: string | null;
  error: string | null;
}

export async function generateDescriptionAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const productData: GenerateProductDescriptionInput = {
    productName: formData.get('productName') as string,
    productCategory: formData.get('productCategory') as string,
    keyFeatures: formData.get('keyFeatures') as string,
    tone: formData.get('tone') as string,
  };

  try {
    const result = await generateProductDescription(productData);
    if (result.description) {
      return { description: result.description, error: null };
    }
    return { description: null, error: "Failed to generate description. Please try again." };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { description: null, error: `Error: ${errorMessage}` };
  }
}
