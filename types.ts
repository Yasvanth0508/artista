export type UserRole = 'guest' | 'buyer' | 'seller';
import { Timestamp, FieldValue } from "firebase/firestore";
export interface ArtPostType {
  id: number;
  artist: {
    name: string;
    avatar: string;
  };
  image: string;
  title: string;
  description: string;
  likes: number;
  price: number;
  category: string;
}
export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  location: string;
  bio?: string;
  phone?: string;
}



export interface Product {
  id:string;
  title: string;
  artist: Artist;
  images: string[];
  description: string;
  details: {
    dimensions: string;
    materials: string;
    creationDate: string;
  };
  price: number;
  currency: string;
  tags: string[];
  postedAt: Timestamp | string | FieldValue;
  views: number;
  sales: number;
  rating: number;
  artType: string;
  ownerId: string; 
}

export interface Filters {
  rating?: number;
  artType?: string;
  searchTerm?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  bio: string;
}

export interface NewProductData {
  title: string;
  images: string[]; // base64 data URLs
  imageMimeType: string;
  description: string;
  details: {
    dimensions: string;
    materials: string;
    creationDate: string;
  };
  price: number;
  tags: string[];
  artType: string;
  availability: 'In Stock' | 'Pre-order';
}

export enum Language {
  EN = 'English',
  TA = 'Tamil',
  FR = 'French',
  HI = 'Hindi',
  DE = 'German',
}

// FIX: Added ChatMessage type for use in chat components.
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'artist';
}

export interface NewProductData {
  id?: number;
  title: string;
  description: string;
  price: number;
  artType: string;
  tags: string[];
  details: {
    dimensions: string;
    materials: string;
    creationDate: string;
  };
  images: string[]; // data URLs
}
