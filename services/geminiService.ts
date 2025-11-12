
import { GoogleGenAI, Modality } from "@google/genai";
import { ImageData } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

export const processImageWithGemini = async (
  image: ImageData,
  prompt: string,
  upscaleFactor: number,
  creativity: number
): Promise<string> => {
  try {
    const fullPrompt = `
      Task: Enhance and transform the provided image.
      Upscale Factor: Upscale the image to ${upscaleFactor}x its original size, adding plausible details to maintain quality at the new resolution.
      Creativity Level: ${creativity}/100. A higher level means more artistic interpretation and 'hallucinated' details. A lower level means staying more faithful to the original image.
      User's Request: "${prompt}"
      
      Carefully analyze the image and the user's request. Apply the upscaling and creative transformation as instructed.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error('No image data found in the API response.');
  } catch (error) {
    console.error("Error processing image with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    if (errorMessage.includes("API key not valid")) {
       throw new Error("The API key is invalid. Please check your configuration.");
    }
    throw new Error(`Failed to process image. ${errorMessage}`);
  }
};
