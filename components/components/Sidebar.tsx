// FIX: Imported useState from react to resolve 'useState' is not defined error.
import React, { useState } from 'react';
import { Filters } from '../../types';
import { ICONS } from '../constants';
import Icon from './Icon';
import PriceRangeSlider from './PriceRangeSlider';

interface SidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  isOpen: boolean;
  onClose: () => void;
  maxPrice: number;
}

interface FilterSectionProps {
  title: string;
  onClear?: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, onClear, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-surface-border py-4">
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="font-semibold text-on-surface">{title}</h3>
                <Icon name={isOpen ? ICONS.chevronUp : ICONS.chevronDown} className="text-xl"/>
            </div>
            {isOpen && (
              <>
                <div className="space-y-2 mt-2">{children}</div>
                {onClear && <button onClick={onClear} className="text-sm text-secondary mt-3 hover:underline">Clear</button>}
              </>
            )}
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, isOpen, onClose, maxPrice }) => {

 
  const handleArtType = (type: string) => {
    setFilters(prev => ({...prev, artType: type}));
  }

  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, priceRange: { min, max } }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };
  
  const artTypes = ["Paintings", "Digital Art", "Sculptures", "Photography", "Handicrafts", "Jewelry", "Textiles", "Pottery"];

  return (
    <>
      {/* Overlay for mobile/tablet */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`
        w-[250px] h-screen bg-surface p-6 overflow-y-auto text-on-surface-secondary shadow-xl
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out 
        lg:h-screen lg:sticky lg:top-0 lg:z-30 lg:transform-none lg:inset-auto lg:shadow-none lg:border-r lg:border-surface-border
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-on-surface">Filters</h2>
            <button onClick={onClose} className="lg:hidden text-on-surface-secondary hover:text-on-surface" aria-label="Close filters">
                <Icon name={ICONS.close} className="text-2xl" />
            </button>
            <button onClick={clearAllFilters} className="text-sm font-semibold text-primary hover:underline hidden lg:block">Clear All</button>
        </div>
        
        <FilterSection title="Price Range" onClear={() => setFilters(p => ({...p, priceRange: undefined}))}>
            <PriceRangeSlider
                min={0}
                max={maxPrice}
                currentMin={filters.priceRange?.min ?? 0}
                currentMax={filters.priceRange?.max ?? maxPrice}
                onChange={handlePriceChange}
                currency="₹"
            />
        </FilterSection>

        
        <FilterSection title="Art Type" onClear={() => setFilters(p => ({...p, artType: undefined}))}>
            {artTypes.map(type => (
            <button key={type} onClick={() => handleArtType(type)} className={`w-full text-left p-2 rounded ${filters.artType === type ? 'bg-primary text-white' : 'hover:bg-surface-hover'}`}>{type}</button>
            ))}
        </FilterSection>
        </aside>
    </>
  );
};

export default Sidebar;