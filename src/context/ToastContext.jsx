import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: '10px' }}>
    {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />)}
  </div>
);

const ToastItem = ({ toast, onClose }) => {
  const bg = toast.type === 'success' ? '#4CAF50' : toast.type === 'error' ? '#f44336' : '#2196F3';
  return (
    <div style={{ background: bg, color: 'white', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px', animation: 'slideIn 0.3s ease' }}>
      <span>{toast.message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
    </div>
  );
};