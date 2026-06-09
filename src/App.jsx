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

// Guest Checkout (no login required)
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

// Protected Pages
import AccountPage from './pages/AccountPage';
import AddressesPage from './pages/AddressesPage';
import FavouritesPage from './pages/FavouritesPage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import SettingsPage from './pages/SettingsPage';

function App() {
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

      {/* Guest checkout */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Protected */}
      <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/favourites" element={<ProtectedRoute><FavouritesPage /></ProtectedRoute>} />
      <Route path="/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;