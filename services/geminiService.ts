import { GoogleGenAI, Modality, Part } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function replaceProductInImage(
  posterImageBase64: string,
  posterMimeType: string,
  productImageBase64: string,
  productMimeType: string,
  productToReplace: string
): Promise<string | null> {
  try {
    const model = 'gemini-2.5-flash-image-preview';

    const posterImagePart: Part = {
      inlineData: {
        data: posterImageBase64,
        mimeType: posterMimeType,
      },
    };

    const productImagePart: Part = {
      inlineData: {
        data: productImageBase64,
        mimeType: productMimeType,
      },
    };

    const textPart: Part = {
        text: `You are a photorealistic product placement expert AI. Your primary function is to seamlessly replace a product within a given image (the "poster") with a new product image.

You will receive two images and one text instruction:
1.  **Poster Image:** The main image where the product replacement will occur. This is the first image provided.
2.  **New Product Image:** The image of the product that will be placed into the poster. This image might have a background that needs to be removed. This is the second image provided.
3.  **Product to Replace:** "${productToReplace}"

**Your task is to follow these steps precisely:**
1.  **Identify:** Carefully locate the object described as "${productToReplace}" within the Poster Image.
2.  **Remove:** Neatly remove the original product from the scene.
3.  **Integrate:** Place the New Product Image into the position of the removed product. This is the most critical step. The new product must look completely natural and photorealistic in the poster.
    *   **Perspective and Scale:** Match the exact perspective, angle, and scale of the original object's placement.
    *   **Lighting and Shadows:** Replicate the lighting of the original scene. The new product must cast realistic shadows that match the direction, softness, and color of other shadows in the image. It must also receive light and reflections from the environment correctly.
    *   **Color, Tone, and Texture Matching:** This is crucial for a believable result. Adjust the colors, saturation, brightness, and contrast of the new product to perfectly match the overall color grading, tone, and atmosphere of the poster. The texture of the product should also be rendered in a way that is consistent with the lighting and photographic style of the poster (e.g., film grain, sharpness, glossiness).
    *   **Interaction:** If the original product was held by someone or was interacting with a surface (e.g., sitting on a table, partially submerged in water), the new product must have the same interaction in a believable way.

**Output requirements:**
- **CRITICAL:** Your output MUST be ONLY the final edited image.
- DO NOT output any text, explanation, or confirmation. Your entire response must be a single image part.`
    };
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [posterImagePart, productImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the image part in the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    console.warn("No image part found in the Gemini response", response);
    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process image with Gemini API.");
  }
}
