import React, { useState, useEffect } from 'react';
import { Product, Language, Artist } from '../../types';
import { ICONS } from '../constants';
import Icon from './Icon';
import { translateText } from '../../services/geminiService';
import { Timestamp } from "firebase/firestore";
import { NewProductData } from "../../types";

interface ProductCardProps {
  product: NewProductData;
  onViewArtist?: (artist: Artist) => void;
  isLiked: boolean;
  onToggleLike: (productId: string) => void;
  followedArtists: Set<string>;
  onToggleFollow: (artistId: string) => void;
  onOpenReviews: (product: Product) => void;
  onOpenGallery: (product: Product) => void;
  hideFollowButton?: boolean;
}


const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(5)].map((_, i) => {
        if (rating >= i + 1) {
          // full star
          return <Icon key={i} name={ICONS.star} isFilled={true} className="text-sm text-yellow-400" />;
        } else if (rating >= i + 0.5) {
          // half star
          return <Icon key={i} name={ICONS.starHalf} isFilled={true} className="text-sm text-yellow-400" />;
        } else {
          // empty star
          return <Icon key={i} name={ICONS.star} isFilled={false} className="text-sm text-star-inactive" />;
        }
      })}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({
  product, onViewArtist, isLiked, onToggleLike,
  followedArtists, onToggleFollow, onOpenReviews, onOpenGallery,
  hideFollowButton = false
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState<Language>(Language.EN);
  const [displayTitle, setDisplayTitle] = useState(product.title);
  const [displayDescription, setDisplayDescription] = useState(product.description);
  const [isExpanded, setIsExpanded] = useState(false);

  const isFollowed = followedArtists.has(product.artist.id);
  const isOwnProduct = product.artist.id === 'artist-current-user';

  useEffect(() => {
    setDisplayTitle(product.title);
    setDisplayDescription(product.description);
    setTargetLang(Language.EN);
    setIsExpanded(false);
  }, [product]);

  useEffect(() => {
    const translateContent = async () => {
      if (targetLang === Language.EN) {
        setDisplayTitle(product.title);
        setDisplayDescription(product.description);
        return;
      }

      setIsTranslating(true);
      try {
        const [translatedTitle, translatedDescription] = await Promise.all([
          translateText(product.title, targetLang),
          translateText(product.description, targetLang)
        ]);
        setDisplayTitle(translatedTitle);
        setDisplayDescription(translatedDescription);
      } catch (error) {
        console.error("Translation failed", error);
        setDisplayTitle(product.title);
        setDisplayDescription("Translation failed. Please try again.");
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [targetLang, product.title, product.description]);

  const DESCRIPTION_LIMIT = 120;
  const isLongDescription = displayDescription.length > DESCRIPTION_LIMIT;
  const formatValue = (value: any) => {
    if (value === undefined || value === null) return "";
    if (typeof value === "string" || typeof value === "number") return value;
    if (value instanceof Timestamp) return value.toDate().toLocaleString(); // Firestore timestamp
    if (Array.isArray(value)) return value.join(", "); // Arrays
    if (typeof value === "object") return JSON.stringify(value); // Objects
    return String(value);
  };
  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-lg border border-surface-border flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => onViewArtist && onViewArtist(product.artist)}
          className="flex items-center space-x-3 text-left hover:opacity-80 transition-opacity"
          aria-label={`View profile for ${product.artist.name}`}
        >
          <img src={product.artist.avatarUrl} alt={product.artist.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-on-surface text-sm">{product.artist.name}</p>
            <p className="text-xs text-on-surface-secondary">{formatValue(product.postedAt)}</p>
          </div>
        </button>
        {!hideFollowButton && !isOwnProduct && (
          <button
            onClick={() => onToggleFollow(product.artist.id)}
            aria-label={isFollowed ? `Unfollow ${product.artist.name}` : `Follow ${product.artist.name}`}
            className={`flex items-center space-x-2 text-xs font-semibold py-1 px-3 rounded-full border transition-colors duration-200 ${isFollowed
                ? 'bg-primary text-white border-primary'
                : 'bg-transparent text-primary border-primary hover:bg-primary/10'
              }`}
          >
            <Icon name={isFollowed ? ICONS.check : ICONS.add} className="text-sm" />
            <span>{isFollowed ? 'Following' : 'Follow'}</span>
          </button>
        )}
      </div>

      <button
        className="w-full block"
        onClick={() => onOpenGallery(product)}
        aria-label={`View larger image for ${product.title}`}
      >
        <img src={product.images[0]} alt={product.title} className="w-full object-cover aspect-[4/3]" />
      </button>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-lg font-bold text-on-surface mt-3">
              {product.currency}{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>



        <div className="mt-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <h2 className="font-bold text-base text-on-surface flex-grow">{displayTitle}</h2>
            <div className="flex-shrink-0">
              <label htmlFor={`lang-select-${product.id}`} className="sr-only">Translate description to</label>
              <select
                id={`lang-select-${product.id}`}
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as Language)}
                className="text-xs bg-background px-2 py-1 rounded border-none focus:ring-1 focus:ring-primary text-on-surface"
                disabled={isTranslating}
              >
                {Object.values(Language).map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
          </div>
          <div className="text-xs text-on-surface-secondary mt-1 flex-grow">
            {isTranslating ? (
              <p className="text-info italic">Translating...</p>
            ) : (
              <p>
                {isExpanded ? displayDescription : `${displayDescription.substring(0, DESCRIPTION_LIMIT)}${isLongDescription ? '...' : ''}`}
                {isLongDescription && (
                  <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary font-semibold ml-1 hover:underline whitespace-nowrap">
                    {isExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </p>
            )}
          </div>
          <div className="mt-2 mb-2">
            <p className="text-xs font-semibold text-on-surface-secondary">
              Art Type: <span className="font-normal">{product.artType}</span>
            </p>
          </div>
          <div className="mt-2">
            {product.tags.map(tag => (
              <span key={tag} className="inline-block bg-background rounded-full px-3 py-1 text-xs font-semibold text-on-surface-secondary mr-2 mb-2">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;