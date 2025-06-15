import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './views/HomePage';
import AboutPage from './views/AboutPage';
import ContactPage from './views/ContactPage';
import PremiumPage from './views/PremiumPage'; // This is the correct relative path
import PromptGeneratorPage from './views/PromptGeneratorPage';
import TranslateKhPage from './views/TranslateKhPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider> {/* Wrap with ThemeProvider */}
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/prompt-generator" element={<PromptGeneratorPage />} />
                <Route path="/translate-kh" element={<TranslateKhPage />} />
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
            </main>
            <Footer />
          </div>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;