import { useState, useEffect } from 'react';
import { dbService } from '@/services/db';
import { Product } from '@/types';

export const useArtworks = () => {
  const [artworks, setArtworks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await dbService.getProducts();
      setArtworks(products);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch artworks');
      console.error('Error fetching artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addArtwork = (newArtwork: Product) => {
    setArtworks(prev => [newArtwork, ...prev]);
  };

  const updateArtwork = (updatedArtwork: Product) => {
    setArtworks(prev => 
      prev.map(artwork => 
        artwork.id === updatedArtwork.id ? updatedArtwork : artwork
      )
    );
  };

  const deleteArtwork = (artworkId: string) => {
    setArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  return {
    artworks,
    loading,
    error,
    refetch: fetchArtworks,
    addArtwork,
    updateArtwork,
    deleteArtwork
  };
};
