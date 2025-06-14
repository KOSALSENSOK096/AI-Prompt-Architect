import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PromptGeneratorPage from './views/PromptGeneratorPage';
import AboutPage from './views/AboutPage';
import ContactPage from './views/ContactPage';
import UIDesignerPage from './views/UIDesignerPage';
import TranslateKhPage from './views/TranslateKhPage';
import PremiumPage from './views/PremiumPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<PromptGeneratorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/ui-designer" element={<UIDesignerPage />} />
          <Route path="/translate-kh" element={<TranslateKhPage />} />
          <Route path="/premium" element={<PremiumPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;