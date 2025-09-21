import React, { useState, useEffect } from 'react';
import { UserProfile, Product, Artist } from '../../types';
import EditProfileModal from './EditProfileModal';
import { dbService } from '@/services/db';

interface ProfileSettingsProps {
  userProducts: Product[];
  onNavigate: (view: 'home' | 'profile' | 'seller') => void;
  followedArtists: Set<string>;
  onToggleFollow: (artistId: string) => void;
  onOpenGallery: (product: Product) => void;
  onViewArtist: (artist: Artist) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  onEdit,
  userProducts,
  onNavigate,
  followedArtists,
  onToggleFollow,
  onOpenGallery,
  onViewArtist,
}) => {
  if (!user) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="text-center text-on-surface-secondary">Loading profile...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface rounded-lg shadow-lg border border-surface-border p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
            <img
              src={user.avatarUrl || 'https://picsum.photos/seed/user/200/200'}
              alt={user.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/50"
            />
            <div className="flex-grow mt-4 sm:mt-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                  {user.name || 'Unnamed User'}
                </h1>
                <button
                  onClick={onEdit}
                  className="mt-2 sm:mt-0 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              <p className="text-on-surface-secondary mt-2">
                {user.phone || 'No phone number provided'}
              </p>
              <div className="mt-4">
                <h2 className="font-semibold text-on-surface">Bio</h2>
                <p className="text-on-surface-secondary mt-1 whitespace-pre-wrap">
                  {user.bio || 'No bio provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSettings;
