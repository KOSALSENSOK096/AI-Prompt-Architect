
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme'; // Import useTheme
import { NAV_LINKS, APP_NAME } from '../constants';
import LogoIcon from './icons/LogoIcon';
import AuthFormModal from './AuthFormModal';

// Icons for theme toggle
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);


const Navbar: React.FC = () => {
  const { currentUser, logout, isLoading: authIsLoading } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use theme context
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const filteredNavLinks = NAV_LINKS.filter(link => !link.authRequired || (link.authRequired && currentUser));

  return (
    <>
      <nav className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <LogoIcon className="h-8 w-auto text-primary dark:text-primary-light group-hover:text-primary-dark dark:group-hover:text-primary transition-colors" />
                <span className="ml-2 text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">{APP_NAME}</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1 lg:space-x-2">
                {filteredNavLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center
                      ${location.pathname === link.path 
                        ? 'bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                  >
                    {link.icon && <link.icon className="w-4 h-4 mr-1.5 opacity-70 dark:opacity-80" />}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
               <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>
              {authIsLoading ? (
                 <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-20 rounded-md"></div>
              ) : currentUser ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Hi, {currentUser.username}!</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-secondary hover:bg-secondary-dark dark:bg-secondary-dark dark:hover:bg-secondary transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-primary dark:text-primary-light hover:bg-primary-light dark:hover:bg-primary-dark hover:text-primary-dark dark:hover:text-white transition-colors border border-primary dark:border-primary-light"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:hover:bg-primary-light dark:text-slate-900 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 mr-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="bg-slate-100 dark:bg-slate-700 inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-primary"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-800" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center
                     ${location.pathname === link.path 
                        ? 'bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                  {link.icon && <link.icon className="w-5 h-5 mr-2 opacity-70 dark:opacity-80" />}
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
              {authIsLoading ? (
                 <div className="px-5"><div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-full rounded-md mb-2"></div></div>
              ) : currentUser ? (
                <div className="px-5">
                  <p className="text-base font-medium text-slate-800 dark:text-slate-100">Hi, {currentUser.username}!</p>
                  <button
                    onClick={handleLogout}
                    className="mt-1 block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-secondary hover:bg-secondary-dark dark:bg-secondary-dark dark:hover:bg-secondary transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-5 space-y-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary dark:text-primary-light hover:bg-primary-light dark:hover:bg-primary-dark hover:text-primary-dark dark:hover:text-white transition-colors border border-primary dark:border-primary-light"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-dark dark:hover:bg-primary-light dark:text-slate-900 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {isAuthModalOpen && (
        <AuthFormModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalMode}
        />
      )}
    </>
  );
};

export default Navbar;