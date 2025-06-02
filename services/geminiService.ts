
import { GoogleGenAI, GenerateContentResponse, Content, Part, Chat } from "@google/genai";
import { PromptGenerationFormState, ChatMessage, Candidate } from '../types';
import { GEMINI_API_MODEL_TEXT, GEMINI_API_MODEL_MULTIMODAL, GEMINI_API_MODEL_IMAGE_GENERATION } from "../constants";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
let activeChat: Chat | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

export const isGeminiApiKeyAvailable = (): boolean => {
  return !!API_KEY;
};

const handleGeminiError = (error: any): string => {
  console.error("Gemini API Error:", error);
  if (error instanceof Error) {
    if (error.message.includes('API key not valid')) {
      return "The provided Gemini API key is not valid. Please check your API_KEY environment variable.";
    }
    if (error.message.includes('quota')) {
      return "You have exceeded your Gemini API quota. Please check your usage and limits.";
    }
    if (error.message.includes('candidate.finishReason')) {
        // This can happen for safety reasons or other issues
        return "The AI could not generate a response for this request. It might be due to safety settings or an issue with the prompt.";
    }
     if (error.message.toLowerCase().includes('model not found')) {
      return `The specified AI model was not found. Please check the model name.`;
    }
    if (error.message.toLowerCase().includes('permission denied') || error.message.toLowerCase().includes('access denied')) {
        return "Permission denied by the AI service. This could be due to API key restrictions or service permissions.";
    }
  }
  return "Failed to communicate with the AI service. It might be temporarily unavailable or encountered an issue.";
};


export const generatePromptWithGemini = async (
  userInput: PromptGenerationFormState
): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }

  const metaPrompt = `
You are an expert AI Prompt Engineer. Your task is to help a user craft an effective prompt for an AI model (like ChatGPT, Gemini, Claude, etc.) based on their specific needs.

The user has provided the following information:
1.  **Topic/Subject:** ${userInput.topic || 'Not specified'}
2.  **Further Details/Context:** ${userInput.details || 'Not specified'}
3.  **Main Message/Purpose:** ${userInput.purpose || 'Not specified'}
4.  **Desired AI Task:** ${userInput.aiTask || 'Not specified'}
5.  **Target AI Model (if specified):** ${userInput.targetAI || 'Not specified'}

Please generate a clear, concise, and actionable prompt that the user can directly copy and paste into their chosen AI model.

Consider the following when crafting the prompt:
-   **Clarity:** The prompt should be unambiguous.
-   **Specificity:** Encourage specific details for better AI output.
-   **Goal-Oriented:** Align the prompt with the user's stated purpose and AI task.
-   **Format (if applicable):** If the task implies a format (e.g., "list 5 ideas", "write an email"), incorporate that.
-   **Tone (if implied):** If the context suggests a tone (e.g., professional, casual, academic), reflect that.
-   **Action Verbs:** Start with strong action verbs.

If the user specified a target AI model, you can subtly tailor the prompt structure if there are known best practices for that model, but prioritize general effectiveness if unsure.

**Output ONLY the generated prompt itself, ready for the user to copy. Do not include any explanations or conversational text around the prompt.**
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL_TEXT,
      contents: metaPrompt,
    });
    
    let text = (response.text || '').trim(); 
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = text.match(fenceRegex);
    if (match && match[2]) {
      text = (match[2] || '').trim(); 
    }
    return text;

  } catch (error) {
    throw new Error(handleGeminiError(error));
  }
};

export const translateTextWithGemini = async (
  text: string,
  sourceLangFull: string, 
  targetLangFull: string  
): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }

  const prompt = `Translate the following text from ${sourceLangFull} to ${targetLangFull}. Output ONLY the translated text, without any additional explanations, titles, or phrases like "Here is the translation:":\n\n"${text}"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL_TEXT,
      contents: prompt,
    });
    
    let translatedText = (response.text || '').trim(); 
    if (translatedText.toLowerCase().startsWith(`here is the translation in ${targetLangFull.toLowerCase()}:`)) {
        translatedText = (translatedText.substring(`here is the translation in ${targetLangFull.toLowerCase()}:`.length) || '').trim();
    }
    if (translatedText.toLowerCase().startsWith(`${targetLangFull.toLowerCase()}:`)) {
        translatedText = (translatedText.substring(`${targetLangFull.toLowerCase()}:`.length) || '').trim();
    }
    if (translatedText.startsWith('"') && translatedText.endsWith('"')) {
      translatedText = translatedText.substring(1, translatedText.length - 1);
    }

    return translatedText;
  } catch (error) {
    throw new Error(handleGeminiError(error));
  }
};

