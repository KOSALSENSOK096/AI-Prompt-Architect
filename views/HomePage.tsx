
import React from 'react';
import { Link } from 'react-router-dom';
import SparklesIcon from '../components/icons/SparklesIcon';

const HomePage: React.FC = () => {
  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Unlock the Power of AI with <span className="block sm:inline">Perfect Prompts</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-primary-light dark:text-teal-200 opacity-90">
            AI Prompt Architect helps you design effective prompts for any AI model, transforming your ideas into reality for work, study, or business.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/prompt-generator"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary dark:text-primary-dark bg-white dark:bg-slate-100 hover:bg-slate-50 dark:hover:bg-slate-200 shadow-lg transform hover:scale-105 transition-transform"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Start Crafting Prompts
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-20 shadow-lg transform hover:scale-105 transition-transform"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-100 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Why Choose AI Prompt Architect?</h2>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Streamline your interaction with AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg dark:shadow-2xl text-center transition-colors duration-300">
              <div className="flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary dark:text-primary-light"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Intelligent Guidance</h3>
              <p className="text-slate-600 dark:text-slate-300">Answer simple questions, and let our Gemini-powered tool construct optimized prompts for you.</p>
            </div>
            <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg dark:shadow-2xl text-center transition-colors duration-300">
              <div className="flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary dark:text-primary-light"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Versatile Use Cases</h3>
              <p className="text-slate-600 dark:text-slate-300">Perfect for work projects, academic research, business strategies, or creative endeavors.</p>
            </div>
            <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg dark:shadow-2xl text-center transition-colors duration-300">
             <div className="flex justify-center items-center mb-4">
               <SparklesIcon className="w-12 h-12 text-primary dark:text-primary-light" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Gemini Powered</h3>
              <p className="text-slate-600 dark:text-slate-300">Leverages the advanced capabilities of Google's Gemini API for high-quality prompt generation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;