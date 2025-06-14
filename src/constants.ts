export const GEMINI_API_MODEL_TEXT = 'gemini-pro';
export const GEMINI_API_MODEL_MULTIMODAL = 'gemini-pro-vision';
export const GEMINI_API_MODEL_IMAGE_GENERATION = 'imagen-3.0-generate-002';

export const APP_NAME = 'AI Prompt Architect';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Prompt Generator', path: '/prompt-generator' },
  { name: 'Premium', path: '/premium' }
];

export const PROMPT_QUESTIONS = [
  {
    id: 'topic',
    label: 'Topic/Subject',
    placeholder: 'What is the main topic or subject you want to create a prompt for?'
  },
  {
    id: 'details',
    label: 'Further Details/Context',
    placeholder: 'Add any specific details, context, or background information'
  },
  {
    id: 'purpose',
    label: 'Main Message/Purpose',
    placeholder: 'What is the main goal or message you want to convey?'
  },
  {
    id: 'aiTask',
    label: 'Desired AI Task',
    placeholder: 'What do you want the AI to do? (e.g., explain, analyze, generate, etc.)'
  },
  {
    id: 'targetAI',
    label: 'Target AI Model (Optional)',
    placeholder: 'Which AI model will you use? (e.g., ChatGPT, Gemini, Claude)'
  }
];

export const TECHNICAL_TERMS = {
  'prompt engineering': 'The practice of designing and optimizing input prompts to get better outputs from AI models.',
  'LLM': 'Large Language Model - an AI model trained on vast amounts of text data.',
  'context window': 'The amount of text an AI model can process at once.',
  'token': 'The basic unit of text that language models process, usually parts of words.',
  'temperature': 'A parameter that controls how random or focused the AI\'s responses are.',
  'chain-of-thought': 'A prompting technique that asks the AI to show its reasoning step by step.',
  'few-shot learning': 'Teaching the AI with a few examples in the prompt.',
  'zero-shot learning': 'Asking the AI to perform a task without any examples.',
  'prompt template': 'A reusable structure for creating consistent prompts.',
  'semantic search': 'Finding information based on meaning rather than exact matches.'
}; 