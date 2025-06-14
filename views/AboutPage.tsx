
import React from 'react';
import { APP_NAME, GEMINI_API_MODEL_TEXT } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">About {APP_NAME}</h1>
      
      <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-2xl rounded-lg p-8 space-y-6 transition-colors duration-300">
        <p className="text-lg text-slate-700 dark:text-slate-300">
          {APP_NAME} is a specialized tool designed to empower users in their interactions with artificial intelligence. 
          In an era where AI is becoming increasingly integrated into our daily lives—from work and study to business and creative pursuits—the quality of our prompts dictates the quality of AI's output.
        </p>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Our mission is to demystify the art of prompt engineering. We provide a simple, intuitive interface where users can define their objectives by answering a few key questions. 
          Behind the scenes, we leverage the power of Google's Gemini API to analyze these inputs and construct a well-crafted, effective prompt tailored to the user's needs.
        </p>
        
        <div className="pt-4">
          <h2 className="text-2xl font-semibold text-primary dark:text-primary-light mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
            <li><strong>Define Your Goal:</strong> Answer a series of guided questions about your topic, desired outcome, and target AI (if known). You can provide answers in English or Khmer.</li>
            <li><strong>AI-Powered Crafting:</strong> Our system sends your inputs to the Gemini API.</li>
            <li><strong>Receive Your Prompt:</strong> Gemini generates an optimized prompt designed for clarity and effectiveness.</li>
            <li><strong>Achieve Results:</strong> Copy the generated prompt and use it with your preferred AI model (like ChatGPT, Gemini itself, Claude, etc.) to get better, more relevant results.</li>
          </ol>
        </div>

        <div className="pt-4">
          <h2 className="text-2xl font-semibold text-primary dark:text-primary-light mb-4">Membership & Technology</h2>
          <p className="text-slate-600 dark:text-slate-400">
            This application demonstrates a concept for a membership-based platform. Currently, user registration and login (using username and phone number) are simulated using your browser's local storage for persistence on your device. No data is sent to a central server for authentication.
          </p>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            The core prompt generation capability is powered by the <strong className="text-slate-700 dark:text-slate-200">Google Gemini API</strong> (specifically, the `{GEMINI_API_MODEL_TEXT || 'gemini-2.5-flash-preview-04-17'}` model). An API key for the Gemini API (set via the `API_KEY` environment variable) is required for this feature to function.
          </p>
        </div>

        <p className="text-lg text-slate-700 dark:text-slate-300 pt-4">
          Whether you're a student, professional, entrepreneur, or creative, {APP_NAME} aims to be your go-to assistant for unlocking the full potential of AI.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;