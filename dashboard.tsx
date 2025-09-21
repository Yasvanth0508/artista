import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { Product, UserProfile, NewProductData } from './types';

const Dashboard: React.FC = () => {
  // Receive the full context from AppContent
  const context = useOutletContext<{
    products: Product[];
    setProducts: (fn: (p: Product[]) => Product[]) => void;
    currentUser: UserProfile | null;
    setCurrentUser: (user: UserProfile | null) => void;
    likedProducts: Set<string>;
    setLikedProducts: (fn: (l: Set<string>) => Set<string>) => void;
    followedArtists: Set<string>;
    setFollowedArtists: (fn: (f: Set<string>) => Set<string>) => void;
    handleUpdateProfile: (user: UserProfile) => Promise<void>;
  }>();

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Nested routes render here, passing the state via context */}
      {/* Pass the full context down to child routes */}
      <Outlet context={context} />
    </div>
  );
};

export default Dashboard;