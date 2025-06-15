
import React from 'react';
import { AlertMessage } from '../types';

interface AlertProps {
  alert: AlertMessage;
  onDismiss: (id: number) => void;
}

const Alert: React.FC<AlertProps> = ({ alert, onDismiss }) => {
  const baseClasses = "p-4 rounded-md shadow-lg flex items-start transition-colors duration-300";
  const typeClasses = {
    success: "bg-green-50 dark:bg-green-800 dark:bg-opacity-30 text-green-700 dark:text-green-300",
    error: "bg-red-50 dark:bg-red-800 dark:bg-opacity-30 text-red-700 dark:text-red-300",
    info: "bg-blue-50 dark:bg-blue-800 dark:bg-opacity-30 text-blue-700 dark:text-blue-300",
  };
  
  const iconColorClasses = {
    success: "text-green-500 dark:text-green-400",
    error: "text-red-500 dark:text-red-400",
    info: "text-blue-500 dark:text-blue-400",
  }

  const Icon = () => {
    const iconClass = `w-6 h-6 mr-3 ${iconColorClasses[alert.type]}`;
    if (alert.type === 'success') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    if (alert.type === 'error') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
  }

  const titleClasses = {
    success: "text-green-800 dark:text-green-200",
    error: "text-red-800 dark:text-red-200",
    info: "text-blue-800 dark:text-blue-200",
  }
  const messageTextClasses = {
     success: "text-green-700 dark:text-green-300",
    error: "text-red-700 dark:text-red-300",
    info: "text-blue-700 dark:text-blue-300",
  }

  return (
    <div className={`${baseClasses} ${typeClasses[alert.type]}`}>
      <Icon />
      <div className="flex-1">
        <p className={`font-medium ${titleClasses[alert.type]}`}>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</p>
        <p className={`text-sm ${messageTextClasses[alert.type]}`}>{alert.message}</p>
      </div>
      <button 
        onClick={() => onDismiss(alert.id)} 
        className={`ml-4 p-1 rounded-md hover:bg-opacity-20 dark:hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-current ${iconColorClasses[alert.type]}`}
        aria-label="Dismiss alert"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default Alert;