export const startNewChatSession = (history?: Content[]): void => {
  if (!ai) {
    console.error("Gemini API client not initialized for chat.");
    activeChat = null;
    return;
  }
  try {
    activeChat = ai.chats.create({
      model: GEMINI_API_MODEL_MULTIMODAL,
      config: {
        systemInstruction: `You are AI Khmer, a friendly and highly capable AI assistant. 
        You can understand and respond in both English and Khmer. 
        You can analyze images uploaded by the user (these user-uploaded images will be processed by you but will NOT be displayed back in the chat history), help with coding tasks (provide snippets, explain concepts, suggest project structures), and answer a wide range of questions. 
        Be helpful, concise, and accurate. 
        If asked to 'build a project', interpret this as a request for code examples, architectural suggestions, or step-by-step guidance. 
        When providing code, always specify the language (e.g., \`\`\`javascript ... \`\`\`).
        
        IMAGE & WEB SEARCH:
        When a user asks you to find images, pictures, or up-to-date information from the web (e.g., "find a picture of Angkor Wat", "what's the latest news on tech companies?", "show me images of Cambodian food"), YOU MUST USE the 'googleSearch' tool.
        - If you find relevant images through search, try to include them directly in your response using Markdown image syntax (e.g., ![alt text](image_url.png)). These searched images WILL be displayed.
        - If direct embedding is not possible, or you find multiple relevant images, provide the direct image URLs.
        - ALWAYS cite your web sources by listing the URLs found through Google Search below your main answer, especially if you used information or images from them.

        ENGLISH LANGUAGE LEARNING:
        You are also an English language learning assistant. You can help users practice English, explain grammar, provide vocabulary, correct their sentences, and engage in conversational practice. If the user indicates they want to learn or practice English, or if their message suggests a desire for language assistance (e.g., "how do I say this in English?", "is my English correct?"), actively take on this role.
        
        IMPORTANT API CONSTRAINT: When the googleSearch tool is active or being used for a query, DO NOT use or request 'responseMimeType: "application/json"'. Your response must be standard text/markdown.
        
        Be friendly and ensure your responses are well-formatted.`,
        tools: [{ googleSearch: {} }], // Enable Google Search tool
      },
      history: history || [], 
    });
    console.log(history && history.length > 0 ? `Chat session started with ${history.length} history items.` : "New chat session started.");
  } catch (error) {
    console.error("Failed to create chat session:", error);
    activeChat = null;
    throw new Error(`Failed to create chat session: ${handleGeminiError(error)}`);
  }
};


export const sendChatMessageToGemini = async ( // Note: This function is not currently used for streaming chat in PremiumPage
  userMessage: ChatMessage
): Promise<GenerateContentResponse> => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }
  if (!activeChat) {
    console.log("No active chat, starting a new one (this should ideally be handled by UI by calling startNewChatSession with history first).");
    startNewChatSession(); 
    if (!activeChat) { 
        throw new Error("Failed to start a new chat session.");
    }
  }

  const parts: Part[] = [{ text: userMessage.text }];

  if (userMessage.image && userMessage.imageMimeType) {
    parts.unshift({ 
      inlineData: {
        mimeType: userMessage.imageMimeType,
        data: userMessage.image,
      },
    });
  }
  
  try {
    const response: GenerateContentResponse = await activeChat.sendMessage({
      message: parts 
    });
    return response; // Return the full response object
  } catch (error) {
     throw new Error(handleGeminiError(error));
  }
};

export const sendChatMessageStreamToGemini = async (
  userMessage: ChatMessage
): Promise<AsyncIterable<GenerateContentResponse>> => {
   if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }
  if (!activeChat) {
    startNewChatSession(); // This will now include googleSearch tool
     if (!activeChat) { 
        throw new Error("Failed to start a new chat session for streaming.");
    }
  }

  const parts: Part[] = [{ text: userMessage.text }];
  if (userMessage.image && userMessage.imageMimeType) {
    parts.unshift({
      inlineData: {
        mimeType: userMessage.imageMimeType,
        data: userMessage.image,
      },
    });
  }
  
  try {
    // sendMessageStream itself returns AsyncIterable<GenerateContentResponse>
    // Each chunk in this iterable is a GenerateContentResponse
    return activeChat.sendMessageStream({message: parts}); 
  } catch (error) {
    throw new Error(handleGeminiError(error));
  }
};

export const getWordExplanationFromGemini = async (word: string, sourceLanguage: 'English' | 'Khmer'): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }

  let prompt = "";
  if (sourceLanguage === 'English') {
    prompt = `Explain the English word/term "${word}" in simple terms. Provide the explanation PRIMARILY IN KHMER. If you also provide an English explanation, clearly separate it (e.g., start it with "English Explanation:") or preface it. If it's a technical term, the explanations should be slightly technical but understandable. Be concise. Do not use markdown.`;
  } else { // sourceLanguage is 'Khmer'
    prompt = `Explain the Khmer word/term "${word}" in simple terms, IN KHMER. If it's a technical term, the explanation should be slightly technical but understandable. Be concise. Do not use markdown.`;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL_TEXT,
      contents: prompt,
    });
    return (response.text || '').trim();
  } catch (error) {
    const userFriendlyErrorMessage = handleGeminiError(error);
    throw new Error(`Failed to get explanation for "${word}": ${userFriendlyErrorMessage}`);
  }
};

