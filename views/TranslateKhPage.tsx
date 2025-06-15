
import React, { useState, useEffect } from 'react';
import { Language, AlertMessage, TranslationSupportedLanguage, LANGUAGE_OPTIONS } from '../types';
import { translateTextWithGemini, isGeminiApiKeyAvailable } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import TranslateIcon from '../components/icons/TranslateIcon';
import SparklesIcon from '../components/icons/SparklesIcon';


const TranslateKhPage: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<TranslationSupportedLanguage>('Khmer');
  const [targetLang, setTargetLang] = useState<TranslationSupportedLanguage>('English');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [apiKeyMissingAlertShown, setApiKeyMissingAlertShown] = useState<boolean>(false);

  useEffect(() => {
    if (!isGeminiApiKeyAvailable() && !apiKeyMissingAlertShown) {
      setAlert({
        id: Date.now(),
        type: 'error',
        message: 'Gemini API key is not configured. Translation feature will not work. Please ensure the API_KEY environment variable is set.'
      });
      setApiKeyMissingAlertShown(true);
    }
  }, [apiKeyMissingAlertShown]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setAlert({ id: Date.now(), type: 'info', message: 'Please enter text to translate.' });
      return;
    }
    if (!isGeminiApiKeyAvailable()) {
      setAlert({ id: Date.now(), type: 'error', message: 'Gemini API key is not configured. Cannot translate.' });
      return;
    }
    if (sourceLang === targetLang) {
      setAlert({ id: Date.now(), type: 'info', message: 'Source and target languages are the same.' });
      setTranslatedText(sourceText);
      return;
    }

    setIsLoading(true);
    setTranslatedText('');
    setAlert(null);

    try {
      const result = await translateTextWithGemini(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
      setAlert({ id: Date.now(), type: 'success', message: 'Text translated successfully!' });
    } catch (error: any) {
      setAlert({ id: Date.now(), type: 'error', message: error.message || 'Failed to translate text.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    const currentSourceText = sourceText;
    const currentTranslatedText = translatedText;
    const currentSourceLang = sourceLang;
    
    setSourceLang(targetLang);
    setTargetLang(currentSourceLang);
    setSourceText(currentTranslatedText); 
    setTranslatedText(currentSourceText); 
    setAlert(null);
  };

  const handleCopyToClipboard = (textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy)
      .then(() => setAlert({ id: Date.now(), type: 'info', message: 'Copied to clipboard!' }))
      .catch(() => setAlert({ id: Date.now(), type: 'error', message: 'Failed to copy.' }));
  };

  const dismissAlert = () => setAlert(null);
  
  const langOptions = Object.keys(LANGUAGE_OPTIONS) as TranslationSupportedLanguage[];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      <div className="text-center mb-10">
        <TranslateIcon className="w-16 h-16 text-primary dark:text-primary-light mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">AI Language Translator</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 font-kantumruy">បកប្រែភាសាដោយប្រើ AI - ភាសាខ្មែរ អង់គ្លេស និងច្រើនទៀត</p>
      </div>

      {alert && <div className="mb-6"><Alert alert={alert} onDismiss={dismissAlert} /></div>}

      <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-2xl rounded-lg p-6 sm:p-8 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-end">
          <div>
            <label htmlFor="sourceLang" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From</label>
            <select
              id="sourceLang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as TranslationSupportedLanguage)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200"
            >
              {langOptions.map(lang => <option key={lang} value={lang} className="dark:bg-slate-700 dark:text-slate-200">{lang}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="targetLang" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To</label>
            <select
              id="targetLang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as TranslationSupportedLanguage)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200"
            >
              {langOptions.map(lang => <option key={lang} value={lang} className="dark:bg-slate-700 dark:text-slate-200">{lang}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center mb-6">
            <button
                onClick={handleSwapLanguages}
                title="Swap Languages"
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Swap languages"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
            </button>
        </div>


        <div className="space-y-6">
          <div>
            <label htmlFor="sourceText" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {sourceLang} Text
            </label>
            <textarea
              id="sourceText"
              rows={5}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={`Enter text in ${sourceLang}...`}
              className={`mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:text-sm ${sourceLang === 'Khmer' ? 'font-kantumruy' : ''}`}
            />
            {sourceText && (
                 <button
                onClick={() => handleCopyToClipboard(sourceText)}
                className="mt-2 px-3 py-1 text-xs border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Copy Source
              </button>
            )}
          </div>

          <button
            onClick={handleTranslate}
            disabled={isLoading || !isGeminiApiKeyAvailable()}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="text-white" />
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2"/>
                Translate
              </>
            )}
          </button>

          {translatedText && (
            <div>
              <label htmlFor="translatedText" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {targetLang} Translation
              </label>
              <textarea
                id="translatedText"
                rows={5}
                value={translatedText}
                readOnly
                placeholder={`Translation will appear here...`}
                className={`mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-200 sm:text-sm ${targetLang === 'Khmer' ? 'font-kantumruy' : ''}`}
              />
              <button
                onClick={() => handleCopyToClipboard(translatedText)}
                className="mt-2 px-3 py-1 text-xs border border-primary dark:border-primary-light text-primary dark:text-primary-light rounded-md hover:bg-primary-light dark:hover:bg-primary-dark dark:hover:text-white transition-colors"
              >
                Copy Translation
              </button>
            </div>
          )}
        </div>
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
                  <strong>Warning:</strong> The Gemini API key (API_KEY) is not set. Translation is disabled.
                </p>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default TranslateKhPage;