
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
    <div className="fixed inset-0 bg-slate-800 bg-opacity-75 dark:bg-black dark:bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out animate-fadeInUp">
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {mode === 'login' ? 'Login' : 'Register'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {alert && <div className="mb-4"><Alert alert={alert} onDismiss={dismissAlert} /></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:text-sm"
                placeholder="your_username"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="tel" 
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:text-sm"
                placeholder="e.g., 0123456789"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Used for simulated account identification.</p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-primary disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors duration-150"
          >
            {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors"
          >
            {mode === 'login' ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthFormModal;