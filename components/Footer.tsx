
import React from 'react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 dark:bg-slate-900 text-slate-300 dark:text-slate-400 py-8 mt-auto border-t border-slate-700 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="text-sm mt-1">Crafting intelligent prompts, effortlessly.</p>
        <p className="text-xs mt-4 text-slate-500 dark:text-slate-500">
          User data (username, phone number) is stored locally in your browser for demonstration purposes only and is not transmitted to any server. This is a simulated authentication system.
        </p>
      </div>
    </footer>
  );
};

export default Footer;