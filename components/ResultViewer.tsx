
import React, { useState, useRef, useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultViewerProps {
  originalImage: string;
  processedImage: string;
  imageName: string;
  onStartOver: () => void;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ originalImage, processedImage, imageName, onStartOver }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    const nameParts = imageName.split('.');
    const extension = nameParts.pop();
    const name = nameParts.join('.');
    link.download = `${name}-aethercanvas.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <div ref={containerRef} className="relative w-full max-w-4xl aspect-auto overflow-hidden rounded-2xl shadow-2xl bg-gray-200 dark:bg-gray-800">
        <img src={originalImage} alt="Original" className="w-full h-auto" />
        <div 
          className="absolute top-0 left-0 h-full w-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img src={processedImage} alt="Processed" className="w-full h-auto absolute top-0 left-0" />
        </div>
        <div 
          className="absolute top-0 h-full w-1.5 bg-white/80 cursor-ew-resize backdrop-blur-sm"
          style={{ left: `calc(${sliderPosition}% - 3px)` }}
        >
         <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
          </div>
        </div>
        <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-full cursor-ew-resize opacity-0"
            aria-label="Image comparison slider"
        />
      </div>
       <div className="flex items-center space-x-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
        >
          <DownloadIcon className="w-6 h-6" />
          Download
        </button>
        <button
          onClick={onStartOver}
          className="px-6 py-3 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};
