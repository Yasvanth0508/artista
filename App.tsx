import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { auth } from './Login/firebaseConfig';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import HomePage from './pages/HomePage';
import SharedAuth from './Login/Authform';
import Dashboard from './dashboard';
import BuyerDashboardPage from './pages/BuyerDashboard';
import Icon from './components/components/Icon';
import { ICONS } from './components/constants';
import SellerDashboard from './components/ListArtwork';
import SellerPage from './components/seller';
import { Product, UserProfile, NewProductData } from './types';
import { dbService } from './services/db';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/contexts/ToastContext';
import { BrowserRouter as Router, useOutletContext } from 'react-router-dom';
import ProfilePage from './components/components/ProfilePage';
const AppContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isAddArtModalOpen, setIsAddArtModalOpen] = useState(false);

  const navigate = useNavigate();

  // Load products only after user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoading(true);
        try {
          await dbService.init();

          let dbProducts: any[] = [];
          let dbUser: any = null;
          let dbLikes: any[] = [];
          let dbFollows: any[] = [];

          try {
            dbProducts = await dbService.getProducts();
          } catch (err) {
            console.error("getProducts failed:", err);
          }

          try {
            dbUser = await dbService.getCurrentUser();
            console.log(dbUser)
          } catch (err) {
            console.error("getCurrentUser failed:", err);
          }



          try {
            dbFollows = await dbService.getFollowedArtists();
          } catch (err) {
            console.error("getFollowedArtists failed:", err);
          }

          // Only set state with what succeeded
          setProducts(dbProducts);
          setFilteredProducts(dbProducts);
          if (dbUser) setCurrentUser(dbUser);
          if (dbFollows) setFollowedArtists(new Set(dbFollows));

          // local storage fallback
          const storedProfile = localStorage.getItem("userProfile");
          if (storedProfile) {
            setCurrentUser(JSON.parse(storedProfile));
          }

        } catch (error) {
          console.error("Failed to load initial app data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setCurrentUser(null);
        setFollowedArtists(new Set());
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  // Search handler
  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setFilteredProducts(products);
      return;
    }
    const lowercasedTerm = term.toLowerCase();
    const results = products.filter(p =>
      p.title.toLowerCase().includes(lowercasedTerm) ||
      p.artist.name.toLowerCase().includes(lowercasedTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
    );
    setFilteredProducts(results);
  };

  const handleNavigate = (view: 'home' | 'profile' | 'seller' | 'analysis') => {
    if (view === 'home') navigate('/');
    if (view === 'profile') navigate('/dashboard/profile');
    if (view === 'seller') navigate('/dashboard/sell');
    if (view === 'analysis') navigate('/dashboard/analysis');
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    await dbService.updateCurrentUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const handleSaveFromModal = async (artworkData: NewProductData) => {
    if (!currentUser) return;
    try {
      const newProduct = await dbService.addProduct(artworkData, currentUser);
      setProducts(prev => [newProduct, ...prev]);
      setFilteredProducts(prev => [newProduct, ...prev]);
      setIsAddArtModalOpen(false);
    } catch (error) {
      console.error("Failed to save artwork:", error);
      setIsAddArtModalOpen(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Navbar products={products} onSearch={handleSearch} onNavigate={handleNavigate} />
      <main className="flex-grow">
        <Outlet context={{
          products: filteredProducts,
          setProducts,
          currentUser,
          setCurrentUser,
          followedArtists,
          setFollowedArtists,
          handleUpdateProfile,
        }} />
      </main>
      <Footer />

      {/* Add Artwork modal */}
      {isAddArtModalOpen && (
        <div className="fullscreen-modal">
          <button
            className="fullscreen-modal-close"
            onClick={() => setIsAddArtModalOpen(false)}
            aria-label="Close form"
          >
            <Icon name={ICONS.close} />
          </button>
          <SellerDashboard
            onSave={handleSaveFromModal}
            onCancel={() => setIsAddArtModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <ToastProvider>
      <Router>
        <Routes>
          <Route element={<AppContent />}>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SharedAuth />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="view" replace />} />
              <Route path="view" element={<BuyerDashboardPage />} />
              <Route path="sell" element={<SellerPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  </ThemeProvider>
);
export default App;
