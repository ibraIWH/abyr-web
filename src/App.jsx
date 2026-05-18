import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AccountPage from "./pages/AccountPage";
import AddressesPage from "./pages/AddressesPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import EmailVerifyPage from "./pages/EmailVerifyPage"; // ← ADDED
import FavouritesPage from "./pages/FavouritesPage";
import HomePage from "./pages/HomePage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentPage from "./pages/PaymentPage";
import PhoneVerifyPage from "./pages/PhoneVerifyPage";
import ProductPage from "./pages/ProductPage";
import SearchPage from "./pages/SearchPage"; // ← ADDED
import SettingsPage from "./pages/SettingsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TrackingPage from "./pages/TrackingPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<EmailVerifyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/verify-email/:token" element={<EmailVerifyPage />} />
        <Route path="/verify-email" element={<EmailVerifyPage />} />
        <Route path="/verify-phone" element={<ProtectedRoute><PhoneVerifyPage /></ProtectedRoute>} />
        <Route path="/size-guide" element={<SizeGuidePage />} />

        {/* Protected routes (must be logged in) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <FavouritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}