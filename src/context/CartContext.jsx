import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api'; // your central Axios instance
import { useAuth } from './AuthContext'; // we need to know if logged in

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

// Cart lines have no _id of their own (the backend schema is { _id: false }),
// so a line is identified by its product + size.
// `item.product` is a full product object when the cart comes from GET /cart,
// and only the product's id after add/update calls, so handle both.
export const productIdOf = (item) =>
  item?.product && typeof item.product === 'object' ? item.product._id : item?.product;

// A stable React key for a cart line.
export const lineKey = (item) => `${productIdOf(item)}-${item?.size || 'M'}`;

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

  // Returns 'added', 'signin' (the shopper isn't logged in) or 'error',
  // so the button that called it can show the right message.
  const addToCart = async (product, quantity = 1, size = 'M') => {
    if (!user) return 'signin';                    // must be logged in
    try {
      const res = await api.post('/cart', {
        productId: product._id,
        quantity,
        size,
      });
      setCart(res.data.items);
      return 'added';
    } catch (err) {
      console.error(err);
      return 'error';
    }
  };

  // PUT /api/cart/item sets one line's quantity; 0 removes the line.
  const setLineQuantity = async (item, quantity) => {
    if (!user) return;
    try {
      const res = await api.put('/cart/item', {
        productId: productIdOf(item),
        size: item.size || 'M',
        quantity: Math.max(0, quantity),
      });
      setCart(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  // Pass the whole cart line (not an id): updateQuantity(item, item.quantity + 1)
  const updateQuantity = (item, newQty) => setLineQuantity(item, newQty);

  const removeFromCart = (item) => setLineQuantity(item, 0);

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
