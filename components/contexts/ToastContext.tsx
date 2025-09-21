import React, { createContext, useState, useCallback, ReactNode, useContext } from 'react';
import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface ToastContextType {
  addToast: (message: string, type: ToastMessage['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let id = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    setToasts((prevToasts) => [...prevToasts, { id: id++, message, type }]);
  }, []);

  const removeToast = useCallback((toastId: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
