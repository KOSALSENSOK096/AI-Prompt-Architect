import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './views/HomePage';
import AboutPage from './views/AboutPage';
import ContactPage from './views/ContactPage';
import PremiumPage from './views/PremiumPage';
import PromptGeneratorPage from './views/PromptGeneratorPage';
import TranslateKhPage from './views/TranslateKhPage';
import UIDesignerPage from './views/UIDesignerPage';
import ImageEnhancerPage from './views/ImageEnhancerPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-7xl mx-auto w-full">
                <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/prompt-generator" element={<PromptGeneratorPage />} />
                    <Route path="/translate-kh" element={<TranslateKhPage />} />
                    <Route path="/ui-designer" element={<UIDesignerPage />} />
                    <Route path="/image-enhancer" element={<ImageEnhancerPage />} />
                    <Route 
                      path="/premium" 
                      element={
                        <ProtectedRoute>
                          <PremiumPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;