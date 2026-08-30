import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import CategoryPage from './pages/CategoryPage';
import EmailVerifyPage from './pages/EmailVerifyPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import OrderConfirmedPage from './pages/OrderConfirmedPage';
import PhoneVerifyPage from './pages/PhoneVerifyPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SizeGuidePage from './pages/SizeGuidePage';
import TrackingPage from './pages/TrackingPage';

import CartPage from './pages/CartPage';

import AccountPage from './pages/AccountPage';
import AddressesPage from './pages/AddressesPage';
import CheckoutPage from './pages/CheckoutPage';
import FavouritesPage from './pages/FavouritesPage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  // ============================================================
  // ZOOM PREVENTION — FULL (Mobile + Desktop)
  // ============================================================
  useEffect(() => {
    // ----- MOBILE: Block pinch-zoom -----
    const preventZoom = (e) => {
      if (e.type === 'gesturestart' || e.type === 'gesturechange' || e.type === 'gestureend') {
        e.preventDefault();
        return false;
      }
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('gesturestart', preventZoom, { passive: false });
    document.addEventListener('gesturechange', preventZoom, { passive: false });
    document.addEventListener('gestureend', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });

    // ----- MOBILE: Block double-tap zoom -----
    let lastTouchEnd = 0;
    const handleTouchEnd = (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // ----- DESKTOP: Block Ctrl+Plus, Ctrl+Minus, Ctrl+0 -----
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
        return false;
      }
      if (e.metaKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // ----- DESKTOP: Block mouse wheel zoom (Ctrl+Scroll) -----
    // Normal scrolling works — only blocks when Ctrl is held
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    // ----- Cleanup -----
    return () => {
      document.removeEventListener('gesturestart', preventZoom);
      document.removeEventListener('gesturechange', preventZoom);
      document.removeEventListener('gestureend', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify-email" element={<EmailVerifyPage />} />
      <Route path="/verify-email/:token" element={<EmailVerifyPage />} />
      <Route path="/verify-phone" element={<PhoneVerifyPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
      <Route path="/tracking" element={<TrackingPage />} />
      <Route path="/size-guide" element={<SizeGuidePage />} />

      <Route path="/cart" element={<CartPage />} />

      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/favourites" element={<ProtectedRoute><FavouritesPage /></ProtectedRoute>} />
      <Route path="/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;