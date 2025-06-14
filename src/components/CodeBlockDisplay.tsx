
import React, { useState } from 'react';
import { AlertMessage } from '../types';

interface CodeBlockDisplayProps {
  code: string;
  language?: string;
  onCopyNotify: (alert: AlertMessage) => void;
  onRunCode?: (code: string, language: string) => void; 
}

// --- Icons ---
const CopyIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.279 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);
// --- End Icons ---

const CodeBlockDisplay: React.FC<CodeBlockDisplayProps> = ({ code, language, onCopyNotify, onRunCode }) => {
  const [copied, setCopied] = useState(false);
  const normalizedLanguage = language?.toLowerCase() || 'plaintext';
  
  // Expanded list of languages for which the "Run Code" button might appear.
  // The actual decision to run via OneCompiler is in PremiumPage based on its slug mapping.
  const canRun = onRunCode && [
    'html', 'javascript', 'js', 'css', 
    'python', 'py', 
    'java', 
    'c', 'cpp', 'c++',
    'php', 
    'ruby', 
    'go', 
    'swift', 
    'kotlin', 
    'csharp', 'cs',
    'typescript', 'ts'
  ].includes(normalizedLanguage);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        onCopyNotify({ id: Date.now(), type: 'success', message: 'Code copied to clipboard!' });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        onCopyNotify({ id: Date.now(), type: 'error', message: 'Failed to copy code.' });
      });
  };

  const handleRunCode = () => {
    if (onRunCode) { // Check if onRunCode is provided, even if canRun is true (though canRun already checks this)
      onRunCode(code, normalizedLanguage);
    }
  };

  return (
    <div className="my-2 bg-slate-200 dark:bg-slate-800 rounded-md shadow-md overflow-hidden relative group">
      <div className="px-3 py-1 bg-slate-300 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-semibold flex justify-between items-center">
        <span>{language || 'code'}</span>
        <div className="flex space-x-1.5">
           {canRun && (
            <button
              onClick={handleRunCode}
              className="p-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-400/70 dark:hover:bg-slate-600/70 rounded text-slate-700 dark:text-slate-200 transition-colors duration-150"
              title="Run code with OneCompiler"
              aria-label="Run code snippet with OneCompiler"
            >
              <PlayIcon className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleCopyCode}
            className="p-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-400/70 dark:hover:bg-slate-600/70 rounded text-slate-700 dark:text-slate-200 transition-colors duration-150"
            title={copied ? "Copied!" : "Copy code"}
            aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5 text-green-500 dark:text-green-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <pre className="p-3 text-sm text-slate-800 dark:text-slate-100 overflow-x-auto">
        <code className={`language-${normalizedLanguage}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlockDisplay;