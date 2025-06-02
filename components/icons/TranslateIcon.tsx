
import React from 'react';

interface TranslateIconProps {
  className?: string;
}

const TranslateIcon: React.FC<TranslateIconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 5h7M9 3v2c0 4.418-2.239 8-5 8" />
      <path d="M5 15h7M12 15c1.657 0 3-1.79 3-4s-1.343-4-3-4S9 7.79 9 11s1.343 4 3 4zm0 0v2c0 4.418 2.239 8 5 8M14 5h7M16 3v2c0 4.418 2.239 8 5 8" />
    </svg>
  );
};

export default TranslateIcon;