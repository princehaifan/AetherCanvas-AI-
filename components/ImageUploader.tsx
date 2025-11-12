
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);


  return (
    <div 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative w-full h-full min-h-[400px] flex flex-col justify-center items-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300
        ${isDragging ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/20'}`}
    >
      <div className="text-center space-y-4 text-gray-500 dark:text-gray-400">
        <UploadIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
        <p className="text-lg font-semibold">Drag & drop an image here</p>
        <p>or</p>
        <label htmlFor="file-upload" className="cursor-pointer inline-block px-6 py-2 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 dark:focus-within:ring-offset-gray-900">
          Browse Files
        </label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
        <p className="text-xs mt-4">Supports: JPG, PNG, WebP</p>
      </div>
    </div>
  );
};
