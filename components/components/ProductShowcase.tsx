import React from "react";
import { Product, UserProfile } from "../../types";

interface ProductShowcaseProps {
  artworks: Product[];
  currentUser?: UserProfile; // ✅ added
  onDelete?: (artworkId: string) => void;
  onEdit?: (artwork: Product) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  artworks,
  currentUser,
  onDelete,
  onEdit
}) => {
  if (!artworks || artworks.length === 0) {
    return <p className="text-gray-500 text-center py-6">No artworks to show.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <div
          key={artwork.id}
          className="border rounded-lg shadow hover:shadow-lg transition p-2 relative"
        >
          {artwork.images && artwork.images[0] && (
            <img
              src={artwork.images[0]}
              alt={artwork.title}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <h3 className="text-lg font-semibold mt-2">{artwork.title}</h3>
          <p className="text-gray-600 font-medium mt-1">₹{artwork.price}</p>
          <p className="text-sm text-gray-500 mt-0.5">{artwork.artType}</p>

          <div className="flex gap-2 mt-2">
            {onDelete && currentUser && artwork.ownerId === currentUser.id && (
              <button
                onClick={() => onDelete(artwork.id)}
                className="text-sm bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductShowcase;
