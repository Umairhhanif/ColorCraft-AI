import { GoogleGenAI, Type, Chat } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Planning Phase: Generate scene descriptions
export const generateBookPlan = async (theme: string, childName: string): Promise<{ coverDescription: string, pageDescriptions: string[] }> => {
  const ai = getAiClient();
  
  const prompt = `Create a coloring book plan for a child named "${childName}" with the theme "${theme}". 
  I need 1 cover image description and 5 distinct, fun, and cute page scene descriptions. 
  The descriptions should be visual and suitable for a black-and-white outline drawing.
  Keep descriptions concise (under 30 words).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coverDescription: { type: Type.STRING, description: "Visual description for the book cover" },
          pageDescriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 5 distinct scene descriptions for the coloring pages"
          }
        },
        required: ["coverDescription", "pageDescriptions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No plan generated");
  return JSON.parse(text);
};

// 2. Image Generation Phase
export const generateColoringPageImage = async (description: string, isCover: boolean = false): Promise<string> => {
  const ai = getAiClient();
  
  // Specialized prompt for coloring book style
  const basePrompt = isCover 
    ? `A clean, black and white line art coloring book cover for kids. Theme: ${description}. Thick bold lines, white background, high contrast, vector style, cute, professional illustration. No shading, no grayscale.`
    : `A clean, black and white line art coloring book page for kids. Scene: ${description}. Thick bold lines, white background, high contrast, vector style, cute, professional illustration, simple enough for a child to color. No shading, no grayscale.`;

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: basePrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '3:4', // Portrait for book pages
    },
  });

  const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (!base64ImageBytes) throw new Error("Failed to generate image");
  
  return `data:image/jpeg;base64,${base64ImageBytes}`;
};

// 3. Chat Helper
export const createChatSession = (): Chat => {
  const ai = getAiClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are a friendly, creative assistant helping a parent design a custom coloring book. Help them brainstorm themes, suggest characters, or refine ideas. Keep answers concise and helpful.",
    },
  });
};