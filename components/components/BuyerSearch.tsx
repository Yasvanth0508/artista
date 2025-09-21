import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from './Icon';
import { ICONS } from '../constants';
import { Product } from '../../types';
import { getSearchSuggestions } from '../../services/geminiService';

interface BuyerSearchProps {
  onSearch: (term: string) => void;
  products: Product[];
}

const BuyerSearch: React.FC<BuyerSearchProps> = ({ onSearch, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem('recent_searches');
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error('Failed to load recent searches from localStorage', error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
       if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSuggestionsLoading(true);
    try {
      const result = await getSearchSuggestions(query, products);
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to fetch search suggestions:", error);
      // Fallback to simple filtering
      const searchableContent = products.flatMap(p => [p.title, ...p.tags, p.artist.name]);
      const uniqueContent = [...new Set(searchableContent)];
      setSuggestions(
        uniqueContent
          .filter((t: string) => t.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      );
          } finally {
      setIsSuggestionsLoading(false);
    }
  }, [products]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchSuggestions]);

  const addRecentSearch = (term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    setRecentSearches(prev => {
      const updatedSearches = [trimmedTerm, ...prev.filter(s => s.toLowerCase() !== trimmedTerm.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
      } catch (error) {
        console.error("Failed to save recent searches", error);
      }
      return updatedSearches;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    addRecentSearch(searchTerm);
    setIsSuggestionsVisible(false);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    addRecentSearch(suggestion);
    setSuggestions([]);
    setIsSuggestionsVisible(false);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
    addRecentSearch(term);
    setIsSuggestionsVisible(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  return (
    <div className="flex-1 max-w-2xl mx-4" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSuggestionsVisible(true)}
          placeholder="Search for art, artists, tags..."
          className="w-full bg-background border border-surface-border rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-secondary">
          <Icon name={ICONS.search} />
        </div>
        {isSuggestionsVisible && ((searchTerm.length > 2) || recentSearches.length > 0) && (
          <div className="absolute mt-2 w-full bg-surface rounded-md shadow-lg overflow-hidden border border-surface-border">
            {/* AI Suggestions */}
            {searchTerm.length > 2 && (
              <>
                {isSuggestionsLoading ? (
                   <div className="px-4 py-2 text-center text-sm text-on-surface-secondary">Loading suggestions...</div>
                ) : (
                  suggestions.length > 0 &&
                  <ul>
                    {suggestions.map((s, i) => (
                      <li key={i} onClick={() => handleSuggestionClick(s)} className="px-4 py-2 hover:bg-background cursor-pointer text-sm">{s}</li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <>
                {searchTerm.length > 2 && (isSuggestionsLoading || suggestions.length > 0) && <hr className="border-surface-border" />}
                <div className="p-2">
                  <div className="flex justify-between items-center px-2 mb-1">
                      <h4 className="text-xs font-bold text-on-surface-secondary uppercase tracking-wider">Recent Searches</h4>
                      <button onClick={clearRecentSearches} className="text-xs text-secondary hover:underline">Clear</button>
                  </div>
                  <ul>
                    {recentSearches.map((term, i) => (
                      <li key={i} onClick={() => handleRecentSearchClick(term)} className="flex items-center px-2 py-1.5 hover:bg-background cursor-pointer rounded-md">
                        <Icon name={ICONS.clock} className="text-base mr-3 text-on-surface-secondary" />
                        <span className="text-sm text-on-surface">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default BuyerSearch;
