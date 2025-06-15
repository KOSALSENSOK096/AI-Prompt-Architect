export const GEMINI_API_KEY = 'AIzaSyAldNoXtHy331OHk88wcnTZ9JxQvh1xy6M';

export const API_CONFIG = {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    modelName: 'gemini-pro',
    visionModelName: 'gemini-pro-vision',
};

export const SPEECH_RECOGNITION_CONFIG = {
    isSupported: typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    defaultLang: 'km-KH',
    alternativeLang: 'en-US'
}; 