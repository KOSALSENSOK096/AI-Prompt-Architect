
import React, { useState, useRef, useEffect } from 'react';
import BookOpenIcon from './icons/BookOpenIcon'; 
import LightbulbIcon from './icons/LightbulbIcon'; // For visual cue in popover

interface TechnicalTermProps {
  term: string;
  explanation: string;
  explanationKm?: string;
}

const TechnicalTerm: React.FC<TechnicalTermProps> = ({ term, explanation, explanationKm }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const termRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: string; left: string; transform: string }>({ top: '100%', left: '50%', transform: 'translateX(-50%)' });


  const togglePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopoverOpen(prev => !prev);
  };

  useEffect(() => {
    if (isPopoverOpen && termRef.current && popoverRef.current) {
      const termRect = termRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = termRect.bottom + window.scrollY + 8; // Below the term
      let left = termRect.left + window.scrollX + termRect.width / 2; // Centered
      let transform = 'translateX(-50%)';

      // Adjust if popover goes off-screen
      if (left + popoverRect.width / 2 > viewportWidth - 16) { // Off right
        left = viewportWidth - 16 - popoverRect.width / 2;
      }
      if (left - popoverRect.width / 2 < 16) { // Off left
        left = 16 + popoverRect.width / 2;
      }
      if (top + popoverRect.height > viewportHeight + window.scrollY - 16) { // Off bottom
        top = termRect.top + window.scrollY - popoverRect.height - 8; // Place above
      }
       if (top < window.scrollY + 16) { // Off top when placed above
        top = window.scrollY + 16;
      }


      setPopoverPosition({ 
        top: `${top}px`, 
        left: `${left}px`, 
        transform 
      });
    }
  }, [isPopoverOpen, term, explanation, explanationKm]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPopoverOpen &&
        termRef.current && !termRef.current.contains(event.target as Node) &&
        popoverRef.current && !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const displayExplanation = explanationKm || explanation;
  const displayLangClass = explanationKm ? 'font-kantumruy' : '';

  return (
    <span className="relative inline-block">
      <button
        ref={termRef}
        onClick={togglePopover}
        className="inline-flex items-center text-primary dark:text-primary-light font-medium border-b border-dashed border-primary dark:border-primary-light hover:border-solid hover:text-primary-dark dark:hover:text-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark rounded-sm transition-colors cursor-pointer px-0.5 py-0 align-baseline bg-transparent"
        aria-expanded={isPopoverOpen}
        aria-describedby={isPopoverOpen ? `tooltip-technical-term-${term.replace(/\s+/g, '-')}` : undefined}
        title={`Explain: ${term}`}
      >
        {term}
        <BookOpenIcon className="w-3 h-3 ml-0.5 opacity-80 group-hover:opacity-100" />
      </button>
      {isPopoverOpen && (
        <div
          ref={popoverRef}
          id={`tooltip-technical-term-${term.replace(/\s+/g, '-')}`}
          role="tooltip"
          style={{ position: 'fixed', top: popoverPosition.top, left: popoverPosition.left, transform: popoverPosition.transform }}
          className="z-30 w-64 p-3.5 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 animate-fadeInUp transition-colors duration-300"
        >
          <div className="flex items-start mb-1.5">
            <LightbulbIcon className="w-4 h-4 mr-1.5 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <strong className={`block text-sm text-primary dark:text-primary-light ${explanationKm ? 'font-kantumruy' : ''}`}>{term}</strong>
          </div>
          <p className={`leading-relaxed ${displayLangClass}`}>{displayExplanation}</p>
          {explanationKm && explanation !== displayExplanation && ( // Show English explanation if Khmer one was primary
            <>
              <hr className="my-1.5 border-slate-200 dark:border-slate-600" />
              <p className="leading-relaxed text-slate-500 dark:text-slate-400 text-[0.7rem]">{explanation}</p>
            </>
          )}
           <button 
            onClick={(e) => { e.stopPropagation(); setIsPopoverOpen(false); }}
            className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-0.5 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-500"
            aria-label="Close explanation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </span>
  );
};

export default TechnicalTerm;
