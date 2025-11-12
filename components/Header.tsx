
import React from 'react';
import { Theme } from '../types';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-30 w-full p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md shadow-sm dark:shadow-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
           <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
           <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AetherCanvas AI</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          aria-label="Toggle theme"
        >
          {theme === Theme.LIGHT ? (
            <MoonIcon className="w-6 h-6" />
          ) : (
            <SunIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </header>
  );
};
