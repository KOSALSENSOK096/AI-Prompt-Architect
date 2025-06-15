import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert'; 
import { AlertMessage } from '../types'; 
import UserIcon from './icons/UserIcon'; // New Icon
import PhoneIcon from './icons/PhoneIcon'; // New Icon

interface AuthFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthFormModal: React.FC<AuthFormModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const { login, register } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setUsername('');
      setPhoneNumber('');
      setAlert(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);
    try {
      if (mode === 'login') {
        await login(username, phoneNumber);
      } else {
        await register(username, phoneNumber);
      }
      onClose();
    } catch (error: any) {
      setAlert({ id: Date.now(), type: 'error', message: error.message || `Failed to ${mode}. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  const dismissAlert = () => {
    setAlert(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-800/75 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300 ease-out animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-out scale-100 animate-slideUp relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-light to-primary-dark"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-primary-dark/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 dark:bg-primary-dark/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark dark:from-primary-light dark:to-primary bg-clip-text text-transparent">
              {mode === 'login' ? 'Welcome Back' : 'Join Us'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {alert && <div className="mb-6"><Alert alert={alert} onDismiss={dismissAlert} /></div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors duration-200">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                    <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder-slate-400 transition-all duration-200 text-slate-600 placeholder-slate-400"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors duration-200">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                    <PhoneIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder-slate-400 transition-all duration-200 text-slate-600 placeholder-slate-400"
                    placeholder="Enter your phone number"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
                  Used for simulated account identification
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group overflow-hidden rounded-xl bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-primary disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:bg-white/10"></div>
              <div className="relative px-4 py-3">
                {isLoading ? (
                  <LoadingSpinner size="sm" color="text-white" />
                ) : (
                  <span className="text-sm font-semibold text-white dark:text-slate-900">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </span>
                )}
              </div>
            </button>
          </form>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="mt-4 w-full text-center text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors duration-200"
          >
            {mode === 'login' ? 'Create one now' : 'Sign in instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthFormModal;