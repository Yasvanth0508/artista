import React, { useState, useEffect, useCallback } from 'react';
import { Product, Artist } from '../../types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import Icon from './Icon';
import { ICONS } from '../constants';

interface MainContentProps {
  products: Product[];
  isLoading: boolean;
  onViewArtist: (artist: Artist) => void;
  followedArtists: Set<string>;
  onToggleFollow: (artistId: string) => void;
  onOpenFilters: () => void;
  onOpenGallery: (product: Product) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
    products, isLoading, onViewArtist,
    likedProducts, onToggleLike, followedArtists, onToggleFollow, 
    onOpenFilters, onOpenReviews, onOpenGallery
}) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setPage(1);
    setDisplayedProducts(products.slice(0, itemsPerPage));
  }, [products]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 500) return;
    if (displayedProducts.length >= products.length) return;

    setPage(prevPage => {
        const nextPage = prevPage + 1;
        const newProducts = products.slice(0, nextPage * itemsPerPage);
        setDisplayedProducts(newProducts);
        return nextPage;
    });
  }, [displayedProducts.length, products]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (displayedProducts.length > 0) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {displayedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onViewArtist={onViewArtist}
                onToggleLike={onToggleLike}
                followedArtists={followedArtists}
                onToggleFollow={onToggleFollow}
                onOpenGallery={onOpenGallery}
              />
            ))}
          </div>
          {displayedProducts.length < products.length && (
            <div className="text-center py-10 text-on-surface-secondary">Loading more...</div>
          )}
        </>
      );
    }

    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-on-surface">No Artwork Found</h2>
        <p className="text-on-surface-secondary mt-2">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-on-surface">Discover Artwork</h1>
            <button 
                onClick={onOpenFilters} 
                className="lg:hidden flex items-center space-x-2 rounded-lg border border-surface-border bg-surface px-4 py-2 text-on-surface font-semibold shadow-sm hover:bg-surface-hover"
                aria-label="Open filters"
            >
                <Icon name={ICONS.filter} className="text-xl" />
                <span>Filters</span>
            </button>
        </div>
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;
