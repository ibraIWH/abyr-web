import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import SplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';
import './styles/responsive.css';

// Wrapper component that decides to show splash or app
function AppWithSplash() {
  const { loading: authLoading } = useAuth();
  const { loading: settingsLoading } = useSettings();

  // Show splash until both auth and settings are fully loaded
  if (authLoading || settingsLoading) {
    return <SplashScreen />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <SettingsProvider>
                <AppWithSplash />
              </SettingsProvider>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);