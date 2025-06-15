import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, AlertMessage, GroundingChunk, Candidate } from '../types';
import { sendChatMessageStreamToGemini, isGeminiApiKeyAvailable, startNewChatSession, getWordExplanationFromGemini } from '../services/geminiService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SparklesIcon from '../components/icons/SparklesIcon';
import CodeBlockDisplay from '../components/CodeBlockDisplay'; 
import TechnicalTerm from '../components/TechnicalTerm'; 
import { TECHNICAL_TERMS } from '../constants'; 
import { Content, Part, GenerateContentResponse } from '@google/genai';
// @ts-ignore - html2pdf.js is imported via importmap and might not have types
import html2pdf from 'html2pdf.js';
import ClickableWord from '../components/ClickableWord'; 
import LightbulbIcon from '../components/icons/LightbulbIcon'; 
import PencilSquareIcon from '../components/icons/PencilSquareIcon';
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon'; 


// --- SVG Icons ---
const PaperAirplaneIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} transform group-hover:scale-110 transition-transform duration-150`}>
    <path d="M3.105 3.105a.5.5 0 01.815-.036l12.59 12.59a.5.5 0 01-.256.886l-4.961-1.135a.5.5 0 00-.333.036l-4.278 2.929a.5.5 0 01-.79-.399V9.25a.5.5 0 00-.333-.464L.61 7.695a.5.5 0 01-.036-.815l2.53-2.53zM5.667 10a.5.5 0 00-.464-.333L2.53 8.53l1.963-1.963 3.529 1.176a.5.5 0 00.464-.333V3.788l2.929-4.278a.5.5 0 00.399.79l1.135 4.961a.5.5 0 01-.886.256L5.667 10z" />
  </svg>
);

const PhotoIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
  </svg>
);
const XCircleIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
</svg>
);
const InformationCircleIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);
const CopyIcon: React.FC<{className?: string}> = ({className="w-4 h-4"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);
const ShareIcon: React.FC<{className?: string}> = ({className="w-4 h-4"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.044.585.059a2.25 2.25 0 011.983 1.983C9.75 13.832 9.75 14.25 9.75 14.25s0 .418-.033.615a2.25 2.25 0 01-1.983-1.983c-.195.015-.39.034-.585.059a2.25 2.25 0 01-2.186 0c-.195-.025-.39-.044-.585-.059a2.25 2.25 0 01-1.983-1.983C4.25 13.832 4.25 14.25 4.25 14.25s0 .418.033.615a2.25 2.25 0 011.983 1.983c.195.015.39.034.585.059a2.25 2.25 0 012.186 0c.195-.025.39-.044.585-.059a2.25 2.25 0 011.983-1.983A2.25 2.25 0 0119.75 12c0-4.015-3.235-7.25-7.25-7.25S5.25 7.985 5.25 12c0 .015.001.03.002.044a2.25 2.25 0 01-.002-.044z" />
    </svg>
);
const PdfIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => ( // Made slightly larger for consistency
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);
const MicrophoneIcon: React.FC<{className?: string; isListening?: boolean}> = ({className="w-6 h-6", isListening=false}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} ${isListening ? 'text-red-500 animate-pulse' : ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c1.657 0 3-1.343 3-3V6c0-1.657-1.343-3-3-3S9 4.343 9 6v6c0 1.657 1.343 3 3 3z" />
    </svg>
);
const TrashIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.462 3.032 1.214L9.25 7.168a45.056 45.056 0 013.032-1.214m0 0c.89-.231 1.78-.442 2.67-.632M11.255 7.168a45.066 45.066 0 011.745-.464m0 0c1.153 0 2.243.462 3.032 1.214L14.75 7.168a45.066 45.066 0 011.745-.464m0 0l.745.101M4.772 5.79m14.456 0l-1.05-1.05M4.772 5.79L3.722 4.74m5.916 15.408a2.25 2.25 0 01-2.244-2.077L4.772 5.79m0 0L3.722 4.74" />
  </svg>
);
const CodeBracketSquareIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
);
const DownloadIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
// --- End SVG Icons ---

const USER_CHAT_HISTORY_PREFIX = 'aiKhmerChatHistory_';

interface ParsedContentPart {
  type: 'text' | 'code' | 'technical_term' | 'clickable_word' | 'markdown_image';
  content: string;        
  originalWord?: string;  
  language?: string;      
  explanation?: string;   
  explanationKm?: string; 
  altText?: string;       
}


const languageToOncCompilerSlug = (lang: string | undefined): string | null => {
    if (!lang) return null;
    const l = lang.toLowerCase();
    const map: Record<string, string> = {
      javascript: 'javascript', js: 'javascript',
      python: 'python', py: 'python',
      java: 'java',
      csharp: 'csharp', cs: 'csharp',
      c: 'c',
      cpp: 'cpp', 'c++': 'cpp',
      php: 'php',
      ruby: 'ruby',
      go: 'go',
      swift: 'swift',
      kotlin: 'kotlin',
      typescript: 'typescript', ts: 'typescript',
      html: 'html',
      rust: 'rust',
      scala: 'scala',
      r: 'r',
      nodejs: 'nodejs',
      perl: 'perl'
    };
    return map[l] || null;
};

const isKhmerWord = (word: string): boolean => {
    const khmerRegex = /[\u1780-\u17FF]/;
    return khmerRegex.test(word);
};
const isDirectImageURL = (url: string): boolean => {
    if (!url) return false;
    try {
        const parsedUrl = new URL(url.startsWith('//') ? `https:${url}` : url); 
        return /\.(jpeg|jpg|gif|png|webp)$/i.test(parsedUrl.pathname);
    } catch (e) {
        return false;
    }
};


const PremiumPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<ChatMessage[]>(messages); 

  const [userInput, setUserInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [pdfExportLoading, setPdfExportLoading] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<AlertMessage | null>(null); 
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesListRef = useRef<HTMLDivElement>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [apiKeyMissingAlertShown, setApiKeyMissingAlertShown] = useState<boolean>(!isGeminiApiKeyAvailable());
  const [isListening, setIsListening] = useState<boolean>(false);
  const speechRecognitionRef = useRef<CustomSpeechRecognition | null>(null);

  const [isOneCompilerModalOpen, setIsOneCompilerModalOpen] = useState<boolean>(false);
  const [oneCompilerUrl, setOneCompilerUrl] = useState<string | null>(null);
  const [oneCompilerModalTitle, setOneCompilerModalTitle] = useState<string>('');

  const [isDynamicExplanationOpen, setIsDynamicExplanationOpen] = useState<boolean>(false);
  const [dynamicExplanationTerm, setDynamicExplanationTerm] = useState<string>('');
  const [dynamicExplanationContent, setDynamicExplanationContent] = useState<string>('');
  const [dynamicExplanationLoading, setDynamicExplanationLoading] = useState<boolean>(false);
  const [dynamicPopoverPosition, setDynamicPopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const dynamicExplanationPopoverRef = useRef<HTMLDivElement>(null);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState<string>('');

  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState<boolean>(false);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const getChatHistoryKey = useCallback(() => {
    return currentUser ? `${USER_CHAT_HISTORY_PREFIX}${currentUser.id}` : null;
  }, [currentUser]);

  const mapChatMessagesToGeminiHistory = (chatMessages: ChatMessage[]): Content[] => {
    return chatMessages.filter(msg => !msg.isLoading && !msg.id.startsWith('ai-error-')).map(msg => { 
      const parts: Part[] = [];
      if (msg.image && msg.imageMimeType && msg.sender === 'user') {
        parts.push({ inlineData: { data: msg.image, mimeType: msg.imageMimeType } });
      }
      parts.push({ text: msg.text }); 
      return {
        role: msg.sender === 'user' ? 'user' : 'model',
        parts
      };
    });
  };
  
  useEffect(() => {
    if (!isGeminiApiKeyAvailable()) {
      if (!apiKeyMissingAlertShown) {
        setAlertInfo({ id: Date.now(), type: 'error', message: 'Gemini API key missing. Chat is disabled.' });
        setApiKeyMissingAlertShown(true);
      }
      setMessages([]);
      return;
    }
    setApiKeyMissingAlertShown(false);
    
    const historyKey = getChatHistoryKey();
    let loadedMessages: ChatMessage[] = [];
    if (historyKey) {
      try {
        const storedHistory = localStorage.getItem(historyKey);
        if (storedHistory) {
          loadedMessages = JSON.parse(storedHistory).map((msg: ChatMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            isLoading: false 
          }));
        }
      } catch (e) {
        console.error("Failed to parse chat history from localStorage", e);
        localStorage.removeItem(historyKey);
      }
    }
    setMessages(loadedMessages);
    
    try {
        const geminiHistory = mapChatMessagesToGeminiHistory(loadedMessages);
        startNewChatSession(geminiHistory);
    } catch (e: any) {
        setAlertInfo({ id: Date.now(), type: 'error', message: `Failed to initialize chat session: ${e.message}`});
    }
  }, [currentUser, getChatHistoryKey, apiKeyMissingAlertShown]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]); 

  useEffect(() => {
    const editingTextarea = document.getElementById(`editing-textarea-${editingMessageId}`) as HTMLTextAreaElement;
    if (editingTextarea) {
        editingTextarea.style.height = 'auto';
        editingTextarea.style.height = `${Math.min(editingTextarea.scrollHeight, 120)}px`; 
        editingTextarea.focus();
    } else if (textareaRef.current) { 
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; 
    }
  }, [userInput, editingMessageId, editingMessageText]); 

  const saveChatHistory = useCallback(() => {
    const historyKey = getChatHistoryKey();
    if (historyKey) {
      try {
        const messagesToSave = messagesRef.current.filter(msg => !msg.isLoading && !msg.id.startsWith('ai-error-'));
        localStorage.setItem(historyKey, JSON.stringify(messagesToSave));
      } catch (e) {
        console.error("Failed to save chat history to localStorage", e);
        setAlertInfo({id: Date.now(), type: 'error', message: 'Could not save chat history. Storage might be full.'});
      }
    }
  }, [getChatHistoryKey]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 4 * 1024 * 1024) { 
        setAlertInfo({ id: Date.now(), type: 'error', message: 'Image size should not exceed 4MB.' });
        return;
      }
      setSelectedImage(file);
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result?.toString().split(',')[1] || null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImageBase64(null);
    setImageMimeType(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const processAndSendUserMessage = async (messageText: string, imageBase64Data?: string | null, imageMimeTypeData?: string | null) => {
    if (!isGeminiApiKeyAvailable()) {
      setAlertInfo({ id: Date.now(), type: 'error', message: 'Gemini API key is not configured. Cannot send message.' });
      return;
    }
  
    const userMsgObj: ChatMessage = {
      id: `user-${Date.now()}`, 
      sender: 'user',
      text: messageText,
      timestamp: new Date(), 
      image: imageBase64Data || undefined,
      imageMimeType: imageMimeTypeData || undefined,
    };
  
    let baseMessages = messagesRef.current;
    if (editingMessageId) {
        const editIndex = baseMessages.findIndex(msg => msg.id === editingMessageId);
        if (editIndex !== -1) {
            baseMessages = baseMessages.slice(0, editIndex);
        }
    }

    const updatedMessages = [...baseMessages, userMsgObj];
    setMessages(updatedMessages);
    saveChatHistory(); 

    setUserInput('');
    removeSelectedImage(); 
    setEditingMessageId(null);
    setEditingMessageText('');

    setIsLoading(true);
    setAlertInfo(null);
  
    const aiStreamMsgId = `ai-stream-${Date.now()}`;
    const aiPlaceholderMsg: ChatMessage = {
      id: aiStreamMsgId,
      sender: 'ai',
      text: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, aiPlaceholderMsg]);

    try {
      const geminiHistory = mapChatMessagesToGeminiHistory(baseMessages); 
      startNewChatSession(geminiHistory); 

      const stream = await sendChatMessageStreamToGemini(userMsgObj);
      let accumulatedText = "";
      let finalGroundingMetadata: ChatMessage['groundingMetadata'] = undefined;

      for await (const chunk of stream) {
        accumulatedText += (chunk.text || "");
        if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].groundingMetadata) {
            finalGroundingMetadata = chunk.candidates[0].groundingMetadata;
        }

        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiStreamMsgId ? { ...msg, text: accumulatedText, groundingMetadata: finalGroundingMetadata } : msg
          )
        );
      }
  
      setMessages(prev => {
        const finalMessages = prev.map(msg =>
          msg.id === aiStreamMsgId ? { ...msg, text: accumulatedText, isLoading: false, groundingMetadata: finalGroundingMetadata } : msg
        );
        saveChatHistory(); 
        return finalMessages;
      });
  
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get response from AI.';
      setAlertInfo({ id: Date.now(), type: 'error', message: errorMessage });
      setMessages(prev => {
        const updated = prev.filter(msg => msg.id !== aiStreamMsgId);
        const errorMsg: ChatMessage = {
          id: `ai-error-${Date.now()}`,
          sender: 'ai',
          text: `Sorry, I encountered an error: ${errorMessage}`,
          timestamp: new Date(),
          isLoading: false,
        };
        const finalMessages = [...updated, errorMsg];
        saveChatHistory(); 
        return finalMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput && !selectedImage) {
      setAlertInfo({ id: Date.now(), type: 'info', message: 'Please type a message or upload an image.' });
      return;
    }
    processAndSendUserMessage(trimmedInput, imageBase64, imageMimeType);
  };
  
  const handleSaveEdit = () => {
    const trimmedEditedInput = editingMessageText.trim();
    const originalMessage = messages.find(msg => msg.id === editingMessageId);

    if (!trimmedEditedInput && !originalMessage?.image) { 
        setAlertInfo({ id: Date.now(), type: 'info', message: 'Edited message cannot be empty if there is no image.' });
        return;
    }
    processAndSendUserMessage(trimmedEditedInput, originalMessage?.image, originalMessage?.imageMimeType);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageText('');
  };

  const startEditing = (message: ChatMessage) => {
    if(message.sender === 'user' && !editingMessageId) { 
        setEditingMessageId(message.id);
        setEditingMessageText(message.text);
        removeSelectedImage(); 
        setUserInput(''); 
    }
  };

  const handleNewChat = () => {
    setMessages([]); 
    const historyKey = getChatHistoryKey();
    if (historyKey) {
      localStorage.removeItem(historyKey);
    }
    setUserInput('');
    removeSelectedImage();
    setEditingMessageId(null); 
    setEditingMessageText('');
    setAlertInfo({ id: Date.now(), type: 'info', message: 'New chat started. Previous history cleared.'});
    if(isGeminiApiKeyAvailable()) {
        try {
            startNewChatSession(); 
        } catch(e: any) {
            setAlertInfo({id: Date.now(), type: 'error', message: `Failed to start new chat: ${e.message}`});
        }
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => setAlertInfo({ id: Date.now(), type: 'success', message: 'Message copied to clipboard!' }))
      .catch(() => setAlertInfo({ id: Date.now(), type: 'error', message: 'Failed to copy message.' }));
  };

  const handleShareMessage = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AI Khmer Chat Message', text });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyMessage(text);
      setAlertInfo({ id: Date.now(), type: 'info', message: 'Share API not available. Message copied instead.' });
    }
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setAlertInfo({id: Date.now(), type: 'success', message: `${filename} download started.`});
    setIsDownloadDropdownOpen(false);
  };

  const handleDownloadText = () => {
    const content = messagesRef.current
      .filter(msg => !msg.isLoading && !msg.id.startsWith('ai-error-'))
      .map(msg => {
        let textContent = `[${new Date(msg.timestamp).toLocaleString()}] ${msg.sender === 'user' ? 'User' : 'AI'}:\n${msg.text}\n`;
        if (msg.image && msg.sender === 'user') {
          textContent += `[Image Attached: User uploaded image (type: ${msg.imageMimeType})]\n`;
        }
        if (msg.sender === 'ai' && msg.groundingMetadata?.groundingChunks) {
          const sources = msg.groundingMetadata.groundingChunks
            .map(chunk => chunk.web?.uri || chunk.retrievedContext?.uri)
            .filter(uri => !!uri);
          if (sources.length > 0) {
            textContent += `\nSources:\n${sources.map(s => `- ${s}`).join('\n')}\n`;
          }
        }
        return textContent;
      })
      .join('\n---\n\n');
    downloadFile(content, `AIKhmerChat-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadJson = () => {
    const messagesToSave = messagesRef.current.filter(msg => !msg.isLoading && !msg.id.startsWith('ai-error-'));
    const content = JSON.stringify(messagesToSave, null, 2);
    downloadFile(content, `AIKhmerChat-${new Date().toISOString().split('T')[0]}.json`, 'application/json;charset=utf-8');
  };
  
  const formatMessageForMarkdownExport = (msg: ChatMessage): string => {
    let md = `**${msg.sender === 'user' ? 'User' : 'AI'}** (*${new Date(msg.timestamp).toLocaleString()}*)\n\n`;
  
    if (msg.sender === 'user') {
      msg.text.split('\n').forEach(line => {
        md += `> ${line}\n`; // Blockquote user text
      });
      md += '\n'; // Add a newline after the blockquote
      if (msg.image && msg.imageMimeType) {
        md += `> _(User attached an image: type ${msg.imageMimeType})_\n\n`;
      }
    } else { // For AI messages
      // AI text might contain Markdown (like code blocks or AI-inserted images from search)
      // So, we append it mostly as is.
      md += `${msg.text}\n\n`;
    }
  
    // Add grounding metadata for AI messages
    if (msg.sender === 'ai' && msg.groundingMetadata?.groundingChunks) {
      const sources = msg.groundingMetadata.groundingChunks
        .map(chunk => {
          const sourceInfo = chunk.web || chunk.retrievedContext;
          return sourceInfo && sourceInfo.uri ? `[${sourceInfo.title || sourceInfo.uri}](${sourceInfo.uri})` : null;
        })
        .filter(s => s !== null);
      if (sources.length > 0) {
        md += `_Sources:_\n`;
        sources.forEach(s => md += `- ${s}\n`);
        md += '\n';
      }
    }
    
    md += '---\n\n';
    return md;
  };

  const handleDownloadMarkdown = () => {
    const header = `## AI Khmer Chat Export - ${new Date().toLocaleDateString()}\n\n---\n\n`;
    const content = messagesRef.current
      .filter(msg => !msg.isLoading && !msg.id.startsWith('ai-error-'))
      .map(msg => formatMessageForMarkdownExport(msg))
      .join('');
    downloadFile(header + content, `AIKhmerChat-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown;charset=utf-8');
  };


  const handleExportPdf = () => {
    if (!chatMessagesListRef.current || messagesRef.current.filter(m => !m.isLoading).length === 0) {
      setAlertInfo({ id: Date.now(), type: 'info', message: 'No messages to export.' });
      setIsDownloadDropdownOpen(false);
      return;
    }
    setPdfExportLoading(true);
    setAlertInfo({ id: Date.now(), type: 'info', message: 'Generating PDF... Please wait.' });
    setIsDownloadDropdownOpen(false);
  
    const defaultFilename = `AIKhmerChat-${new Date().toISOString().split('T')[0]}.pdf`;
    const element = chatMessagesListRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: defaultFilename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: -window.scrollY, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    if (!html2pdf || typeof html2pdf.default !== 'function') {
      setAlertInfo({ id: Date.now(), type: 'error', message: 'PDF library (html2pdf.js) is not loaded correctly or `default` export is not a function.' });
      console.error("html2pdf structure error:", html2pdf);
      setPdfExportLoading(false);
      return;
    }
  
    const html2pdfFunc = html2pdf.default;
    let pdfPromise;
  
    try {
      // Attempt to use the direct html2pdf(element, options) invocation
      const workerInstance = html2pdfFunc(element, opt);
  
      if (!workerInstance || typeof workerInstance.save !== 'function') {
        console.error("html2pdf.default(element, opt) did not return a valid object with a .save() method.", workerInstance);
        setAlertInfo({ id: Date.now(), type: 'error', message: 'PDF generation failed: Invalid response from PDF library after direct call.' });
        setPdfExportLoading(false);
        return;
      }
      pdfPromise = workerInstance.save();
  
    } catch (e: any) {
      // Fallback or primary error handling if direct call fails or is not the structure
      console.warn("Direct call html2pdf(element, opt) failed or structure not as expected, trying chained method. Error:", e.message);
      // Try the chained method as a fallback or if the above is not the right structure
      try {
        const worker = html2pdfFunc(); // Call to get the worker object
        if (!worker || typeof worker.from !== 'function') {
            console.error('html2pdf.default() did not return a valid worker object with a .from method for chaining.', worker);
            setAlertInfo({ id: Date.now(), type: 'error', message: 'PDF generation failed: Could not obtain a valid PDF worker for chaining.' });
            setPdfExportLoading(false);
            return;
        }
        pdfPromise = worker.from(element).set(opt).save();
      } catch (chainedError: any) {
        console.error("Error with chained html2pdf().from().set().save():", chainedError);
        setAlertInfo({ id: Date.now(), type: 'error', message: `PDF library operation error: ${chainedError.message}` });
        setPdfExportLoading(false);
        return;
      }
    }
  
    if (pdfPromise && typeof pdfPromise.then === 'function') {
      pdfPromise
        .then(() => {
          setAlertInfo({ id: Date.now(), type: 'success', message: `Chat exported as ${opt.filename}` });
        })
        .catch((err: any) => {
          console.error("PDF Export Error (from .save() promise):", err);
          setAlertInfo({ id: Date.now(), type: 'error', message: `Failed to export chat as PDF. ${err.message || 'Unknown PDF generation error'}` });
        })
        .finally(() => {
          setPdfExportLoading(false);
        });
    } else {
      console.error(".save() did not return a Promise or pdfPromise is undefined.", pdfPromise);
      setAlertInfo({ id: Date.now(), type: 'error', message: 'PDF generation failed: .save() method did not behave as expected.' });
      setPdfExportLoading(false);
    }
  };

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }
    speechRecognitionRef.current = new SpeechRecognitionAPI();
    const recognition = speechRecognitionRef.current;
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'km-KH'; 

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const currentTranscript = finalTranscript || interimTranscript;
      if (editingMessageId) {
        setEditingMessageText(prev => prev + currentTranscript);
      } else {
        setUserInput(prev => prev + currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      let errorMsg = 'Speech recognition error.';
      if (event.error === 'no-speech') errorMsg = 'No speech detected. Please try again.';
      if (event.error === 'audio-capture') errorMsg = 'Microphone problem. Please check permissions.';
      if (event.error === 'not-allowed') errorMsg = 'Microphone access denied. Please enable it in browser settings.';
      setAlertInfo({ id: Date.now(), type: 'error', message: errorMsg });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    return () => {
        if (recognition && typeof recognition.stop === 'function') {
            recognition.stop();
        }
    };
  }, [editingMessageId]); 

  const toggleVoiceInput = () => {
    if (editingMessageId) return; 
    if (!speechRecognitionRef.current) {
      setAlertInfo({ id: Date.now(), type: 'error', message: 'Speech recognition not available.' });
      return;
    }
    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          speechRecognitionRef.current?.start();
          setIsListening(true);
          setAlertInfo({ id: Date.now(), type: 'info', message: 'Listening... Speak now.' });
        })
        .catch(err => {
          console.error("Microphone access error:", err);
          setAlertInfo({ id: Date.now(), type: 'error', message: 'Microphone access denied. Please enable it in your browser settings.' });
        });
    }
  };
  const dismissAlert = () => setAlertInfo(null);

  const handleRunCodeRequest = (code: string, language: string) => {
    const slug = languageToOncCompilerSlug(language);
    if (slug) {
      const encodedCode = encodeURIComponent(code);
      
      // Language-specific settings for better code completion
      const languageSettings = {
        javascript: {
          libs: ['react', 'node'],
          compilerFlags: '--experimental-modules',
          intelliSenseMode: 'node'
        },
        typescript: {
          libs: ['react', '@types/node'],
          compilerFlags: '--strict',
          intelliSenseMode: 'node'
        },
        python: {
          version: '3.9',
          libs: ['numpy', 'pandas'],
          intelliSenseMode: 'python'
        },
        java: {
          version: '17',
          intelliSenseMode: 'java'
        }
      };

      // Get language-specific settings
      const settings = languageSettings[language as keyof typeof languageSettings] || {};
      
      // Enhanced configuration for better code completion and IDE features
      const config = {
        theme: 'dark_plus',
        listenToEvents: true,
        hideNew: true,
        hideNewFileOption: true,
        hideLanguageSelection: true,
        hideStdin: false,
        hideFiles: false,
        enableAutoComplete: true,
        enableIntelliSense: true,
        enableLinting: true,
        enableFormatting: true,
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        renderWhitespace: 'selection',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        codeLens: true,
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        snippetsPreventQuickSuggestions: false,
        ...settings
      };

      const configString = encodeURIComponent(JSON.stringify(config));
      const oneCompilerUrl = `https://onecompiler.com/embed/${slug}?hideDevTools=true&hideNewFileOption=true&theme=dark&code=${encodedCode}&config=${configString}`;
      
      setOneCompilerUrl(oneCompilerUrl);
      setOneCompilerModalTitle(`Run ${language.charAt(0).toUpperCase() + language.slice(1)} with OneCompiler`);
      setIsOneCompilerModalOpen(true);
    }
};

 const parseMessageContent = (text: string): ParsedContentPart[] => {
    const finalParts: ParsedContentPart[] = [];
    if (!text) return [{ type: 'text', content: '' }];

    const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/g; 
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g; 
    
    const termRegexParts: string[] = [];
    TECHNICAL_TERMS.forEach(termObj => {
        termRegexParts.push(termObj.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        if (termObj.aliases) {
            termObj.aliases.forEach(alias => 
                termRegexParts.push(alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            );
        }
    });
    termRegexParts.sort((a, b) => b.length - a.length); 
    const technicalTermRegex = termRegexParts.length > 0 ? new RegExp(`\\b(${termRegexParts.join('|')})\\b`, 'gi') : null;

    let lastProcessedIndex = 0;
    const combinedRegex = new RegExp(`${markdownImageRegex.source}|${codeBlockRegex.source}`, 'g');
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
        const matchIndex = match.index;
        
        if (matchIndex > lastProcessedIndex) {
            const plainTextSegment = text.substring(lastProcessedIndex, matchIndex);
            processSegmentForTermsAndWords(plainTextSegment, finalParts, technicalTermRegex);
        }

        if (match[1] !== undefined || match[2] !== undefined) { 
            const altText = match[1] || '';
            const imageUrl = match[2] || '';
            if (imageUrl) {
                finalParts.push({ type: 'markdown_image', content: imageUrl, altText });
            }
        } 
        else if (match[3] !== undefined || match[4] !== undefined) { 
            const language = (match[3] || '').toLowerCase() || 'plaintext';
            const codeContent = (match[4] || '').trim();
            if (codeContent) {
                 finalParts.push({ type: 'code', content: codeContent, language });
            }
        }
        lastProcessedIndex = combinedRegex.lastIndex;
    }
    
    if (lastProcessedIndex < text.length) {
        const remainingTextSegment = text.substring(lastProcessedIndex);
        processSegmentForTermsAndWords(remainingTextSegment, finalParts, technicalTermRegex);
    }

    if (finalParts.length === 0 && text) { 
         processSegmentForTermsAndWords(text, finalParts, technicalTermRegex);
    }
    if (finalParts.length === 0 && !text) {
        finalParts.push({ type: 'text', content: '' });
    }

    return finalParts;
  };
  
  function processSegmentForTermsAndWords(segment: string, partsArray: ParsedContentPart[], technicalTermRegex: RegExp | null) {
    if (!segment) return;
    let lastTermIndex = 0;
    let termMatch;

    if (technicalTermRegex) {
        technicalTermRegex.lastIndex = 0; 
        while ((termMatch = technicalTermRegex.exec(segment)) !== null) {
            const termStartIndex = termMatch.index;
            const termEndIndex = technicalTermRegex.lastIndex;
            const matchedTermText = termMatch[0];

            if (termStartIndex > lastTermIndex) {
                const precedingText = segment.substring(lastTermIndex, termStartIndex);
                processPlainTextForClickableWords(precedingText, partsArray);
            }
            
            const termDefinition = TECHNICAL_TERMS.find(
                t => t.term.toLowerCase() === matchedTermText.toLowerCase() ||
                     (t.aliases && t.aliases.some(alias => alias.toLowerCase() === matchedTermText.toLowerCase()))
            );

            if (termDefinition) {
                partsArray.push({
                    type: 'technical_term',
                    content: matchedTermText,
                    explanation: termDefinition.explanation,
                    explanationKm: termDefinition.explanationKm
                });
            } else { 
                 processPlainTextForClickableWords(matchedTermText, partsArray);
            }
            lastTermIndex = termEndIndex;
        }
    }
    
    if (lastTermIndex < segment.length) {
        const remainingTextInSegment = segment.substring(lastTermIndex);
        processPlainTextForClickableWords(remainingTextInSegment, partsArray);
    }
  }

  const processPlainTextForClickableWords = (plainText: string, partsArray: ParsedContentPart[]) => {
    if (!plainText) return;
    const tokens = plainText.match(/([a-zA-Z\u1780-\u17FF0-9]+[.,!?;:"(){}[\]។៕៖""']*)|(\s+)|([.,!?;:"(){}[\]។៕៖""']+)/g) || [];

    tokens.forEach(token => {
        const cleanedWordForLookup = (token as string).replace(/^[.,!?;:"(){}[\]។៕៖""']+|[.,!?;:"(){}[\]។៕៖""']+$/g, '').trim();
        
        if (cleanedWordForLookup.length > 1 && 
            !/^\d+$/.test(cleanedWordForLookup) && 
            !/^[.,!?;:"(){}[\]។៕៖""']+$/.test(cleanedWordForLookup) && 
            /[a-zA-Z\u1780-\u17FF]/.test(cleanedWordForLookup) 
           ) { 
            partsArray.push({ type: 'clickable_word', content: cleanedWordForLookup, originalWord: token });
        } else {
            partsArray.push({ type: 'text', content: token }); 
        }
    });
  };

  const fetchWordExplanation = async (wordForLookup: string, originalWordElement: HTMLElement) => {
    if (!wordForLookup || !originalWordElement) return;
    
    const wordToSpeak = originalWordElement.textContent || wordForLookup;

    if (wordToSpeak && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(wordToSpeak);
        if (isKhmerWord(wordToSpeak)) {
            utterance.lang = 'km-KH';
            const voices = window.speechSynthesis.getVoices();
            const khmerVoice = voices.find(voice => voice.lang === 'km-KH');
            if (khmerVoice) utterance.voice = khmerVoice;
        } else {
            utterance.lang = 'en-US'; 
             const voices = window.speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => voice.lang.startsWith('en-')); 
            if (englishVoice) utterance.voice = englishVoice;
        }
        window.speechSynthesis.cancel(); 
        window.speechSynthesis.speak(utterance);
    } else if (!window.speechSynthesis) {
        setAlertInfo({id: Date.now(), type: 'info', message: 'Text-to-speech is not supported in your browser.'});
    }

    if (isDynamicExplanationOpen && dynamicExplanationTerm === wordToSpeak) {
        setIsDynamicExplanationOpen(false); 
        return;
    }
    
    setDynamicExplanationLoading(true);
    setDynamicExplanationTerm(wordToSpeak); 
    setIsDynamicExplanationOpen(true); 

    const rect = originalWordElement.getBoundingClientRect();
    const popoverHeightEstimate = 150; 
    const spaceBelow = window.innerHeight - rect.bottom;
    const popoverTop = (spaceBelow < popoverHeightEstimate && rect.top > popoverHeightEstimate) 
                       ? rect.top + window.scrollY - popoverHeightEstimate - 10 
                       : rect.bottom + window.scrollY + 5; 
    
    const popoverWidth = 288; 
    let popoverLeft = rect.left + window.scrollX + rect.width / 2 - popoverWidth / 2;
    popoverLeft = Math.max(10, Math.min(popoverLeft, window.innerWidth - popoverWidth - 10));

    setDynamicPopoverPosition({ top: popoverTop, left: popoverLeft });

    try {
      const sourceLang = isKhmerWord(wordForLookup) ? 'Khmer' : 'English';
      const explanation = await getWordExplanationFromGemini(wordForLookup, sourceLang);
      setDynamicExplanationContent(explanation);
    } catch (error: any) {
      console.error("Failed to fetch word explanation:", error);
      setDynamicExplanationContent(`Sorry, I couldn't get an explanation for "${wordToSpeak}". ${error.message}`);
    } finally {
      setDynamicExplanationLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutsidePopover = (event: MouseEvent) => {
        const target = event.target as Node;
        if (target instanceof HTMLElement && target.closest('.clickable-word-button')) {
            return;
        }
        if (dynamicExplanationPopoverRef.current && !dynamicExplanationPopoverRef.current.contains(target)) { 
            setIsDynamicExplanationOpen(false);
        }
    };
    if (isDynamicExplanationOpen) {
        document.addEventListener('mousedown', handleClickOutsidePopover);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutsidePopover);
    };
  }, [isDynamicExplanationOpen]);

  useEffect(() => { // Close download dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        const downloadButton = (event.target as HTMLElement).closest('#download-chat-button');
        if (!downloadButton) { // Don't close if clicking the main button again
             setIsDownloadDropdownOpen(false);
        }
      }
    };
    if (isDownloadDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadDropdownOpen]);


  const renderMessageContent = (message: ChatMessage) => {
    if (editingMessageId === message.id) {
        return (
            <div className="space-y-2">
                <textarea
                    id={`editing-textarea-${message.id}`}
                    value={editingMessageText}
                    onChange={(e) => setEditingMessageText(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 resize-none leading-tight text-sm"
                    rows={3}
                    style={{minHeight: '60px', maxHeight: '120px'}}
                    autoFocus
                />
                {message.image && ( 
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Note: Original message included an image (not shown, will be re-sent with edit).
                    </p>
                )}
                <div className="flex justify-end space-x-2 mt-1">
                    <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-md text-slate-700 dark:text-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveEdit}
                        disabled={isLoading}
                        className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md disabled:bg-slate-400 transition-colors"
                    >
                        {isLoading ? <LoadingSpinner size="sm" color="text-white"/> : 'Save & Submit'}
                    </button>
                </div>
            </div>
        );
    }

    const renderedParts: (JSX.Element | string)[] = [];
    if (message.isLoading && !message.text) {
      renderedParts.push(
        <div key="loading-dots" className="flex items-center space-x-1.5 py-1">
          <span className="text-sm italic text-slate-500 dark:text-slate-400">AI is thinking</span>
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-75 dot dot-1"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-75 dot dot-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-75 dot dot-3"></div>
        </div>
      );
    } else {
        const parsedContentParts = parseMessageContent(message.text);
        parsedContentParts.forEach((part, index) => {
            const key = `${message.id}-part-${index}-${Math.random()}`; 
            if (part.type === 'code') {
                renderedParts.push(
                    <CodeBlockDisplay 
                        key={key} 
                        code={part.content} 
                        language={part.language} 
                        onCopyNotify={setAlertInfo} 
                        onRunCode={handleRunCodeRequest}
                    />
                );
            } else if (part.type === 'markdown_image') {
                renderedParts.push(
                    <img 
                        key={key}
                        src={part.content} 
                        alt={part.altText || "Image from AI"}
                        className="max-w-full sm:max-w-md max-h-72 my-2 rounded-md border border-slate-200 dark:border-slate-600"
                        onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                );
            } else if (part.type === 'technical_term' && part.explanation) {
                renderedParts.push(
                    <TechnicalTerm 
                        key={key} 
                        term={part.content} 
                        explanation={part.explanation} 
                        explanationKm={part.explanationKm} 
                    />
                );
            } else if (part.type === 'clickable_word' && part.originalWord) {
                renderedParts.push(
                    <ClickableWord
                        key={key} 
                        word={part.originalWord} 
                        onWordClick={(clickedOriginalWord, element) => fetchWordExplanation(part.content, element)} 
                    />
                );
            } else { 
                 renderedParts.push(
                    <span key={key} className="whitespace-pre-wrap break-words">
                        {part.content}
                    </span>
                );
            }
        });
    }
    
    return (
      <>
        <div className="text-sm leading-relaxed font-sans"> 
            {renderedParts.map((part, index) => 
                <React.Fragment key={`${message.id}-rendered-${index}`}>{part}</React.Fragment>
            )}
        </div>

         {message.isLoading && message.text && ( 
            <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs italic text-slate-400 dark:text-slate-500">Receiving...</span>
                <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 animate-ping"></div>
            </div>
        )}
        {message.sender === 'ai' && message.groundingMetadata && message.groundingMetadata.groundingChunks && message.groundingMetadata.groundingChunks.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-600 opacity-80">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Sources:</p>
                <ul className="space-y-1">
                    {message.groundingMetadata.groundingChunks.map((chunk, idx) => {
                        const source = chunk.web || chunk.retrievedContext;
                        if (!source || !source.uri) return null;
                        const isImage = isDirectImageURL(source.uri);
                        return (
                            <li key={`${message.id}-grounding-${idx}`} className="text-xs">
                                <a 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 dark:text-blue-400 hover:underline hover:text-blue-600 dark:hover:text-blue-300 break-all flex items-start"
                                    title={source.title || source.uri}
                                >
                                    <ExternalLinkIcon className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0"/>
                                    <span className="truncate">{source.title || source.uri}</span>
                                </a>
                                {isImage && (
                                   <img 
                                        src={source.uri} 
                                        alt={source.title || "Source Image"} 
                                        className="max-w-xs max-h-32 rounded mt-1 border border-slate-200 dark:border-slate-600"
                                        onError={(e) => (e.currentTarget.style.display = 'none')} 
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-900 rounded-xl overflow-hidden my-6 transition-colors duration-300">
      <header className="bg-gradient-to-r from-primary to-primary-dark dark:from-primary-dark dark:to-teal-800 text-white p-3 sm:p-4 flex justify-between items-center shadow-md flex-wrap gap-2">
        <div className="flex items-center">
            <SparklesIcon className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-2.5 text-white"/>
            <h1 className="text-lg sm:text-xl font-semibold">AI Khmer Chat</h1>
        </div>
        <div className="flex items-center space-x-2">
            <div className="relative">
                <button
                    id="download-chat-button"
                    onClick={() => setIsDownloadDropdownOpen(prev => !prev)}
                    disabled={pdfExportLoading || !isGeminiApiKeyAvailable() || messagesRef.current.filter(m => !m.isLoading).length === 0}
                    className="p-1.5 sm:p-2 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors flex items-center text-xs sm:text-sm disabled:opacity-50 group"
                    title="Download Chat History"
                    aria-haspopup="true"
                    aria-expanded={isDownloadDropdownOpen}
                >
                    {pdfExportLoading ? <LoadingSpinner size="sm" color="text-white"/> : <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white"/> }
                    <span className="ml-1 hidden sm:inline">Download Chat</span>
                </button>
                {isDownloadDropdownOpen && (
                    <div 
                        ref={downloadDropdownRef} 
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-30 border border-slate-200 dark:border-slate-600"
                        role="menu"
                    >
                        <a onClick={handleDownloadText} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer" role="menuitem">As Text (.txt)</a>
                        <a onClick={handleDownloadMarkdown} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer" role="menuitem">As Markdown (.md)</a>
                        <a onClick={handleDownloadJson} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer" role="menuitem">As JSON (.json)</a>
                        <a onClick={() => handleExportPdf()} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer" role="menuitem">As PDF (.pdf)</a>
                    </div>
                )}
            </div>
            <button
                onClick={handleNewChat}
                disabled={!isGeminiApiKeyAvailable()}
                className="p-1.5 sm:p-2 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors flex items-center text-xs sm:text-sm disabled:opacity-50 group"
                title="Start New Chat & Clear History"
            >
                <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-white group-hover:scale-105 transition-transform" /> New Chat
            </button>
        </div>
      </header>
      
      {alertInfo && <div className="p-2 sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"><Alert alert={alertInfo} onDismiss={dismissAlert} /></div>}
       {apiKeyMissingAlertShown && !isGeminiApiKeyAvailable() && (
         <div className="m-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-40 border-l-4 border-red-600 dark:border-red-500 p-4 rounded-md shadow-lg">
            <div className="flex"> <div className="flex-shrink-0"><XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" /></div>
              <div className="ml-3"> <p className="text-sm font-semibold text-red-900 dark:text-red-200">Critical Error: Gemini API Key Missing</p> <p className="text-xs text-red-800 dark:text-red-300 mt-1">AI Chat functionalities are disabled. Please ensure the API_KEY is correctly set up.</p> 
              </div>
            </div>
          </div>
      )}

      {isGeminiApiKeyAvailable() && messages.filter(m => !m.id.startsWith('ai-error-')).length === 0 && !isLoading && (
        <div className="my-3 mx-3 p-4 sm:p-5 bg-sky-50 dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-lg shadow-lg flex items-start space-x-3 sm:space-x-4 animate-fadeInUp transition-colors duration-300">
          <div className="group p-1 -m-1 rounded-full hover:bg-sky-200 dark:hover:bg-slate-600 transition-colors duration-150 flex-shrink-0"> <InformationCircleIcon className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600 dark:text-sky-400 transition-transform duration-150 group-hover:scale-110" /></div>
          <div> <h2 className="font-semibold text-sky-700 dark:text-sky-300 font-kantumruy text-lg">សូមស្វាគមន៍មកកាន់ AI Khmer Chat!</h2> <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 mb-2">Here's how I can assist you today:</p>
            <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-200 space-y-1.5">
              <li>Answer your questions in English or Khmer.</li>
              <li>Analyze images you upload (PNG, JPG, GIF, WEBP) - I'll see them, but they won't be displayed in our chat.</li>
              <li>Help with coding: provide snippets, explain concepts, or suggest project structures. Run supported code snippets with OneCompiler!</li>
              <li>Brainstorm ideas or explore various topics with me. I can also search the web for up-to-date information and images.</li>
              <li>Practice English: I can help with grammar, vocabulary, and conversation practice.</li>
              <li>I remember our current conversation, so feel free to ask follow-up questions!</li>
              <li>Click highlighted <TechnicalTerm term="technical terms" explanation="Specialized vocabulary related to a specific field." explanationKm="ពាក្យ​ពេចន៍​ឯកទេស​ទាក់ទង​នឹង​វិស័យ​ជាក់លាក់។" /> or most other words for quick explanations and to hear them spoken.</li>
              <li>Click "New Chat" (trash icon) anytime to clear history and start fresh.</li>
            </ul></div></div>
      )}


      <div ref={chatMessagesListRef} className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {messages.map(msg => (
          <div key={msg.id} className={`flex group relative ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${!msg.isLoading || msg.text || editingMessageId === msg.id ? 'animate-fadeInUp' : ''}`}>
            <div className={`max-w-xl p-3 shadow-md ${
              msg.sender === 'user' 
                ? 'bg-primary dark:bg-primary-dark text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-xl rounded-tr-xl rounded-br-xl'
            } ${editingMessageId === msg.id ? 'w-full' : ''}`}>
              {renderMessageContent(msg)}
              {!(editingMessageId === msg.id) && !msg.isLoading && (
                <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-teal-100 dark:text-teal-300 opacity-80' : 'text-slate-400 dark:text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              {!(editingMessageId === msg.id) && !msg.isLoading && msg.text && ( 
                <div className={`absolute -top-2 ${msg.sender === 'user' ? '-left-2' : '-right-2'} sm:top-0 ${msg.sender === 'user' ? 'sm:-left-2' : 'sm:-right-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-0.5 bg-white dark:bg-slate-800 p-0.5 rounded-md shadow-md border border-slate-200 dark:border-slate-600 z-10`}>
                    <button onClick={() => handleCopyMessage(msg.text)} title="Copy message" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><CopyIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"/></button>
                    {navigator.share && <button onClick={() => handleShareMessage(msg.text)} title="Share message" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ShareIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"/></button>}
                    {msg.sender === 'user' && !editingMessageId && <button onClick={() => startEditing(msg)} title="Edit message" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><PencilSquareIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"/></button>}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="bg-white dark:bg-slate-800 p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        {selectedImage && !editingMessageId && (
          <div className="mb-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-between animate-fadeInUp">
            <div className="flex items-center">
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="w-10 h-10 rounded-md object-cover mr-2"/>
              <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[150px] sm:max-w-xs">{selectedImage.name}</span>
            </div>
            <button onClick={removeSelectedImage} className="p-1 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
              <XCircleIcon className="w-5 h-5"/>
            </button>
          </div>
        )}
        <div className="flex items-end space-x-2">
          <label htmlFor="imageUpload" className={`p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors ${editingMessageId ? 'opacity-50 cursor-not-allowed' : ''}`} title="Upload Image (PNG, JPG, GIF, WEBP)">
            <PhotoIcon className="w-6 h-6"/>
            <input type="file" id="imageUpload" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/gif, image/webp" className="hidden" disabled={!!editingMessageId || isLoading}/>
          </label>
          {(window.SpeechRecognition || window.webkitSpeechRecognition) && (
            <button onClick={toggleVoiceInput} title={isListening ? "Stop listening" : "Speak (Khmer or English)"} className={`p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isListening ? 'bg-red-100 dark:bg-red-700/50' : ''} ${editingMessageId ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!!editingMessageId || isLoading}>
              <MicrophoneIcon className="w-6 h-6" isListening={isListening}/>
            </button>
          )}
          <textarea
            ref={textareaRef}
            value={editingMessageId ? '' : userInput} 
            onChange={(e) => { if(!editingMessageId) setUserInput(e.target.value); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !editingMessageId) { e.preventDefault(); handleSendMessage(); }}}
            placeholder={editingMessageId ? "Editing message above..." : "Type or speak your message... (Shift+Enter for new line)"}
            className="flex-grow p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 resize-none leading-tight text-sm"
            rows={1}
            style={{minHeight: '44px', maxHeight: '120px'}}
            disabled={!isGeminiApiKeyAvailable() || isLoading || !!editingMessageId} 
          />
          <button 
            onClick={handleSendMessage} 
            disabled={isLoading || (!userInput.trim() && !selectedImage) || !isGeminiApiKeyAvailable() || !!editingMessageId} 
            className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md disabled:bg-slate-400 dark:disabled:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light transition-colors group"
            aria-label="Send message"
          >
            {isLoading ? <LoadingSpinner size="sm" color="text-white"/> : <PaperAirplaneIcon className="w-5 h-5"/>}
          </button>
        </div>
      </footer>

      {isOneCompilerModalOpen && oneCompilerUrl && (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-75 dark:bg-black dark:bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out animate-fadeInUp">
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <CodeBracketSquareIcon className="w-6 h-6 mr-2 text-primary dark:text-primary-light"/> {oneCompilerModalTitle}
              </h2>
              <button onClick={() => setIsOneCompilerModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <XCircleIcon className="w-7 h-7"/>
              </button>
            </div>
            <iframe
              src={oneCompilerUrl}
              title={oneCompilerModalTitle}
              className="w-full flex-grow border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-900"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals" 
            />
             <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Code execution is powered by <a href="https://onecompiler.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline dark:text-primary-light">OneCompiler</a>.
            </p>
          </div>
        </div>
      )}

      {isDynamicExplanationOpen && dynamicPopoverPosition && (
        <div
            ref={dynamicExplanationPopoverRef}
            role="tooltip"
            className="fixed z-[110] w-64 sm:w-72 p-3 text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 animate-fadeInUp transition-colors duration-300"
            style={{
                top: `${dynamicPopoverPosition.top}px`,
                left: `${dynamicPopoverPosition.left}px`,
                maxHeight: 'calc(100vh - 20px - ' + dynamicPopoverPosition.top + 'px)', 
                overflowY: 'auto',
            }}
        >
            <div className="flex justify-between items-center mb-1.5">
                <h4 className="font-semibold text-primary dark:text-primary-light flex items-center">
                    <LightbulbIcon className="w-4 h-4 mr-1.5 text-yellow-500 dark:text-yellow-400" />
                    {dynamicExplanationTerm}
                </h4>
                <button
                    onClick={(e) => { e.stopPropagation(); setIsDynamicExplanationOpen(false); }}
                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-0.5 rounded-full"
                    aria-label="Close explanation"
                >
                    <XCircleIcon className="w-5 h-5"/>
                </button>
            </div>
            {dynamicExplanationLoading ? (
                <div className="flex items-center justify-center py-2">
                    <LoadingSpinner size="sm" />
                </div>
            ) : (
                <p className="text-xs leading-relaxed font-kantumruy"> 
                    {dynamicExplanationContent}
                </p>
            )}
        </div>
      )}

    </div>
  );
};

export default PremiumPage;
