import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
  currency?: string;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, currentMin, currentMax, onChange, currency = '₹' }) => {
  const [minVal, setMinVal] = useState(currentMin);
  const [maxVal, setMaxVal] = useState(currentMax);
  const minValRef = useRef(currentMin);
  const maxValRef = useRef(currentMax);
  const trackRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);
  const draggingThumbRef = useRef<'min' | 'max' | null>(null);

  // Update internal state and refs when props change
  useEffect(() => {
    setMinVal(currentMin);
    minValRef.current = currentMin;
  }, [currentMin]);

  useEffect(() => {
    setMaxVal(currentMax);
    maxValRef.current = currentMax;
  }, [currentMax]);
  
  const getPercent = useCallback((value: number) => {
    if (max === min) return 0;
    return Math.round(((value - min) / (max - min)) * 100);
  }, [min, max]);

  // Set the width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Add mouse and touch event listeners for dragging
  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!draggingThumbRef.current || !trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      let newValue = Math.round(min + percent * (max - min));
      
      if (draggingThumbRef.current === 'min') {
        // Prevent min thumb from crossing max thumb
        newValue = Math.min(newValue, maxValRef.current);
        setMinVal(newValue);
        minValRef.current = newValue;
      } else {
        // Prevent max thumb from crossing min thumb
        newValue = Math.max(newValue, minValRef.current);
        setMaxVal(newValue);
        maxValRef.current = newValue;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      handleMove(event.clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handleMove(event.touches[0].clientX);
      }
    };

    const handleUp = () => {
      if (draggingThumbRef.current) {
        onChange(minValRef.current, maxValRef.current);
      }
      draggingThumbRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [min, max, onChange]);

  const formatCurrency = (value: number) => {
    return `${currency}${Math.round(value).toLocaleString('en-IN')}`;
  };

  return (
    <div className="pt-2">
      <div className="relative h-8 flex items-center">
        <div ref={trackRef} className="relative w-full h-1 bg-surface-border rounded-md">
          <div ref={rangeRef} className="absolute z-10 h-1 bg-primary rounded-md" />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary cursor-pointer z-20"
            style={{ left: `${getPercent(minVal)}%` }}
            onMouseDown={() => { draggingThumbRef.current = 'min'; }}
            onTouchStart={() => { draggingThumbRef.current = 'min'; }}
            aria-label="Minimum price handle"
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={minVal}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary cursor-pointer z-20"
            style={{ left: `${getPercent(maxVal)}%` }}
            onMouseDown={() => { draggingThumbRef.current = 'max'; }}
            onTouchStart={() => { draggingThumbRef.current = 'max'; }}
            aria-label="Maximum price handle"
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={maxVal}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 text-sm text-on-surface-secondary">
        <span>{formatCurrency(minVal)}</span>
        <span>{formatCurrency(maxVal)}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;