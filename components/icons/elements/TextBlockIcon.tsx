
import React from 'react';

const TextBlockIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 9.75h16.5M3.75 12.75h16.5M3.75 15.75h16.5" />
  </svg>
);
export default TextBlockIcon;