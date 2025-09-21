import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import SellerDashboard from "@/components/ListArtwork";
import ProductShowcase from "./components/ProductShowcase";
import { AnalysisPage } from "../components/components/AnalysisPage";
import { Product, NewProductData, UserProfile } from "../types";
import { useToast } from "@/components/contexts/ToastContext";
import { dbService } from "@/services/db";

const SellerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"gallery" | "analysis" | "post">("gallery");
  const [editingArtwork, setEditingArtwork] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const { addToast } = useToast();

  // 🔹 Load current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await dbService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to load user:", error);
        addToast("Failed to load user profile.", "error");
      }
    };

    loadUser();
  }, [addToast]);

  // 🔹 Load user's products
  useEffect(() => {
    if (!currentUser?.id) return;

    const loadUserProducts = async () => {
      setLoading(true);
      try {
        const userProducts = await dbService.getUserProducts(currentUser.id);
        setProducts(userProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
        addToast("Failed to load your artworks.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadUserProducts();
  }, [currentUser, addToast]);

  // 🔹 Save artwork
  const handleSaveArtwork = async (artworkData: NewProductData) => {
    if (!currentUser?.id) {
      addToast("You must be logged in to list artwork.", "error");
      return;
    }

    try {
      const newProduct = await dbService.addProduct(artworkData, currentUser);
      setProducts(prev => [newProduct, ...prev]);
      addToast("Artwork listed successfully!", "success");
      setActiveTab("gallery");
    } catch (error) {
      console.error(error);
      addToast("Failed to save artwork.", "error");
    }
  };

  // 🔹 Edit artwork
  const handleEdit = (artwork: Product) => {
    setEditingArtwork(artwork);
    setActiveTab("post");
  };

  // 🔹 Delete artwork
  const handleDelete = async (artworkId: string) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;

    try {
      await dbService.deleteProduct(artworkId);
      setProducts(prev => prev.filter(p => p.id !== artworkId));
      addToast("Artwork deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      addToast("Could not delete artwork.", "error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        onAnalyzeClick={() => setActiveTab("analysis")}
        onAddArtClick={() => { setEditingArtwork(null); setActiveTab("post"); }}
        onViewArt={() => setActiveTab("gallery")}
      />

      {activeTab === "analysis" && <AnalysisPage />}

      {activeTab === "post" && currentUser && (
        <SellerDashboard
          onSave={handleSaveArtwork}
          onCancel={() => { setEditingArtwork(null); setActiveTab("gallery"); }}
          artworkToEdit={editingArtwork}
        />
      )}

      {activeTab === "gallery" && currentUser && (
        <ProductShowcase
          artworks={products}
          currentUser={currentUser} // ✅ pass current user for delete/edit
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default SellerPage;
