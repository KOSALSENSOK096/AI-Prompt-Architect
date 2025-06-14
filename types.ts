

export interface User {
  id: string;
  username: string;
  phoneNumber: string; // Stored for simulation purposes
}

export interface PromptQuestion {
  id:string;
  englishLabel: string;
  khmerLabel: string;
  placeholderEn: string;
  placeholderKm: string;
}

export interface PromptGenerationFormState {
  topic: string;
  details: string;
  purpose: string;
  aiTask: string;
  targetAI: string;
}

export enum Language {
  EN = 'EN',
  KM = 'KM',
}

export interface NavLink {
  path: string;
  label: string;
  authRequired?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AlertMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

// --- Grounding and Citation Types (Aligned with @google/genai SDK) ---

export interface WebContent {
  uri?: string;
  title?: string;
}

export interface RetrievedContextContent {
  uri?: string;
  title?: string;
}

// GroundingChunk as defined by the SDK
export interface GroundingChunk {
  web?: WebContent;
  retrievedContext?: RetrievedContextContent;
}

// For GroundingMetadata.groundingAttributions
// Simplified SDK Content/Part for now. Actual SDK types are more complex.
export interface SDKContentPart {
  text?: string;
  // Other part types like inlineData, fileData could be added if needed
}
export interface SDKContent {
  parts: SDKContentPart[];
  role?: string;
}
export interface GroundingAttribution {
  sourceId?: string; 
  content?: SDKContent;
}

// For GroundingMetadata.citations
export interface CitationSource {
  startIndex?: number;
  endIndex?: number;
  uri?: string;
  license?: string;
}
export interface CitationMetadata {
  citationSources?: CitationSource[];
}

// For GroundingMetadata.sources
export interface GroundingSource {
    id?: string;
    web?: WebContent;
    retrievedContext?: RetrievedContextContent;
}

// GroundingMetadata aligned with SDK
export interface GroundingMetadata {
  webSearchQueries?: string[];
  groundingAttributions?: GroundingAttribution[];
  groundingChunks?: GroundingChunk[]; // Uses the updated GroundingChunk
  citations?: CitationMetadata;
  sources?: GroundingSource[];
}
// --- End Grounding and Citation Types ---


export interface Candidate { // This is a local type, ensure it uses local GroundingMetadata
    groundingMetadata?: GroundingMetadata; // Will use the updated GroundingMetadata
    // Other candidate properties
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  image?: string; // base64 encoded image
  imageMimeType?: string;
  timestamp: Date;
  isLoading?: boolean; // For AI responses that are streaming or loading
  groundingMetadata?: GroundingMetadata; // Will use the updated GroundingMetadata
}

export type TranslationSupportedLanguage = 'English' | 'Khmer' | 'French' | 'Japanese' | 'Chinese' | 'Spanish';

export const LANGUAGE_OPTIONS: Record<TranslationSupportedLanguage, string> = {
  English: 'en',
  Khmer: 'km',
  French: 'fr',
  Japanese: 'ja',
  Chinese: 'zh',
  Spanish: 'es',
};

// --- UI Designer Types ---
export type PhoneOS = 'Android' | 'iOS' | 'Windows' | 'Generic';

export type UIElementType = 'Button' | 'TextInput' | 'ImagePlaceholder' | 'Header' | 'TextBlock';

export interface UIElementProperty {
  text?: string;
  placeholder?: string;
  // src?: string; // For ImagePlaceholder, if we want to allow setting a URL
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  alignment?: 'left' | 'center' | 'right';
}

export interface UIScreenElement {
  id: string;
  type: UIElementType;
  properties: UIElementProperty;
}

// New: TechnicalTerm interface for word explanations
export interface TechnicalTerm {
  term: string;
  explanation: string;
  explanationKm?: string; // Added for Khmer explanations
  aliases?: string[]; // Optional aliases for matching
}