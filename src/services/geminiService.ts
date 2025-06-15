import { GEMINI_API_KEY, API_CONFIG } from '../config/api';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const isGeminiApiKeyAvailable = () => {
    return !!GEMINI_API_KEY && GEMINI_API_KEY.length > 0;
};

export const startNewChatSession = async (history: any[] = []) => {
    if (!isGeminiApiKeyAvailable()) {
        throw new Error('Gemini API key is not configured');
    }
    const model = genAI.getGenerativeModel({ model: API_CONFIG.modelName });
    const chat = model.startChat({
        history,
        generationConfig: {
            maxOutputTokens: 2048,
        },
    });
    return chat;
};

export const sendChatMessageStreamToGemini = async (message: any) => {
    if (!isGeminiApiKeyAvailable()) {
        throw new Error('Gemini API key is not configured');
    }
    const model = genAI.getGenerativeModel({ model: API_CONFIG.modelName });
    const chat = await startNewChatSession();
    return await chat.sendMessageStream(message);
};

export const getWordExplanationFromGemini = async (word: string, sourceLang: string) => {
    if (!isGeminiApiKeyAvailable()) {
        throw new Error('Gemini API key is not configured');
    }
    const model = genAI.getGenerativeModel({ model: API_CONFIG.modelName });
    const prompt = `Explain the word "${word}" in both English and Khmer. Source language is ${sourceLang}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}; 