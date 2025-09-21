import React, { useEffect } from 'react';
import { Product } from '../../types';
import Icon from './Icon';
import { ICONS } from '../constants';

interface ImageGalleryModalProps {
  product: Product;
  onClose: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ product, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!product.images || product.images.length === 0) {
    return null; // Or a placeholder
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
    >
      {/* Top Bar with Title and Close Button */}
      <div 
        className="w-full max-w-7xl flex justify-between items-center p-4 text-white absolute top-0"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h2 id="gallery-title" className="text-xl font-bold">{product.title}</h2>
          <p className="text-sm opacity-80">by {product.artist.name}</p>
        </div>
        <button onClick={onClose} aria-label="Close gallery" className="p-2 rounded-full hover:bg-white/20">
          <Icon name={ICONS.close} className="text-3xl" />
        </button>
      </div>

      {/* Main Content: Image */}
      <div 
        className="w-full h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-[80vw] max-h-[85vh] flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;