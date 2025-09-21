import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ArtistProfileModal from './components/ArtistProfileModal';
import ImageGalleryModal from './components/ImageGalleryModal';
import ProfileSettings from './components/ProfileSettings';
import EditProfileModal from './components/EditProfileModal';
import SellerDashboard from '@/components/ListArtwork';
import { Product, Filters, Artist, UserProfile, NewProductData } from '../types';
import { useToast } from './contexts/ToastContext';
import { dbService } from '@/services/db';

const BuyerDashboard: React.FC = () => {
  // Get context from Dashboard component
  const {
    products,
    setProducts,
    currentUser,
    setCurrentUser,
    followedArtists,
    setFollowedArtists,
    handleUpdateProfile,
  } = useOutletContext<{
    onSearch: (term: string) => void;
    products: Product[];
    setProducts: (fn: (p: Product[]) => Product[]) => void;
    currentUser: UserProfile | null;
    setCurrentUser: (user: UserProfile | null) => void;
    followedArtists: Set<string>;
    setFollowedArtists: (fn: (f: Set<string>) => Set<string>) => void;
    handleUpdateProfile: (user: UserProfile) => Promise<void>;
  }>();

  const [view, setView] = useState<'home' | 'profile' | 'seller'>('home');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);
  const [viewingArtist, setViewingArtist] = useState<Artist | null>(null);
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading is now handled globally
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  const [filters, setFilters] = useState<Filters>(() => {
    try {
      const savedFilters = localStorage.getItem('artisan_filters');
      return savedFilters ? JSON.parse(savedFilters) : {};
    } catch (error) {
      console.error('Error reading filters from localStorage', error);
      return {};
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('artisan_filters', JSON.stringify(filters));
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 750);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error saving filters to localStorage', error);
      setIsLoading(false);
    }
  }, [filters]);

  
  
  const handleToggleFollow = async (artistId: string) => {
    const newFollowed = new Set(followedArtists);
    const artist = products.find(p => p.artist.id === artistId)?.artist;
    if (newFollowed.has(artistId)) {
        newFollowed.delete(artistId);
        if (artist) addToast(`Unfollowed ${artist.name}`, "info");
    } else {
        newFollowed.add(artistId);
        if (artist) addToast(`Now following ${artist.name}!`, "success");
    }
    await dbService.setFollowedArtists(Array.from(newFollowed));
    setFollowedArtists(() => newFollowed);
  };

  const handleNavigate = (targetView: 'home' | 'profile' | 'seller') => {
    setView(targetView);
    // onNavigate(targetView); // This is now handled by the main Navbar
  };

  

  const handleViewArtist = (artist: Artist) => {
    setViewingArtist(artist);
  };

  const handleOpenGallery = (product: Product) => {
    setGalleryProduct(product);
  };


  const handleSaveArtwork = async (artworkData: NewProductData) => {
    if (!currentUser) {
        addToast("You must be logged in to sell art.", "error");
        return;
    }
    setIsLoading(true);
    const startTime = performance.now();
    try {
        const newProduct = await dbService.addProduct(artworkData, currentUser);
        setProducts(currentProducts => [newProduct, ...currentProducts]);
        
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        
        addToast(`Artwork listed successfully in ${duration}s!`, "success");
        handleNavigate('home'); // Navigate back home after listing
    } catch (error) {
        console.error("Failed to save artwork:", error);
        addToast("Could not list artwork. Please try again.", "error");
    } finally {
        setIsLoading(false);
    }
};

  const filteredProducts = useMemo(() => {
    let sortedProducts = [...products];

    // Prioritize followed artists' products
    sortedProducts.sort((a, b) => {
        const aFollowed = followedArtists.has(a.artist.id);
        const bFollowed = followedArtists.has(b.artist.id);
        if (aFollowed && !bFollowed) return -1;
        if (!aFollowed && bFollowed) return 1;
        return 0;
    });

    return sortedProducts.filter(product => {
      if (filters.rating && product.rating < filters.rating) {
        return false;
      }
      if (filters.priceRange) {
        if (filters.priceRange.min !== undefined && product.price < filters.priceRange.min) {
            return false;
        }
        if (filters.priceRange.max !== undefined && product.price > filters.priceRange.max) {
            return false;
        }
      }
      if(filters.artType && product.artType !== filters.artType) {
        return false;
      }
      if(filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          return product.title.toLowerCase().includes(searchTerm) ||
                 product.artist.name.toLowerCase().includes(searchTerm) ||
                 product.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      }
      return true;
    });
  }, [products, filters, followedArtists]);

  
  const userProducts = useMemo(() => {
    if (!currentUser) return [];
    return products.filter(p => p.artist.id === currentUser.id);
  }, [products, currentUser]);

  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
    // onSearch(term); // Global search is now handled in App.tsx
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <MainContent 
            products={filteredProducts} 
            isLoading={isLoading}
            onViewArtist={handleViewArtist}
            followedArtists={followedArtists}
            onToggleFollow={handleToggleFollow}
            onOpenFilters={() => setIsFilterSidebarOpen(true)}
            onOpenGallery={handleOpenGallery}
          />
        );
      
      case 'profile':
        return currentUser ? (
          <ProfileSettings
            user={currentUser}
            userProducts={userProducts}
            onEdit={() => setIsEditProfileOpen(true)}
            onNavigate={handleNavigate}
            followedArtists={followedArtists}
            onToggleFollow={handleToggleFollow}
            onOpenGallery={handleOpenGallery}
            onViewArtist={handleViewArtist}
          />
        ) : (
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-on-surface">Loading Profile...</h2>
                <p className="text-on-surface-secondary mt-2">Please wait while we load your profile data.</p>
              </div>
            </div>
          </div>
        );
      case 'seller':
        function onNavigate(arg0: string) {
          throw new Error('Function not implemented.');
        }

        return currentUser ? (
            <SellerDashboard
                onSave={handleSaveArtwork}
                onCancel={() => onNavigate('home')}
            />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="flex">
        {view === 'home' && (
            <Sidebar 
                filters={filters} 
                setFilters={setFilters}
                isOpen={isFilterSidebarOpen}
                onClose={() => setIsFilterSidebarOpen(false)}
                maxPrice={maxProductPrice}
            />
        )}
        {renderContent()}
      </div>
     
      {viewingArtist && (
        <ArtistProfileModal
          artist={viewingArtist}
          allProducts={products}
          onClose={() => setViewingArtist(null)}
          followedArtists={followedArtists}
          onToggleFollow={handleToggleFollow}
          onOpenGallery={handleOpenGallery}
        />
      )}
      {galleryProduct && (
        <ImageGalleryModal
          product={galleryProduct}
          onClose={() => setGalleryProduct(null)}
        />
      )}
      {isEditProfileOpen && currentUser && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
