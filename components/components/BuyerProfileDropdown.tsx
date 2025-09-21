import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/Login/firebaseConfig';
import { signOut } from 'firebase/auth';

interface BuyerProfileDropdownProps {
  onNavigate: (view: 'home' | 'profile' | 'seller') => void;
}

const BuyerProfileDropdown: React.FC<BuyerProfileDropdownProps> = ({ onNavigate }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="block w-full"
      >
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-hover">
          <img
            src="https://picsum.photos/seed/user/40/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-sm font-medium text-on-surface">Profile</span>
        </div>
      </button>

      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-lg py-1 border border-surface-border animate-fade-in">
          {/* Profile Settings */}
          <button
            onClick={() => {
              onNavigate('profile');
              setIsProfileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-background"
          >
            Profile Settings
          </button>

          <div className="border-t border-surface-border my-1"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerProfileDropdown;
