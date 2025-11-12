
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  upscaleFactor: number;
  setUpscaleFactor: (factor: number) => void;
  creativity: number;
  setCreativity: (creativity: number) => void;
  isProcessing: boolean;
  error: string | null;
  onSubmit: () => void;
  hasImage: boolean;
}

const upscaleOptions = [2, 4, 8, 16];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  upscaleFactor,
  setUpscaleFactor,
  creativity,
  setCreativity,
  isProcessing,
  error,
  onSubmit,
  hasImage,
}) => {
  return (
    <div className="w-full md:max-w-md lg:max-w-sm p-6 space-y-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Transformation Prompt
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={4}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500 transition"
          placeholder="e.g., 'reimagine as a cyberpunk character...'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upscale Factor
        </label>
        <div className="grid grid-cols-4 gap-2">
          {upscaleOptions.map((factor) => (
            <button
              key={factor}
              onClick={() => setUpscaleFactor(factor)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                upscaleFactor === factor
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {factor}x
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="creativity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Creativity: <span className="font-bold text-purple-600 dark:text-purple-400">{creativity}</span>
        </label>
        <input
          id="creativity"
          type="range"
          min="0"
          max="100"
          value={creativity}
          onChange={(e) => setCreativity(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      <div className="pt-4">
        <button
          onClick={onSubmit}
          disabled={isProcessing || !hasImage}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Magic...
            </>
          ) : (
            <>
              <SparklesIcon className="w-6 h-6" />
              Process Image
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded-lg" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      {!hasImage && (
         <div className="p-3 text-sm text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg" role="alert">
          Please upload an image to begin.
        </div>
      )}
    </div>
  );
};
