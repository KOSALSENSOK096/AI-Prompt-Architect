import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AlertMessage } from '../types';
import { 
    isGeminiApiKeyAvailable, 
    generateImageEnhancementPromptFromImageAndText, 
    geminiAiInstance, 
    GEMINI_API_MODEL_IMAGE_GENERATION,
    generatePatchSpecificEnhancementPrompt 
} from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ImageEnhanceIcon from '../components/icons/ImageEnhanceIcon'; // Using the new icon

// --- SVG Icons for UI ---
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
const DownloadIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
// --- End SVG Icons ---


const LOUPE_SIZE = 150; // px, display size of the loupe
const LOUPE_CROP_SIZE = 75; // px, size of the area to crop from original image for analysis, not direct image generation size
const DEBOUNCE_DELAY = 300; // ms

const ImageEnhancerPage: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [originalImageBase64, setOriginalImageBase64] = useState<string | null>(null);
  const [originalImageMimeType, setOriginalImageMimeType] = useState<string | null>(null);
  
  const [userInstructions, setUserInstructions] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<'generatingPrompt' | 'generatingImage' | null>(null);
  const [alertInfo, setAlertInfo] = useState<AlertMessage | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiKeyMissingAlertShown, setApiKeyMissingAlertShown] = useState<boolean>(!isGeminiApiKeyAvailable());

  // Loupe State
  const [isLoupeVisible, setIsLoupeVisible] = useState<boolean>(false);
  const [loupePosition, setLoupePosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [loupeContentUrl, setLoupeContentUrl] = useState<string | null>(null);
  const [isLoupeLoading, setIsLoupeLoading] = useState<boolean>(false);
  const originalImageRef = useRef<HTMLImageElement>(null); 
  const debounceTimeoutRef = useRef<number | null>(null);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setAlertInfo({ id: Date.now(), type: 'error', message: 'Image size should not exceed 4MB.' });
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
        setAlertInfo({ id: Date.now(), type: 'error', message: 'Invalid file type. Please upload PNG, JPG, GIF, or WEBP.' });
        return;
      }

      setOriginalImageFile(file);
      setOriginalImageMimeType(file.type);
      setGeneratedImageUrl(null); 

      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setOriginalImagePreview(resultStr);
        setOriginalImageBase64(resultStr.split(',')[1] || null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setOriginalImageFile(null);
    setOriginalImagePreview(null);
    setOriginalImageBase64(null);
    setOriginalImageMimeType(null);
    setIsLoupeVisible(false); 
    setLoupeContentUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitEnhancementRequest = async () => {
    if (!isGeminiApiKeyAvailable()) {
      setAlertInfo({ id: Date.now(), type: 'error', message: 'Gemini API key is not configured. Cannot enhance image.' });
      if(!apiKeyMissingAlertShown) setApiKeyMissingAlertShown(true);
      return;
    }
    if (!originalImageBase64 || !originalImageMimeType) {
      setAlertInfo({ id: Date.now(), type: 'info', message: 'Please upload an image to enhance.' });
      return;
    }

    setIsLoading(true);
    setAlertInfo(null);
    setGeneratedImageUrl(null);

    try {
      setLoadingStep('generatingPrompt');
      const enhancementPrompt = await generateImageEnhancementPromptFromImageAndText(
        originalImageBase64,
        originalImageMimeType,
        userInstructions
      );

      setLoadingStep('generatingImage');
      if (!geminiAiInstance) throw new Error("Gemini AI instance not available.");
      
      const imageResponse = await geminiAiInstance.models.generateImages({
        model: GEMINI_API_MODEL_IMAGE_GENERATION,
        prompt: enhancementPrompt,
        config: { numberOfImages: 1, outputMimeType: 'image/png' },
      });

      if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0 && imageResponse.generatedImages[0].image.imageBytes) {
        const base64EnhancedImage = imageResponse.generatedImages[0].image.imageBytes;
        setGeneratedImageUrl(`data:image/png;base64,${base64EnhancedImage}`);
        setAlertInfo({ id: Date.now(), type: 'success', message: 'Image enhanced successfully!' });
      } else {
        throw new Error('AI did not return an enhanced image.');
      }

    } catch (error: any) {
      console.error("Image Enhancement Error:", error);
      setAlertInfo({ id: Date.now(), type: 'error', message: error.message || 'Failed to enhance image.' });
    } finally {
      setIsLoading(false);
      setLoadingStep(null);
    }
  };
  
  const handleDownloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `enhanced_image_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertInfo({ id: Date.now(), type: 'info', message: 'Image download started.' });
  };

  const dismissAlert = () => setAlertInfo(null);

  // --- Loupe Logic ---
  const fetchAndDisplayLoupeContent = useCallback(async (mouseX: number, mouseY: number) => {
    if (!originalImageRef.current || !originalImagePreview || !geminiAiInstance) return;

    setIsLoupeLoading(true);
    setLoupeContentUrl(null); // Clear previous content

    try {
      const imgElement = originalImageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      // Calculate crop coordinates based on natural image dimensions
      const rect = imgElement.getBoundingClientRect();
      const naturalWidth = imgElement.naturalWidth;
      const naturalHeight = imgElement.naturalHeight;
      
      // Mouse position relative to the displayed image
      const displayX = mouseX - rect.left;
      const displayY = mouseY - rect.top;

      // Convert display coordinates to natural image coordinates
      const naturalMouseX = (displayX / rect.width) * naturalWidth;
      const naturalMouseY = (displayY / rect.height) * naturalHeight;
      
      const cropSizeForAnalysis = LOUPE_CROP_SIZE; // The size of the patch we send to AI for analysis
      let sx = naturalMouseX - cropSizeForAnalysis / 2;
      let sy = naturalMouseY - cropSizeForAnalysis / 2;
      
      // Clamp crop coordinates to be within image bounds
      sx = Math.max(0, Math.min(sx, naturalWidth - cropSizeForAnalysis));
      sy = Math.max(0, Math.min(sy, naturalHeight - cropSizeForAnalysis));
      
      canvas.width = cropSizeForAnalysis;
      canvas.height = cropSizeForAnalysis;

      // Draw the cropped section of the original image onto the canvas
      ctx.drawImage(imgElement, sx, sy, cropSizeForAnalysis, cropSizeForAnalysis, 0, 0, cropSizeForAnalysis, cropSizeForAnalysis);
      
      const patchBase64 = canvas.toDataURL(originalImageMimeType || 'image/png').split(',')[1];
      if (!patchBase64) throw new Error("Failed to get base64 from patch.");

      const patchPrompt = await generatePatchSpecificEnhancementPrompt(patchBase64, originalImageMimeType || 'image/png', userInstructions);
      
      // Generate a new image for the loupe based on the patch-specific prompt.
      // The Imagen API doesn't take width/height in config directly for output size.
      // The prompt itself should imply the desired detail level for this small patch.
      // The resulting image will be displayed within the LOUPE_SIZE x LOUPE_SIZE area.
      const patchImageResponse = await geminiAiInstance.models.generateImages({
        model: GEMINI_API_MODEL_IMAGE_GENERATION,
        prompt: patchPrompt,
        config: { numberOfImages: 1, outputMimeType: 'image/png' }, 
      });

      if (patchImageResponse.generatedImages && patchImageResponse.generatedImages.length > 0 && patchImageResponse.generatedImages[0].image.imageBytes) {
        setLoupeContentUrl(`data:image/png;base64,${patchImageResponse.generatedImages[0].image.imageBytes}`);
      } else {
        throw new Error("AI did not return an enhanced patch.");
      }

    } catch (error: any) {
      console.error("Loupe enhancement error:", error);
      // Optionally set an error state for the loupe itself
      setLoupeContentUrl(null); // Or a placeholder error image
    } finally {
      setIsLoupeLoading(false);
    }
  }, [originalImagePreview, originalImageMimeType, userInstructions]);

  const handleMouseMoveOnImage = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!originalImagePreview) return;

    const rect = event.currentTarget.getBoundingClientRect(); // Use currentTarget if attaching to container
    const x = event.clientX - LOUPE_SIZE / 2; // Center loupe on cursor
    const y = event.clientY - LOUPE_SIZE / 2;
    setLoupePosition({ top: y, left: x });
    setIsLoupeVisible(true);


    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = window.setTimeout(() => {
        // Pass mouse coordinates relative to the viewport
        fetchAndDisplayLoupeContent(event.clientX, event.clientY);
    }, DEBOUNCE_DELAY);
  };

  const handleMouseLeaveImage = () => {
    setIsLoupeVisible(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Do not clear loupeContentUrl immediately to avoid flicker if mouse re-enters quickly
    // Or set it to null after a short delay if desired
  };
  
  useEffect(() => {
    return () => { // Cleanup timeout on unmount
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      <div className="text-center mb-10">
        <ImageEnhanceIcon className="w-16 h-16 text-primary dark:text-primary-light mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">AI Image Enhancer</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Upload a vague image, provide instructions, and let AI generate a new, clearer version.
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-kantumruy">
          ផ្ទុក​រូបភាព​មិន​ច្បាស់​ បញ្ចូល​ការណែនាំ​ ហើយ​ឲ្យ AI បង្កើត​រូបភាព​ថ្មី​ដែល​កាន់តែ​ច្បាស់​។
        </p>
      </div>

      {alertInfo && <div className="mb-6"><Alert alert={alertInfo} onDismiss={dismissAlert} /></div>}
      
      {apiKeyMissingAlertShown && !isGeminiApiKeyAvailable() && (
         <div className="mb-6 bg-red-100 dark:bg-red-900 dark:bg-opacity-40 border-l-4 border-red-600 dark:border-red-500 p-4 rounded-md shadow-lg">
            <div className="flex"> <div className="flex-shrink-0"><XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" /></div>
              <div className="ml-3"> 
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">Critical Error: Gemini API Key Missing</p> 
                <p className="text-xs text-red-800 dark:text-red-300 mt-1">Image Enhancer is disabled. Please ensure the VITE_GOOGLE_API_KEY is correctly set up.</p> 
              </div>
            </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-2xl rounded-lg p-6 sm:p-8 space-y-6 transition-colors duration-300">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              1. Upload Your Vague Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <div className="flex text-sm text-slate-600 dark:text-slate-300">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 focus-within:ring-primary"
                  >
                    <span>Upload a file</span>
                    <input id="image-upload" name="image-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg, image/gif, image/webp" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF, WEBP up to 4MB</p>
              </div>
            </div>
            {originalImagePreview && (
              <div 
                className="mt-4 relative group"
                onMouseMove={handleMouseMoveOnImage}
                onMouseLeave={handleMouseLeaveImage}
              >
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Your uploaded image (hover for loupe):</p>
                <img 
                    ref={originalImageRef}
                    src={originalImagePreview} 
                    alt="Original vague" 
                    className="rounded-md max-h-60 w-auto mx-auto shadow-md border border-slate-200 dark:border-slate-700 cursor-crosshair" 
                    crossOrigin="anonymous" // Important for canvas operations if image is from different origin (though here it's a data URL)
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 m-1 p-1 bg-slate-700 bg-opacity-50 text-white rounded-full hover:bg-red-500 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              2. Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows={3}
              value={userInstructions}
              onChange={(e) => setUserInstructions(e.target.value)}
              placeholder="e.g., Make the face clearer, improve the lighting, add more details to the background. Recreate this in a photorealistic style."
              className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:text-sm"
            />
             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Describe how you'd like the AI to re-imagine and clarify the image.</p>
          </div>

          <button
            type="button"
            onClick={handleSubmitEnhancementRequest}
            disabled={isLoading || !originalImageBase64 || !isGeminiApiKeyAvailable()}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="text-white" />
            ) : (
              <>
                <ImageEnhanceIcon className="w-5 h-5 mr-2" />
                Enhance Image
              </>
            )}
          </button>
           {isLoading && loadingStep && (
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 animate-pulse">
                {loadingStep === 'generatingPrompt' ? 'Step 1/2: Analyzing image and instructions...' : 'Step 2/2: Generating new clear image...'}
            </p>
          )}
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-2xl rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px] transition-colors duration-300">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 self-start">Generated Clear Image:</h2>
          {generatedImageUrl ? (
            <div className="w-full text-center">
              <img 
                src={generatedImageUrl} 
                alt="Enhanced" 
                className="max-w-full max-h-[400px] rounded-md shadow-lg border border-slate-200 dark:border-slate-700 mx-auto"
              />
              <button
                onClick={handleDownloadImage}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <DownloadIcon className="w-5 h-5 mr-2"/>
                Download Image
              </button>
            </div>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500 p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md w-full">
              <PhotoIcon className="mx-auto h-16 w-16 opacity-50" />
              <p className="mt-2 text-sm">Your enhanced image will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Loupe Element */}
      {isLoupeVisible && originalImagePreview && (
        <div
            style={{
                position: 'fixed',
                top: `${loupePosition.top}px`,
                left: `${loupePosition.left}px`,
                width: `${LOUPE_SIZE}px`,
                height: `${LOUPE_SIZE}px`,
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                pointerEvents: 'none', // Allow mouse events to pass through to image underneath for continuous tracking
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(200,200,200,0.5)' // Fallback background
            }}
        >
            {isLoupeLoading ? (
                <LoadingSpinner size="sm" color="text-primary"/>
            ) : loupeContentUrl ? (
                <img 
                    src={loupeContentUrl} 
                    alt="Enhanced Loupe" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            ) : (
                 <div className="text-xs text-slate-600">Loading...</div> // Or some placeholder
            )}
        </div>
      )}
    </div>
  );
};

export default ImageEnhancerPage;