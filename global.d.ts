
// global.d.ts

// This interface definition is moved from views/PremiumPage.tsx
// It defines the structure for the Speech Recognition API instances.
interface CustomSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void; // For more specific typing, use SpeechRecognitionEvent
  onerror: (event: any) => void;  // For more specific typing, use SpeechRecognitionErrorEvent
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// Augment the global Window interface to include these properties.
interface Window {
  SpeechRecognition?: { new(): CustomSpeechRecognition; };
  webkitSpeechRecognition?: { new(): CustomSpeechRecognition; };
}