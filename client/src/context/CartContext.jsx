import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('xon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('xon_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, size = 'M', quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedSize === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          ...product,
          selectedSize: size,
          quantity
        }];
      }
    });
    addToast(`Added "${product.name}" (${size}) to your bag!`, 'success');
  };

  const removeFromCart = (productId, size) => {
    setItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + ((item.sale_price || item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, totalCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
