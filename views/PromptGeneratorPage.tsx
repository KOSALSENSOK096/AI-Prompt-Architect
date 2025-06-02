
import React, { useState, useEffect } from 'react';
import { PROMPT_QUESTIONS } from '../constants';
import { PromptGenerationFormState, Language, AlertMessage } from '../types';
import { generatePromptWithGemini, isGeminiApiKeyAvailable } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SparklesIcon from '../components/icons/SparklesIcon';

const PromptGeneratorPage: React.FC = () => {
  const initialFormState: PromptGenerationFormState = {
    topic: '',
    details: '',
    purpose: '',
    aiTask: '',
    targetAI: '',
  };
  const [formData, setFormData] = useState<PromptGenerationFormState>(initialFormState);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.EN);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [apiKeyMissingAlertShown, setApiKeyMissingAlertShown] = useState<boolean>(false);

  useEffect(() => {
    if (!isGeminiApiKeyAvailable() && !apiKeyMissingAlertShown) {
      setAlert({
        id: Date.now(),
        type: 'error',
        message: 'Gemini API key is not configured. The prompt generation feature will not work. Please ensure the API_KEY environment variable is set.'
      });
      setApiKeyMissingAlertShown(true);
    }
  }, [apiKeyMissingAlertShown]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGeminiApiKeyAvailable()) {
      setAlert({
        id: Date.now(),
        type: 'error',
        message: 'Gemini API key is not configured. Cannot generate prompt.'
      });
      return;
    }
    setIsLoading(true);
    setGeneratedPrompt('');
    setAlert(null);
    try {
      const prompt = await generatePromptWithGemini(formData);
      setGeneratedPrompt(prompt);
      setAlert({ id: Date.now(), type: 'success', message: 'Prompt generated successfully!' });
    } catch (error: any) {
      setAlert({ id: Date.now(), type: 'error', message: error.message || 'Failed to generate prompt.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt)
      .then(() => setAlert({ id: Date.now(), type: 'info', message: 'Prompt copied to clipboard!' }))
      .catch(() => setAlert({ id: Date.now(), type: 'error', message: 'Failed to copy prompt.' }));
  };
  
  const dismissAlert = () => {
    setAlert(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">AI Prompt Generation Tool</h1>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-4">Answer the questions below to craft a tailored AI prompt.</p>
      <p className="text-center font-kantumruy text-slate-600 dark:text-slate-400 mb-8">ឆ្លើយសំណួរខាងក្រោមដើម្បីបង្កើតសារលឿន AI តាមតម្រូវការ។</p>

      {alert && <div className="mb-6"><Alert alert={alert} onDismiss={dismissAlert} /></div>}
      
      <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-2xl rounded-lg p-6 sm:p-8 transition-colors duration-300">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setCurrentLanguage(currentLanguage === Language.EN ? Language.KM : Language.EN)}
            className="px-4 py-2 border border-primary dark:border-primary-light text-primary dark:text-primary-light rounded-md hover:bg-primary-light dark:hover:bg-primary-dark hover:text-primary-dark dark:hover:text-white transition-colors text-sm"
          >
            {currentLanguage === Language.EN ? 'ភាសាខ្មែរ' : 'English'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {PROMPT_QUESTIONS.map(q => (
            <div key={q.id}>
              <label htmlFor={q.id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {currentLanguage === Language.EN ? q.englishLabel : <span className="font-kantumruy">{q.khmerLabel}</span>}
              </label>
              <textarea
                id={q.id}
                name={q.id}
                rows={q.id === 'details' ? 3 : 2}
                value={formData[q.id as keyof PromptGenerationFormState]}
                onChange={handleInputChange}
                placeholder={currentLanguage === Language.EN ? q.placeholderEn : q.placeholderKm}
                className={`mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:text-sm ${currentLanguage === Language.KM ? 'font-kantumruy' : ''}`}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={isLoading || !isGeminiApiKeyAvailable()}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="text-white" />
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Generate Prompt
              </>
            )}
          </button>
        </form>

        {generatedPrompt && (
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Your Generated Prompt:</h2>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md shadow dark:shadow-lg">
              <pre className="whitespace-pre-wrap break-words text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-sans">
                {generatedPrompt}
              </pre>
            </div>
            <button
              onClick={handleCopyToClipboard}
              className="mt-4 px-4 py-2 border border-secondary dark:border-secondary-light text-secondary dark:text-secondary-light rounded-md hover:bg-secondary-light dark:hover:bg-secondary-dark hover:text-secondary-dark dark:hover:text-white transition-colors text-sm"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
      {!isGeminiApiKeyAvailable() && (
         <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-30 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 14a1 1 0 110-2 1 1 0 010 2zm0-7a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Warning:</strong> The Gemini API key (API_KEY) is not set. Prompt generation is disabled.
                  Please contact the site administrator or ensure the API_KEY environment variable is correctly configured if you are developing this application.
                </p>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default PromptGeneratorPage;