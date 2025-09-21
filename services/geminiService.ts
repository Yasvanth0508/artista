import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Product } from "../types";

// Ensure API key is available. In a real app, this would be handled more securely.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will be mocked.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Translates a given text to a target language.
 * @param text The text to translate.
 * @param targetLanguage The language to translate to (e.g., 'French').
 * @returns The translated text.
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!API_KEY) {
    return `(Mock Translation) ${text} -> in ${targetLanguage}`;
  }
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Translate the following text to ${targetLanguage}. Return ONLY the translated text, with no preamble or explanation.\n\nText: "${text}"`,
        config: {
            temperature: 0.3,
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API translation error:", error);
    throw new Error("Failed to translate text.");
  }
};

/**
 * Gets intelligent search suggestions based on a user query.
 * @param query The user's search query.
 * @param products A list of products for context.
 * @returns An array of suggestion strings.
 */
export const getSearchSuggestions = async (query: string, products: Product[]): Promise<string[]> => {
    if (!API_KEY) {
        const searchableContent = products.flatMap(p => [p.title, ...p.tags, p.artist.name]);
        const uniqueContent = [...new Set(searchableContent)];
        return uniqueContent.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    }

  const contextString = products.slice(0, 10).map(p => 
        `Title: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags.join(', ')}\nArtist: ${p.artist.name}\nArtist Bio: ${p.artist.bio || 'Not available.'}`
    ).join('\n---\n');

  const prompt = `You are a search suggestion engine for an artisan marketplace. Given the user's query and a list of available artworks (including titles, descriptions, tags, and artist information), provide 5 relevant and concise suggestions suitable for a search dropdown. Consider typos, synonyms, and related concepts. For example, if a user searches for "calm" and there's a painting about a forest, you might suggest "serene nature paintings" or the painting's title "Whispers of the Forest".

    User Query: "${query}"

    Available Artwork Context:
    ${contextString} 
    
    Return a list of 5 suggestions.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });
    
    const jsonText = response.text;
    const result = JSON.parse(jsonText);
    return result.suggestions || [];
  } catch (error) {
    console.error("Gemini API search suggestion error:", error);
    // Fallback to simple filtering on error
    const searchableContent = products.flatMap(p => [p.title, ...p.tags, p.artist.name]);
    const uniqueContent = [...new Set(searchableContent)];
    return uniqueContent.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }
};

export const generateStoryForArtwork = async (title: string, artType: string, tags: string[]): Promise<string> => {
  if (!API_KEY) {
    return `(Mock AI Story) A captivating story about "${title}", a beautiful piece of ${artType} art, exploring themes of ${tags.join(', ')}.`;
  }
  const prompt = `You are an expert art curator. Write a compelling, evocative, and brief story-like description for a piece of artwork. Do not use markdown or titles. Just return the description paragraph.
  
  Artwork Details:
  - Title: "${title}"
  - Art Type: ${artType}
  - Tags: ${tags.join(', ')}
  
  Generate a description that is about 3-4 sentences long.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.7 }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API story generation error:", error);
    throw new Error("Failed to generate story.");
  }
};

export const editImageWithAi = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string,
): Promise<{ newImageDataUrl: string; newImageMimeType: string } | null> => {
  if (!API_KEY) {
    // Mock response for local development without API key
    const newImageDataUrl = `data:${mimeType};base64,${base64ImageData}`;
    return { newImageDataUrl, newImageMimeType: mimeType };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newBase64Image = part.inlineData.data;
          const newImageMimeType = part.inlineData.mimeType;
          const newImageDataUrl = `data:${newImageMimeType};base64,${newBase64Image}`;
          return { newImageDataUrl, newImageMimeType };
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Gemini API image edit error:", error);
    throw new Error("Failed to edit image with AI.");
  }
};