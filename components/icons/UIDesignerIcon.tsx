
import React from 'react';

interface UIDesignerIconProps {
  className?: string;
}

const UIDesignerIcon: React.FC<UIDesignerIconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="7" y="2" width="10" height="20" rx="2" ry="2"></rect>
      <path d="M12 18h.01"></path>
      <path d="M17 6H7"></path>
      <path d="M17 9H7"></path>
      <path d="M17 12H7"></path>
      <path d="M17 15H7"></path>
    </svg>
  );
};

export default UIDesignerIcon;