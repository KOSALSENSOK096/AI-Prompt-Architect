
import React from 'react';

const ButtonIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H3m12.75-8.25L11.25 12l4.5 4.5M3.75 12H21m-2.25-4.5a2.25 2.25 0 00-2.25-2.25H8.25a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h8.25a2.25 2.25 0 002.25-2.25v-9z" />
    <rect x="7" y="10" width="10" height="4" rx="1" ry="1" fill="currentColor" opacity="0.3" />
  </svg>
);
export default ButtonIcon;