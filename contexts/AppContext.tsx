
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserRole } from '../types';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('guest');

  return (
    <AppContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
