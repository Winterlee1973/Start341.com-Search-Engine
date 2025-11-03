import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey });
const model = "gemini-2.5-flash";

export const searchWithGemini = async (query: string): Promise<GenerateContentResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response;
  } catch (error) {
    console.error("Error during Gemini API call:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
};
