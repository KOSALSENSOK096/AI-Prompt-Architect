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
import { Content, Part, GenerateContentResponse } from '@google/generative-ai';
import { SPEECH_RECOGNITION_CONFIG } from '../config/api';
// @ts-ignore - html2pdf.js is imported via importmap and might not have types
import html2pdf from 'html2pdf.js';
import ClickableWord from '../components/ClickableWord'; 
import LightbulbIcon from '../components/icons/LightbulbIcon'; 
import PencilSquareIcon from '../components/icons/PencilSquareIcon';
import ExternalLinkIcon from '../components/icons/ExternalLinkIcon'; 

// ... rest of the file remains unchanged, but update:
// 1. navigator.share check to navigator.share?.()
// 2. window.SpeechRecognition check to use SPEECH_RECOGNITION_CONFIG.isSupported 