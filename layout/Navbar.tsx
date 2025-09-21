// Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../Login/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import ThemeToggle from "./ThemeToggle";
import BuyerSearch from "../components/components/BuyerSearch";
import BuyerProfileDropdown from "../components/components/BuyerProfileDropdown";
import { Product } from "../types";

interface NavbarProps {
  products?: Product[];
  onSearch?: (term: string) => void;
  onNavigate?: (view: "home" | "profile" | "seller") => void;
}

const Navbar: React.FC<NavbarProps> = ({ products = [], onSearch, onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"view" | "sell">("view");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on dashboard pages
  const isDashboard = location.pathname.startsWith("/dashboard");

  // ✅ Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Persist active tab in localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab") as "view" | "sell" | null;
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown-desktop")) {
        setProfileOpen(false);
      }
      if (!target.closest(".profile-dropdown-mobile")) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          {/* <img src alt="Logo" className="logo h-8" /> */}
          <img src="./logo.png" alt="Logo" className="logo h-8" />
        </Link>

        {/* Desktop Links */}
        <div className="text-sm hidden md:flex items-center space-x-6">
          {!isDashboard ? (
            <>
              <a
                href="#about"
                className={`hover:text-indigo-500 duration-300`}
              >
                About
              </a>
              <a
                href="#features"
                className={`hover:text-indigo-500 duration-300`}
              >
                Features
              </a>
            </>
          ) : (
            /* ✅ Buyer Search Component */
            onSearch && products.length > 0 && (
              <BuyerSearch onSearch={onSearch} products={products} />
            )
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {user ? (
            <>
              {/* Slider Button */}
              <div className="relative flex rounded-full h-10 p-2 cursor-pointer select-none">
                
                <button
                  onClick={() => {
                    setActiveTab("view");
                    navigate("/dashboard/view");
                  }}
                  className={`text-sm font-medium hover:text-indigo-500 relative mr-4 z-10 transition-colors  `}
                >
                  View Products
                </button>
                <button
                  onClick={() => {
                    setActiveTab("sell");
                    navigate("/dashboard/sell");
                  }}
                  className={`text-sm font-medium relative z-10 transition-colors duration-300 hover:text-indigo-500`}
                >
                  Post Artwork
                </button>
              </div>

              {/* ✅ Profile Dropdown */}
              {onNavigate ? (
                <BuyerProfileDropdown onNavigate={onNavigate} />
              ) : (
                <div className="relative profile-dropdown-desktop">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-expanded={profileOpen}
                    className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:scale-105 transition-transform duration-200"
                  >
                    Profile
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
                      <button
                        onClick={() => {
                          navigate("/dashboard/profile");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:scale-105 transition-transform duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-500"
            aria-expanded={menuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2">
          {!isDashboard ? (
            <>
              <a
                href="#about"
                className="block text-gray-600 dark:text-gray-300 hover:text-indigo-500 py-2"
              >
                About
              </a>
              <a
                href="#features"
                className="block text-gray-600 dark:text-gray-300 hover:text-indigo-500 py-2"
              >
                Features
              </a>
            </>
          ) : (
            /* ✅ Mobile Search for Dashboard */
            onSearch && products.length > 0 && (
              <div className="mb-4">
                <BuyerSearch onSearch={onSearch} products={products} />
              </div>
            )
          )}

          {user ? (
            <>
              {/* Mobile Slider */}
              <div className="relative flex rounded-full w-full h-10 p-1 my-2 select-none">
                <div
                  className={`absolute top-1 left-1 h-8 w-[calc(50%-4px)] rounded-full bg-indigo-500 transition-all duration-300 ${
                    activeTab === "sell" ? "translate-x-[100%]" : "translate-x-0"
                  }`}
                />
                <button
                  onClick={() => {
                    setActiveTab("view");
                    navigate("/dashboard/view");
                  }}
                  className={`flex-1 text-sm font-medium relative z-10 ${
                    activeTab === "view" ? "text-white" : "hover:text-indigo-500"
                  }`}
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setActiveTab("sell");
                    navigate("/dashboard/sell");
                  }}
                  className={`flex-1 text-sm font-medium relative z-10 ${
                    activeTab === "sell" ? "text-white" : "hover:text-indigo-500"
                  }`}
                >
                  Sell
                </button>
              </div>

              {onNavigate ? (
                <div className="w-full">
                  <BuyerProfileDropdown onNavigate={onNavigate} />
                </div>
              ) : (
                <div className="relative profile-dropdown-mobile">
                  <button
                    onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                    aria-expanded={mobileProfileOpen}
                    className="w-full px-4 py-2 rounded-full bg-indigo-500 text-white text-left"
                  >
                    Profile
                  </button>
                  {mobileProfileOpen && (
                    <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
                      <button
                        onClick={() => {
                          navigate("/dashboard/profile");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 bg-indigo-500 text-white rounded-full my-2"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
