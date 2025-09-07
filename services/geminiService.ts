import { GoogleGenAI, Modality } from "@google/genai";
import { ImageStyle } from '../types';

// Fix: Initializing GoogleGenAI with a named apiKey parameter as required by the SDK guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function constructPrompt(prompt: string, styles: ImageStyle[]): string {
  if (styles.length === 0) {
    return prompt;
  }
  const styleModifiers = styles.map(s => s.promptModifier).join(', ');
  return `${prompt}, in the style of ${styleModifiers}`;
}

export async function generateImage(prompt: string, styles: ImageStyle[]): Promise<string> {
  const fullPrompt = constructPrompt(prompt, styles);

  try {
    // Fix: Using the correct model 'imagen-4.0-generate-001' for image generation tasks.
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      // Fix: Correctly accessing the base64 image data from the 'imageBytes' property in the response.
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No images were generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check the console for more details.");
  }
}

export async function editImage(
  prompt: string,
  styles: ImageStyle[],
  base64ImageData: string,
  mimeType: string
): Promise<string> {
  const fullPrompt = constructPrompt(prompt, styles);

  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };
    const textPart = { text: fullPrompt };

    // Fix: Using the correct model 'gemini-2.5-flash-image-preview' for image editing tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        // Fix: Ensuring both Modality.IMAGE and Modality.TEXT are included in responseModalities for image editing.
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Fix: Correctly extracting the edited image from a multi-modal response by finding the part with 'inlineData'.
    const imagePartResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePartResponse && imagePartResponse.inlineData) {
      const base64ImageBytes: string = imagePartResponse.inlineData.data;
      const responseMimeType = imagePartResponse.inlineData.mimeType;
      return `data:${responseMimeType};base64,${base64ImageBytes}`;
    } else {
      throw new Error("No edited image was returned.");
    }
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image. Please check the console for more details.");
  }
}
