
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ControlPanel } from './components/ControlPanel';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { useTheme } from './hooks/useTheme';
import { ImageData } from './types';
import { fileToImageData } from './utils/fileUtils';
import { processImageWithGemini } from './services/geminiService';


const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
  const [processedImageURL, setProcessedImageURL] = useState<string | null>(null);
  
  const [prompt, setPrompt] = useState<string>('Make this image breathtakingly beautiful, cinematic, and hyper-realistic.');
  const [upscaleFactor, setUpscaleFactor] = useState<number>(4);
  const [creativity, setCreativity] = useState<number>(75);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      const imageData = await fileToImageData(file);
      setOriginalImage(imageData);
      setOriginalImageURL(URL.createObjectURL(file));
      setProcessedImageURL(null); // Clear previous result
    } catch (e) {
      setError('Failed to read the image file.');
      console.error(e);
    }
  }, []);

  const handleProcessImage = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setProcessedImageURL(null);

    try {
      const resultImageUrl = await processImageWithGemini(originalImage, prompt, upscaleFactor, creativity);
      setProcessedImageURL(resultImageUrl);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during processing.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, prompt, upscaleFactor, creativity]);

  const handleStartOver = useCallback(() => {
    setOriginalImage(null);
    setOriginalImageURL(null);
    setProcessedImageURL(null);
    setError(null);
    setIsProcessing(false);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex-grow w-full md:w-2/3">
            {processedImageURL && originalImageURL && originalImage ? (
               <ResultViewer 
                 originalImage={originalImageURL} 
                 processedImage={processedImageURL} 
                 imageName={originalImage.name}
                 onStartOver={handleStartOver} 
               />
            ) : (
              <div className="relative w-full">
                <ImageUploader onImageUpload={handleImageUpload} />
                {originalImageURL && !isProcessing && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center p-4">
                    <img src={originalImageURL} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                  </div>
                )}
                 {isProcessing && originalImageURL && (
                   <div className="absolute inset-0 bg-black/80 rounded-2xl flex flex-col items-center justify-center p-4 transition-opacity duration-300">
                      <img src={originalImageURL} alt="Processing" className="max-h-full max-w-full object-contain rounded-lg opacity-20 blur-sm" />
                       <div className="absolute text-center text-white space-y-4">
                          <svg className="animate-spin mx-auto h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-xl font-semibold">Processing Magic...</p>
                          <p className="text-sm">This can take a few moments.</p>
                       </div>
                   </div>
                 )}
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/3 md:sticky md:top-24">
            <ControlPanel 
              prompt={prompt}
              setPrompt={setPrompt}
              upscaleFactor={upscaleFactor}
              setUpscaleFactor={setUpscaleFactor}
              creativity={creativity}
              setCreativity={setCreativity}
              isProcessing={isProcessing}
              error={error}
              onSubmit={handleProcessImage}
              hasImage={!!originalImage}
            />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
