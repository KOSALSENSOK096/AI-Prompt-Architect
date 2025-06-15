import { PromptQuestion, NavLink, TechnicalTerm } from './types'; // Added TechnicalTerm
import TranslateIcon from './components/icons/TranslateIcon';

export const APP_NAME = "AI Prompt Architect";

export const NAV_LINKS: NavLink[] = [
  { path: '/', label: 'Home' },
  { path: '/prompt-generator', label: 'Prompt Tool' },
  { path: '/translate-kh', label: 'Translate KH', icon: TranslateIcon },
  { path: '/premium', label: 'AI Khmer Chat', authRequired: true },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export const PROMPT_QUESTIONS: PromptQuestion[] = [
  {
    id: 'topic',
    englishLabel: 'What topic do you want to generate a prompt for?',
    khmerLabel: 'តើអ្នកចង់បង្កើតប្រធានបទអ្វី?',
    placeholderEn: 'e.g., sustainable energy solutions',
    placeholderKm: 'ឧ៖ ដំណោះស្រាយថាមពលប្រកបដោយនិរន្តរភាព',
  },
  {
    id: 'details',
    englishLabel: 'Describe the topic or subject in more detail.',
    khmerLabel: 'តើអ្វីទៅ? (បរិយាយបន្ថែម)',
    placeholderEn: 'e.g., focus on solar and wind power for urban areas',
    placeholderKm: 'ឧ៖ ផ្តោតលើថាមពLពន្លឺព្រះអាទិត្យ និងខ្យល់សម្រាប់តំបន់ទីក្រុង',
  },
  {
    id: 'purpose',
    englishLabel: 'What is the main message or key purpose?',
    khmerLabel: 'សារសំខាន់ ឬគោលបំណង',
    placeholderEn: 'e.g., to inform about benefits and challenges',
    placeholderKm: 'ឧ៖ ដើម្បីជូនដំណឹងអំពីអត្ថប្រយោជន៍ និងបញ្ហាប្រឈម',
  },
  {
    id: 'aiTask',
    englishLabel: 'What specific task should the AI perform?',
    khmerLabel: 'តើអ្នកចង់អោយ AI ធ្វើអ្វី?',
    placeholderEn: 'e.g., write a blog post, summarize, brainstorm ideas',
    placeholderKm: 'ឧ៖ សរសេរប្លក់ ប្រមូលសង្ខេប បង្កើតគំនិត',
  },
  {
    id: 'targetAI',
    englishLabel: 'Which AI model are you planning to use? (Optional)',
    khmerLabel: 'តើអ្នកកំពុងប្រើ AI អ្វី? (ChatGPT, Gemini, Deepseek, ฯลฯ) (ស្រេចចិត្ត)',
    placeholderEn: 'e.g., ChatGPT, Gemini, Claude',
    placeholderKm: 'ឧ៖ ChatGPT, Gemini, Claude',
  },
];

export const GEMINI_API_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_API_MODEL_MULTIMODAL = 'gemini-2.5-flash-preview-04-17'; 
export const GEMINI_API_MODEL_IMAGE_GENERATION = 'imagen-3.0-generate-002';


// New: Technical Terms for explanations
export const TECHNICAL_TERMS: TechnicalTerm[] = [
  {
    term: "API",
    explanation: "Application Programming Interface. A set of rules and protocols that allows different software applications to communicate with each other. It defines the methods and data formats that applications can use to request and exchange information.",
    explanationKm: "ចំណុចប្រទាក់កម្មវិធីកម្មវិធី។ វិធីមួយសម្រាប់កម្មវិធីផ្សេងៗក្នុងការនិយាយคุយគ្នា។",
    aliases: ["api"]
  },
  {
    term: "LLM",
    explanation: "Large Language Model. An advanced AI model trained on vast amounts of text data to understand, generate, and manipulate human language. Examples include Gemini, GPT-3/4, etc.",
    explanationKm: "ម៉ូដែលភាសាធំ។ AI ដែលឆ្លាតវៃក្នុងការយល់ និងបង្កើតភាសាមនុស្ស។",
    aliases: ["llms", "large language model"]
  },
  {
    term: "JavaScript",
    explanation: "A high-level, often just-in-time compiled language that conforms to the ECMAScript specification. It is one of the core technologies of the World Wide Web, alongside HTML and CSS. It enables interactive web pages and is an essential part of web applications.",
    explanationKm: "ភាសាសរសេរកម្មវិធីសម្រាប់គេហទំព័រអន្តរកម្ម។",
    aliases: ["js"]
  },
  {
    term: "HTML",
    explanation: "HyperText Markup Language. The standard markup language for documents designed to be displayed in a web browser. It defines the meaning and structure of web content.",
    explanationKm: "ភាសាសម្គាល់សម្រាប់បង្កើតរចនាសម្ព័ន្ធគេហទំព័រ។",
    aliases: ["html5"]
  },
  {
    term: "CSS",
    explanation: "Cascading Style Sheets. A style sheet language used for describing the presentation of a document written in a markup language such as HTML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript.",
    explanationKm: "ភាសាស្តាយល៍សម្រាប់រចនាគេហទំព័រ។",
    aliases: ["css3"]
  },
  {
    term: "Algorithm",
    explanation: "A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer. Algorithms are fundamental to computer science and AI.",
    explanationKm: "សំណុំនៃច្បាប់សម្រាប់ដោះស្រាយបញ្ហា។",
    aliases: ["algorithms"]
  },
  {
    term: "Model",
    explanation: "In AI, a model is a computational representation learned from data, typically through a training process. It can make predictions or decisions based on new input data. For example, a language model or an image recognition model.",
    explanationKm: "តំណាងគណនាដែលរៀនពីទិន្នន័យសម្រាប់ធ្វើការសម្រេចចិត្ត។",
    aliases: ["ai model", "machine learning model"]
  },
  {
    term: "Token",
    explanation: "In the context of Large Language Models (LLMs), a token is a sequence of characters treated as a unit. This could be a word, part of a word (subword), or a punctuation mark. LLMs process and generate text based on tokens.",
    explanationKm: "ឯកតានៃអត្ថបទដែល LLM ប្រើ។",
    aliases: ["tokens"]
  },
  {
    term: "Framework",
    explanation: "A pre-written set of code and guidelines that provides a standard way to build and deploy applications. Examples include React, Angular, Vue.js for frontend, or Express.js for backend.",
    explanationKm: "រចនាសម្ព័ន្ធមូលដ្ឋានសម្រាប់បង្កើតកម្មវិធី។",
    aliases: ["frameworks"]
  },
  {
    term: "Syntax Highlighting",
    explanation: "A feature of text editors that are used for programming, scripting, or markup languages, such as HTML. The feature displays text, especially source code, in different colors and fonts according to the category of terms.",
    explanationKm: "ការបង្ហាញកូដពណ៌ដើម្បីងាយស្រួលអាន។",
    aliases: ["syntax-highlighting"]
  },
  {
    term: "IDE",
    explanation: "Integrated Development Environment. A software application that provides comprehensive facilities to computer programmers for software development. An IDE normally consists of at least a source code editor, build automation tools, and a debugger.",
    explanationKm: "បរិស្ថានអភិវឌ្ឍន៍រួមបញ្ចូលគ្នា។ កម្មវិធីសម្រាប់អ្នកសរសេរកូដ។",
    aliases: ["integrated development environment"]
  }
];