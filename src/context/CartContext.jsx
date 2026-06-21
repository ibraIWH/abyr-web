import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api'; // your central Axios instance
import { useAuth } from './AuthContext'; // we need to know if logged in

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();                      // current user (null if not logged in)
  const [cart, setCart] = useState([]);            // array of cart items
  const [loading, setLoading] = useState(false);

  // Fetch cart from server whenever user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      api.get('/cart')
        .then(res => setCart(res.data.items))
        .catch(() => setCart([]))
        .finally(() => setLoading(false));
    } else {
      setCart([]);
    }
  }, [user]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = async (product, quantity = 1, size = 'M') => {
    if (!user) return;                             // must be logged in
    try {
      const res = await api.post('/cart', {
        productId: product._id,
        quantity,
        size,
      });
      setCart(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (!user) return;
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity: newQty });
      setCart(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;
    try {
      const res = await api.delete(`/cart/${itemId}`);
      setCart(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await api.delete('/cart');
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};