import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = sessionStorage.getItem('abyr_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('abyr_cart', JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product._id);
      if (existing) {
        return prev.map(i =>
          i.id === product._id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, {
        id: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        imageUrl: product.imageUrl,
        quantity: qty,
      }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('abyr_cart');
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};