export const generateImageEnhancementPromptFromImageAndText = async (
  base64Image: string,
  mimeType: string,
  userInstructions: string
): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };

  const textPart = {
    text: `User instructions for enhancement: "${userInstructions || 'Re-create this image clearly and in high quality.'}"`,
  };
  
  const systemInstruction = `You are an AI expert at interpreting potentially vague images and user requests to generate clear, detailed textual prompts for an advanced image generation model (like Imagen 3).
The user will provide a base image (which might be blurry or low quality) and textual instructions (e.g., 'make the face clearer', 'enhance details', 'recreate this in high quality').
Your task is to:
1. Analyze the visual content of the base image.
2. Understand the user's enhancement request from their text.
3. Synthesize this information into a single, rich, descriptive textual prompt. This prompt will be used by another AI to generate a *new* image that is a clear, high-quality, and visually faithful re-imagination of the subject matter in the original vague image, according to the user's instructions.
4. If a face is present or implied in the vague image and the user requests focus on it, ensure the generated prompt describes a clear, well-defined face with appropriate details.
5. The prompt should be suitable for creating a photographic or artistically clear rendition.
Output *ONLY* this textual prompt. Do not include any other commentary, conversational text, or markdown formatting around the prompt itself.`;


  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL_MULTIMODAL, // Use multimodal for image input
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    let generatedPrompt = (response.text || '').trim();
    // Clean potential markdown fences if any (though system instruction tries to prevent it)
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = generatedPrompt.match(fenceRegex);
    if (match && match[2]) {
      generatedPrompt = (match[2] || '').trim();
    }
    if (!generatedPrompt) {
        throw new Error("AI failed to generate an enhancement prompt. The response was empty.");
    }
    return generatedPrompt;
  } catch (error) {
    throw new Error(`Failed to generate image enhancement prompt: ${handleGeminiError(error)}`);
  }
};

export const generatePatchSpecificEnhancementPrompt = async (
  patchBase64: string,
  patchMimeType: string,
  mainUserInstructions: string
): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }

  const imagePart = {
    inlineData: {
      mimeType: patchMimeType,
      data: patchBase64,
    },
  };

  const textPart = {
    text: `Main user instructions for overall image enhancement (for context): "${mainUserInstructions || 'Re-create the original image clearly and in high quality.'}"
This specific request is for enhancing ONLY the small image patch provided. Focus on generating a prompt for this patch.`,
  };

  const systemInstruction = `You are an AI Art Director specializing in micro-enhancements. You will receive a small, potentially blurry image patch and general user instructions that were intended for enhancing a larger original image.
Your task is to generate a highly specific and descriptive textual prompt. This prompt will be used by an advanced image generation model (like Imagen 3) to re-create *only this small patch* with maximum clarity, detail, and quality, as if it were a perfectly focused, high-resolution section of the user's desired final image.
The style of the enhanced patch should be consistent with the user's main instructions for the overall image.
If the user's main instructions mention faces (e.g., 'make the face clearer') AND this patch appears to contain part of a face or a key facial feature, your generated prompt must heavily emphasize achieving a clear, well-defined, and realistic facial feature for this patch.
Consider the context of the patch within the (unseen by you now) larger image, based on the main user instructions.
Output *ONLY* the textual prompt for generating this specific patch. Do not include any other commentary, conversational text, or markdown formatting around the prompt itself.
Example for a blurry eye patch with main instructions "photorealistic portrait, enhance face": "Ultra-sharp close-up of a human eye, clear iris details, realistic reflections, photorealistic."
Example for a blurry tree bark patch with main instructions "fantasy landscape": "Highly detailed, textured tree bark, elven forest, mystical lighting, sharp focus."`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL_MULTIMODAL,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: systemInstruction,
      }
    });

    let generatedPatchPrompt = (response.text || '').trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = generatedPatchPrompt.match(fenceRegex);
    if (match && match[2]) {
      generatedPatchPrompt = (match[2] || '').trim();
    }
    if (!generatedPatchPrompt) {
        throw new Error("AI failed to generate a patch-specific enhancement prompt. The response was empty.");
    }
    return generatedPatchPrompt;
  } catch (error) {
    throw new Error(`Failed to generate patch-specific enhancement prompt: ${handleGeminiError(error)}`);
  }
};


// This function can be used by ImageEnhancerPage directly if needed, or ImageEnhancerPage can call ai.models.generateImages itself
// For consistency, if we make an explicit export for generateImages, it would look like this:
export const generateImageWithImagen = async (prompt: string) => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }
  try {
    const response = await ai.models.generateImages({
        model: GEMINI_API_MODEL_IMAGE_GENERATION,
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/png' }, // Assuming PNG output
    });
    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
        return response.generatedImages[0].image.imageBytes; // base64 encoded string
    } else {
        throw new Error("AI did not return any images.");
    }
  } catch (error) {
    throw new Error(`Failed to generate image: ${handleGeminiError(error)}`);
  }
};


// Make sure this export exists if it's used elsewhere, or ImageEnhancerPage uses GEMINI_API_MODEL_IMAGE_GENERATION directly
export { GEMINI_API_MODEL_IMAGE_GENERATION }; 
export { ai as geminiAiInstance }; // Exporting the ai instance for direct use if needed.
