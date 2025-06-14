
import React from 'react';

const HeaderIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L6.75 6.75M17.25 10.5L6.75 10.5M14.25 14.25L6.75 14.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3h16.5v18H3.75V3z" opacity="0.3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3v18" fill="currentColor" opacity="0.1" />
  </svg>
);
export default HeaderIcon;