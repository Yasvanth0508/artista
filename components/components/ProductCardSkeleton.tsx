import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-lg border border-surface-border flex flex-col animate-pulse">
      {/* Header Skeleton */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-surface-border"></div>
          <div>
            <div className="h-4 w-24 bg-surface-border rounded"></div>
            <div className="h-3 w-16 bg-surface-border rounded mt-2"></div>
          </div>
        </div>
        <div className="h-8 w-24 bg-surface-border rounded-full"></div>
      </div>

      {/* Image Skeleton */}
      <div className="w-full bg-surface-border aspect-[4/3]"></div>

      {/* Content Wrapper Skeleton */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Engagement Buttons Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-7 w-12 bg-surface-border rounded"></div>
            <div className="h-7 w-12 bg-surface-border rounded"></div>
          </div>
          <div className="h-7 w-7 bg-surface-border rounded-full"></div>
        </div>
        
        {/* Price & Chat Button Skeleton */}
        <div className="mt-4 flex items-center justify-between">
            <div className="h-7 w-28 bg-surface-border rounded"></div>
            <div className="h-10 w-40 bg-surface-border rounded-lg"></div>
        </div>

        {/* Text Content Skeleton */}
        <div className="mt-4 flex-grow">
          <div className="h-6 w-3/4 bg-surface-border rounded"></div>
          <div className="h-4 w-full bg-surface-border rounded mt-3"></div>
          <div className="h-4 w-5/6 bg-surface-border rounded mt-2"></div>
          <div className="flex mt-4 space-x-2">
            <div className="h-5 w-16 bg-surface-border rounded-full"></div>
            <div className="h-5 w-20 bg-surface-border rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;