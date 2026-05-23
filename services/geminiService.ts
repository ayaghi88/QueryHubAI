
import { GoogleGenAI } from "@google/genai";
import { Category, SearchResult, GroundingSource } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async performSearch(query: string, category: Category): Promise<SearchResult> {
    try {
      const systemInstruction = `
        You are an expert digital assistant specializing in ${category}. 
        Provide clear, concise, and helpful answers. 
        For Utility: provide immediate data.
        For Entertainment: provide ranked recommendations with brief reasons.
        For Skills: provide structured, numbered steps.
        For Trending: summarize the latest news accurately.
        Always maintain a professional yet friendly tone.
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "I couldn't find a specific answer for that. Please try rephrasing.";
      
      const sources: GroundingSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri && chunk.web.title) {
            sources.push({
              uri: chunk.web.uri,
              title: chunk.web.title
            });
          }
        });
      }

      // Deduplicate sources
      const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

      return {
        text,
        sources: uniqueSources,
        category,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
