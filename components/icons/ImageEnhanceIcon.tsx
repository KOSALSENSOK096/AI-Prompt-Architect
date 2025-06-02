import React from 'react';

interface ImageEnhanceIconProps {
  className?: string;
}

const ImageEnhanceIcon: React.FC<ImageEnhanceIconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12.75 8.25H12.758V8.258H12.75V8.25Z" // Dot for image placeholder
    />
    <rect x="2.25" y="4.5" width="19.5" height="15" rx="1.5" ry="1.5" strokeWidth="1.5" opacity="0.4"/>

    {/* Sparkle elements */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 5.5l1.5 1.5M17.5 8.5l1.5-1.5" /> {/* Main part of sparkle */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.25 4.75l.5 .5M18.25 8.75l.5-.5" /> {/* Smaller parts of sparkle */}
     <path strokeLinecap="round" strokeLinejoin="round" d="M16.25 7l.5 .5M19.25 7l-.5 .5" />
  </svg>
);
export default ImageEnhanceIcon;