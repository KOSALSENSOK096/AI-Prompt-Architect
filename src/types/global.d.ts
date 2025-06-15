/// <reference types="react" />

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {}; 