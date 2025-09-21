import React from 'react';
import { Artist, Product } from '../../types';
import Icon from './Icon';
import { ICONS } from '../constants';
import ProductCard from './ProductCard';

interface ArtistProfileModalProps {
  artist: Artist;
  allProducts: Product[];
  onClose: () => void;
  followedArtists: Set<string>;
  onToggleFollow: (artistId: string) => void;
  onOpenGallery: (product: Product) => void;
}

const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  artist, allProducts, onClose,followedArtists, onToggleFollow, onOpenGallery,
}) => {
  const artistProducts = allProducts.filter(p => p.artist.id === artist.id);
  const isFollowed = followedArtists.has(artist.id);
  const isOwnProfile = artist.id === 'artist-current-user';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="artist-profile-title"
    >
      <div
        className="bg-surface rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-surface-border flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-4">
            <img src={artist.avatarUrl} alt={artist.name} className="w-20 h-20 rounded-full" />
            <div>
              <h2 id="artist-profile-title" className="text-2xl font-bold text-on-surface">{artist.name}</h2>
              <p className="text-on-surface-secondary">{artist.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
             {artist.phone && (
                <a 
                    href={`tel:${artist.phone.replace(/\s/g, '')}`} 
                    className="flex items-center space-x-2 font-semibold py-2 px-5 rounded-full border border-secondary text-secondary hover:bg-secondary/10 transition-colors duration-200"
                    aria-label={`Call ${artist.name}`}
                >
                    <Icon name={ICONS.call} className="text-xl" />
                    <span className="hidden sm:inline">Contact</span>
                </a>
            )}
            {!isOwnProfile && (
              <button
                  onClick={() => onToggleFollow(artist.id)}
                  aria-label={isFollowed ? `Unfollow ${artist.name}` : `Follow ${artist.name}`}
                  className={`flex items-center space-x-2 font-semibold py-2 px-5 rounded-full border transition-colors duration-200 ${
                      isFollowed
                      ? 'bg-primary text-white border-primary'
                      : 'bg-transparent text-primary border-primary hover:bg-primary/10'
                  }`}
              >
                  <Icon name={isFollowed ? ICONS.check : ICONS.add} className="text-xl" />
                  <span className="hidden sm:inline">{isFollowed ? 'Following' : 'Follow'}</span>
              </button>
            )}
            <button onClick={onClose} aria-label="Close modal" className="p-1 rounded-full hover:bg-surface-hover">
              <Icon name={ICONS.close} className="text-2xl text-on-surface-secondary hover:text-on-surface" />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {artist.bio && (
                <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-on-surface">About the Artist</h3>
                    <p className="text-on-surface-secondary">{artist.bio}</p>
                </div>
            )}
            
            <div>
                <h3 className="font-semibold text-lg mb-4 text-on-surface">Artwork by {artist.name} ({artistProducts.length})</h3>
                {artistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {artistProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                followedArtists={followedArtists}
                                onToggleFollow={onToggleFollow}
                                onOpenGallery={onOpenGallery}
                                hideFollowButton={true}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-on-surface-secondary text-center py-8">This artist has not listed any products yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileModal;