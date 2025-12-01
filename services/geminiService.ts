import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are 'ZenithBot', the AI support assistant for Zenith Loot, the premium online shop for in-game currency top-ups.
Your tone should be helpful, gamer-friendly, and concise.

Key Info about Zenith Loot:
- We support top-tier games like COD Mobile, Free Fire, PUBG, Genshin Impact, etc.
- We offer instant delivery.
- Payment methods include Credit Card, PayPal, M-Pesa, Airtel Money, Google Pay, and Apple Pay.
- Refunds are only possible if the code hasn't been redeemed.
- We have a promo code system. 

If a user asks about a specific game price, give them a general idea based on standard industry pricing (e.g., $1 for ~80 currency).
If you don't know the answer, ask them to email support@zenithloot.com.
Do not make up fake transaction IDs.
`;

export const initializeChat = (): void => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing. Chat will not function.");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
    if (!chatSession) return "Sorry, I'm currently offline. Please check your connection or API key.";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "I didn't catch that. Could you repeat?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the server right now. Try again later.";
  }
};