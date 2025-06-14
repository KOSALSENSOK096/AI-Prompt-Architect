import React from 'react';

interface PencilSquareIconProps {
  className?: string;
}

const PencilSquareIcon: React.FC<PencilSquareIconProps> = ({ className = "w-4 h-4" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 19.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M5.828 10.172a.5.5 0 00-.707 0l-2.293 2.293a.5.5 0 000 .707l2.293 2.293a.5.5 0 00.707 0l2.293-2.293a.5.5 0 000-.707l-2.293-2.293z" />
    </svg>
  );
};

export default PencilSquareIcon;
