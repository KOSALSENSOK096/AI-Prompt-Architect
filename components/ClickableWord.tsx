
import React, { useRef } from 'react';

interface ClickableWordProps {
  word: string;
  onWordClick: (word: string, element: HTMLElement) => void;
}

const ClickableWord: React.FC<ClickableWordProps> = ({ word, onWordClick }) => {
  const wordRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (wordRef.current) {
      // Pass the original word for display, but the actual lookup might use a cleaned version
      // The 'word' prop here is the display version (potentially with punctuation)
      onWordClick(word, wordRef.current); 
    }
  };

  return (
    <button
      ref={wordRef}
      onClick={handleClick}
      type="button"
      className="inline underline decoration-dotted decoration-slate-400 dark:decoration-slate-500 hover:decoration-solid hover:text-primary dark:hover:text-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark rounded-sm transition-colors cursor-pointer mx-px px-0.5 py-0 align-baseline bg-transparent border-none clickable-word-button" // Added class for popover outside click
      title={`Explain: ${word}`}
    >
      {word}
    </button>
  );
};

export default ClickableWord;
