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

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState(() => {
    try {
      const saved = localStorage.getItem('xon_promo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('xon_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem('xon_promo', JSON.stringify(promoCode));
      } else {
        localStorage.removeItem('xon_promo');
      }
    } catch (e) {
      console.error('Failed to save promo to localStorage', e);
    }
  }, [promoCode]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const addToCart = (product, size = 'M', quantity = 1, variant = '', openDrawer = false) => {
    if (!product) return;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && 
                item.selectedSize === size && 
                (item.selectedVariant || '') === (variant || '')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price) || 0,
          sale_price: product.sale_price !== undefined && product.sale_price !== null ? Number(product.sale_price) : null,
          images: product.images || [],
          sku: product.sku || `XON-${product.id}`,
          selectedSize: size,
          selectedVariant: variant,
          quantity: qty
        }];
      }
    });

    const label = variant ? ` (${size} - ${variant})` : ` (${size})`;
    addToast(`Added "${product.name}"${label} to your bag!`, 'success');

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (productId, size, variant = '', newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId, size, variant);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === productId && item.selectedSize === size && (item.selectedVariant || '') === (variant || '')) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId, size, variant = '') => {
    setItems(prev => {
      const removedItem = prev.find(item => item.id === productId && item.selectedSize === size && (item.selectedVariant || '') === (variant || ''));
      if (removedItem) {
        addToast(`Removed "${removedItem.name}" from your bag`, 'info');
      }
      return prev.filter(item => !(item.id === productId && item.selectedSize === size && (item.selectedVariant || '') === (variant || '')));
    });
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
  };

  // Promo Code Validation
  const validCoupons = {
    'XON10': { code: 'XON10', discountPercent: 10, description: '10% OFF all items' },
    'XON20': { code: 'XON20', discountPercent: 20, description: '20% OFF luxury sets' },
    'FREESHIP': { code: 'FREESHIP', freeShipping: true, description: 'Free Standard Shipping' },
    'VIP50': { code: 'VIP50', discountPercent: 50, description: 'VIP 50% Exclusive' }
  };

  const applyPromoCode = (inputCode) => {
    const clean = (inputCode || '').trim().toUpperCase();
    if (!clean) {
      addToast('Please enter a valid coupon code.', 'error');
      return false;
    }
    if (validCoupons[clean]) {
      setPromoCode(validCoupons[clean]);
      addToast(`Promo code "${clean}" applied successfully!`, 'success');
      return true;
    } else {
      addToast(`Coupon code "${clean}" is invalid or expired.`, 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
    addToast('Promo code removed', 'info');
  };

  // Calculations
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  const subtotal = items.reduce((sum, item) => {
    const effectivePrice = item.sale_price !== null && item.sale_price !== undefined ? item.sale_price : item.price;
    return sum + (effectivePrice * (item.quantity || 1));
  }, 0);

  const freeShippingThreshold = 50; // $50
  const isFreeShipping = subtotal >= freeShippingThreshold || (promoCode && promoCode.freeShipping);
  const shippingFee = items.length === 0 ? 0 : (isFreeShipping ? 0 : 4.99);

  let discountAmount = 0;
  if (promoCode && promoCode.discountPercent) {
    discountAmount = (subtotal * promoCode.discountPercent) / 100;
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider value={{
      items,
      isCartOpen,
      isCheckoutOpen,
      openCart,
      closeCart,
      toggleCart,
      openCheckout,
      closeCheckout,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      promoCode,
      applyPromoCode,
      removePromoCode,
      totalCount,
      subtotal,
      shippingFee,
      discountAmount,
      finalTotal,
      freeShippingThreshold,
      isFreeShipping
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
