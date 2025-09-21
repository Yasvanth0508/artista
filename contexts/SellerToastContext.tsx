import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
  }, []);
  
  const removeToast = (id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
}

export const ToastContainer: React.FC<ToastContainerProps> = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const toastContext = useContext(ToastContext);

    const removeToast = (id: number) => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    };

    // This is a bit of a hack to get toasts from the provider to the container
    // without lifting state up above the provider. In a real app, a portal or
    // a more sophisticated state management would be used.
    useEffect(() => {
        if(toastContext){
            const originalAddToast = toastContext.addToast;
            (toastContext.addToast as any) = (message: string, type: ToastType) => {
                const id = Date.now();
                setToasts(currentToasts => [...currentToasts, { id, message, type }]);
                originalAddToast(message, type);
            };
        }
    }, [toastContext]);


    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast} onDismiss={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast: React.FC<{ message: ToastMessage; onDismiss: () => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`toast toast-${message.type}`}>
      <p>{message.message}</p>
      <button onClick={onDismiss} className="toast-close-btn">&times;</button>
    </div>
  );
};
