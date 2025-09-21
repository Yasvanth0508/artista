import React, { useEffect } from 'react';
import { ToastMessage } from '../contexts/ToastContext';
import Icon from './Icon';
import { ICONS } from '../constants';

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const icons = {
    info: ICONS.info,
    success: ICONS.checkCircle,
    error: ICONS.info, // Replace with a dedicated error icon if available
  };

  const iconColors = {
      info: 'text-info',
      success: 'text-green-500',
      error: 'text-red-500'
  }

  return (
    <div
      className="max-w-sm w-full bg-surface shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border border-surface-border flex items-center space-x-4 p-4 animate-toast-in"
      role="alert"
    >
      <div className="flex-shrink-0">
        <Icon name={icons[toast.type]} className={`text-2xl ${iconColors[toast.type]}`} />
      </div>
      <p className="text-sm font-medium text-on-surface">{toast.message}</p>
    </div>
  );
};


interface ToastContainerProps {
    toasts: ToastMessage[];
    removeToast: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-end sm:justify-end z-50">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </div>
    )
}

export default ToastContainer;