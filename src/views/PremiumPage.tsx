import React, { useState, useEffect } from 'react';
import { ChatMessage, AlertMessage } from '../types';
import { isGeminiApiKeyAvailable } from '../services/geminiService';
import { sendChatMessage } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SparklesIcon from '../components/icons/SparklesIcon';
import { TECHNICAL_TERMS } from '../constants';

const PremiumPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [apiKeyMissingAlertShown, setApiKeyMissingAlertShown] = useState(false);

  useEffect(() => {
    if (!isGeminiApiKeyAvailable() && !apiKeyMissingAlertShown) {
      setAlert({
        id: Date.now(),
        type: 'error',
        message: 'Gemini API key is not configured. Chat feature will not work. Please ensure the VITE_GOOGLE_API_KEY environment variable is set.'
      });
      setApiKeyMissingAlertShown(true);
    }
  }, [apiKeyMissingAlertShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setAlert({
        id: Date.now(),
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to get response from AI'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Premium Chat</h1>
        
        {alert && <Alert alert={alert} onDismiss={() => setAlert(null)} />}
        
        <div className="h-[500px] overflow-y-auto mb-4 p-4 border rounded">
          {messages.map(message => (
            <div
              key={message.id}
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default PremiumPage;
