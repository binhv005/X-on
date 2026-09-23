import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import PriceDisplay from '../product/PriceDisplay';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    openCheckout,
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
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyPromoCode(couponInput)) {
      setCouponInput('');
    }
  };

  const handleGoToShop = () => {
    closeCart();
    navigate('/shop');
  };

  const handleGoToCheckout = () => {
    closeCart();
    openCheckout();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      {/* Backdrop overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#121214',
        color: '#f3f4f6',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2,
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(20, 20, 24, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--accent-gold, #d4af37)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>
              Your Bag <span style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: 500 }}>({totalCount} {totalCount === 1 ? 'item' : 'items'})</span>
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '0.2rem 0.4rem'
                }}
                title="Empty shopping bag"
              >
                Clear all
              </button>
            )}
            <button
              onClick={closeCart}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(30, 30, 36, 0.6) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isFreeShipping ? '#34d399' : '#e5e7eb' }}>
              <Truck size={14} color={isFreeShipping ? '#34d399' : 'var(--accent-gold, #d4af37)'} />
              {isFreeShipping ? (
                <span style={{ fontWeight: 600 }}>🎉 You've unlocked FREE Shipping!</span>
              ) : (
                <span>Add <strong>${remainingForFreeShip.toFixed(2)}</strong> more for <strong>FREE Shipping</strong></span>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>{progressPercent}%</span>
          </div>
          <div style={{
            height: '6px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: isFreeShipping
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #b38728, #fbf5b7, #d4af37)',
              transition: 'width 0.4s ease',
              borderRadius: '999px'
            }} />
          </div>
        </div>

        {/* Drawer Body - Items List or Empty State */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {items.length === 0 ? (
            <div style={{
              margin: 'auto 0',
              textAlign: 'center',
              padding: '2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold, #d4af37)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <ShoppingBag size={34} strokeWidth={1.5} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.4rem 0' }}>Your bag is empty</h3>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0, maxWidth: '280px', lineHeight: 1.5 }}>
                  Looks like you haven't added any luxury press-on sets to your bag yet.
                </p>
              </div>
              <button
                onClick={handleGoToShop}
                className="btn"
                style={{
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Explore Collections</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const itemImage = (item.images && item.images.length > 0) ? item.images[0] : '/assets/images/IMG_7098.JPG';
              const unitPrice = item.sale_price !== null && item.sale_price !== undefined ? item.sale_price : item.price;
              const lineTotal = (unitPrice * item.quantity).toFixed(2);
              const isSale = item.sale_price !== null && item.sale_price !== undefined && item.sale_price < item.price;

              return (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedVariant || ''}-${idx}`}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    transition: 'border-color 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {/* Thumbnail */}
                  <Link
                    to={item.slug ? `/product/${item.slug}` : '/shop'}
                    onClick={closeCart}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#1a1a1f',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'block'
                    }}
                  >
                    <img
                      src={itemImage}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/IMG_7098.JPG';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <Link
                          to={item.slug ? `/product/${item.slug}` : '/shop'}
                          onClick={closeCart}
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: '#f9fafb',
                            textDecoration: 'none',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedVariant)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '2px',
                            opacity: 0.8,
                            transition: 'opacity 0.2s ease',
                            flexShrink: 0
                          }}
                          onMouseOver={e => e.currentTarget.style.opacity = '1'}
                          onMouseOut={e => e.currentTarget.style.opacity = '0.8'}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Size and Variant badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          background: 'rgba(212, 175, 55, 0.15)',
                          color: 'var(--accent-gold, #d4af37)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px',
                          fontWeight: 600
                        }}>
                          Size: {item.selectedSize || 'Custom'}
                        </span>
                        {item.selectedVariant && (
                          <span style={{
                            fontSize: '0.72rem',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: '#d1d5db',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '4px'
                          }}>
                            {item.selectedVariant}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper and Price */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                      {/* Stepper */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedVariant, item.quantity - 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#e5e7eb',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          minWidth: '24px',
                          textAlign: 'center',
                          color: '#fff'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedVariant, item.quantity + 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#e5e7eb',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: (item.maxStock !== undefined && item.quantity >= item.maxStock) ? 'not-allowed' : 'pointer',
                            opacity: (item.maxStock !== undefined && item.quantity >= item.maxStock) ? 0.35 : 1
                          }}
                          title={item.maxStock !== undefined && item.quantity >= item.maxStock ? `Max stock (${item.maxStock}) reached` : 'Increase quantity'}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                          ${lineTotal}
                        </span>
                        {isSale && (
                          <div style={{ fontSize: '0.72rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer - Calculations, Coupon, & Checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(18, 18, 22, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {/* Promo Code Input */}
            <div>
              {promoCode ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.75rem',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px dashed var(--accent-gold, #d4af37)',
                  borderRadius: '6px',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold, #d4af37)' }}>
                    <Tag size={14} />
                    <span style={{ fontWeight: 700 }}>{promoCode.code}</span>
                    <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>({promoCode.description})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                    title="Remove coupon"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. XON10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      padding: '0.5rem 0.9rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#9ca3af' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Discount ({promoCode?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>
                  {isFreeShipping ? (
                    <span style={{ color: '#34d399', fontWeight: 600 }}>FREE</span>
                  ) : (
                    <span style={{ color: '#fff' }}>${shippingFee.toFixed(2)}</span>
                  )}
                </span>
              </div>

              <div style={{
                height: '1px',
                background: 'rgba(255, 255, 255, 0.08)',
                margin: '0.3rem 0'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', color: '#fff', fontWeight: 800 }}>
                <span>Estimated Total</span>
                <span style={{ color: 'var(--accent-gold, #d4af37)' }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                onClick={handleGoToCheckout}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b38728 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.9rem 1.25rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>Checkout • ${finalTotal.toFixed(2)}</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={closeCart}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#d1d5db',
                  borderRadius: '6px',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#d1d5db';
                }}
              >
                Continue Shopping
              </button>
            </div>

            {/* Trust badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#6b7280', marginTop: '0.2rem' }}>
              <ShieldCheck size={14} color="#9ca3af" />
              <span>100% Guaranteed High Quality Gel Press-On Nails</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
