// src/components/components/Header.tsx
import React from 'react';

interface HeaderProps {
  onAnalyzeClick: () => void;
  onAddArtClick: () => void;
  onViewArt: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAnalyzeClick, onAddArtClick, onViewArt }) => {
  return (
    <header className="flex flex-col items-center justify-center p-8 ">
      <h1 className="text-xl italic text-gray-700 font-serif mb-6 text-center max-w-2xl">
        "Art is not what you see, but what you make others see." – Edgar Degas
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={onAnalyzeClick}
          className="bg-teal-600 text-white font-medium py-3 px-6 rounded-md shadow-lg hover:bg-teal-700 transition-colors"
        >
          Analyze the Trend
        </button>
        <button
          onClick={onAddArtClick}
          className="bg-teal-600 text-white font-medium py-3 px-6 rounded-md shadow-lg hover:bg-teal-700 transition-colors"
        >
          Add Your Art
        </button>
        <button
          onClick={onViewArt}
          className="bg-teal-600 text-white font-medium py-3 px-6 rounded-md shadow-lg hover:bg-teal-700 transition-colors"
        >
          View My Posts
        </button>
      </div>
    </header>
  );
};