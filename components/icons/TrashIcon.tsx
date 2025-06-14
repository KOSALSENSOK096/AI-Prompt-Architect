
import React from 'react';

interface TrashIconProps {
  className?: string;
}

const TrashIcon: React.FC<TrashIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.462 3.032 1.214L9.25 7.168a45.056 45.056 0 013.032-1.214m0 0c.89-.231 1.78-.442 2.67-.632M11.255 7.168a45.066 45.066 0 011.745-.464m0 0c1.153 0 2.243.462 3.032 1.214L14.75 7.168a45.066 45.066 0 011.745-.464m0 0l.745.101M4.772 5.79m14.456 0l-1.05-1.05M4.772 5.79L3.722 4.74m5.916 15.408a2.25 2.25 0 01-2.244-2.077L4.772 5.79m0 0L3.722 4.74" 
      />
    </svg>
  );
};

export default TrashIcon;