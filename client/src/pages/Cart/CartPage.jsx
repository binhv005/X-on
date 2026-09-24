import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Gift,
  ChevronRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCheckout,
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
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await api.getProducts({ limit: 4 });
        if (res && res.data) {
          setRecommendedProducts(res.data.slice(0, 4));
        }
      } catch (e) {
        console.error('Failed to load recommended products', e);
      }
    }
    fetchRecommended();
  }, []);

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyPromoCode(couponInput)) {
      setCouponInput('');
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary, #fcfbf9)', minHeight: '85vh', color: 'var(--text-primary, #1c1c21)' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(180deg, #f7f2ea 0%, rgba(252, 251, 249, 0) 100%)',
        borderBottom: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.06))',
        padding: '2.5rem 1.5rem 1.75rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted, #7e7e8c)', marginBottom: '0.85rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted, #7e7e8c)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" style={{ color: 'var(--text-muted, #7e7e8c)', textDecoration: 'none' }}>Shop</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--accent-gold, #b38728)', fontWeight: 600 }}>Shopping Bag</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary, #1c1c21)' }}>
                Shopping Bag
              </h1>
              <p style={{ color: 'var(--text-secondary, #525260)', margin: '0.35rem 0 0 0', fontSize: '0.95rem' }}>
                Review your items, apply promo vouchers, and complete your order.
              </p>
            </div>

            <Link
              to="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--accent-gold-dark, #8c6716)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                padding: '0.55rem 1.15rem',
                borderRadius: '6px',
                border: '1px solid var(--border-gold, rgba(179, 135, 40, 0.35))',
                background: '#ffffff',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#faf7f2';
                e.currentTarget.style.borderColor = 'var(--accent-gold, #b38728)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = 'var(--border-gold, rgba(179, 135, 40, 0.35))';
              }}
            >
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
        {items.length === 0 ? (
          /* Empty Bag State */
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
            borderRadius: '16px',
            padding: '5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.04))'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'rgba(179, 135, 40, 0.08)',
              border: '1px solid rgba(179, 135, 40, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold, #b38728)'
            }}>
              <ShoppingBag size={42} strokeWidth={1.5} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary, #1c1c21)' }}>
                Your Shopping Bag is Empty
              </h2>
              <p style={{ color: 'var(--text-secondary, #525260)', maxWidth: '420px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
                You have not added any salon-grade gel press-on sets to your cart yet. Explore our latest luxury silhouettes.
              </p>
            </div>

            <Link
              to="/shop"
              style={{
                background: 'linear-gradient(135deg, #c59b27 0%, #a67c1e 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.9rem 2.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 16px rgba(179, 135, 40, 0.25)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Explore Collections</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* Active Cart Content */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }} className="cart-grid">
            {/* Left Column: Items and Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Free Shipping Meter Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf7f2 100%)',
                border: '1px solid var(--border-gold, rgba(179, 135, 40, 0.3))',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 8px rgba(179, 135, 40, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isFreeShipping ? 'var(--status-success, #059669)' : 'var(--text-primary, #1c1c21)' }}>
                    <Truck size={18} color={isFreeShipping ? 'var(--status-success, #059669)' : 'var(--accent-gold, #b38728)'} />
                    {isFreeShipping ? (
                      <span style={{ fontWeight: 700 }}>🎉 You unlocked FREE Standard Shipping!</span>
                    ) : (
                      <span>Add <strong style={{ color: 'var(--accent-gold-dark, #8c6716)' }}>${remainingForFreeShip.toFixed(2)}</strong> more to get <strong>FREE Shipping</strong></span>
                    )}
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--accent-gold-dark, #8c6716)', fontSize: '0.85rem' }}>{progressPercent}%</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'rgba(0, 0, 0, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: isFreeShipping
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : 'linear-gradient(90deg, #d4af37, #b38728)',
                    transition: 'width 0.4s ease',
                    borderRadius: '999px'
                  }} />
                </div>
              </div>

              {/* Items Card Container */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.04))',
                overflow: 'hidden'
              }}>
                {/* Table Header (Desktop) */}
                <div className="cart-table-header" style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1fr 1fr 1fr 40px',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.06))',
                  background: '#faf7f2',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted, #7e7e8c)'
                }}>
                  <div>Product</div>
                  <div style={{ textAlign: 'center' }}>Price</div>
                  <div style={{ textAlign: 'center' }}>Quantity</div>
                  <div style={{ textAlign: 'right' }}>Total</div>
                  <div></div>
                </div>

                {/* Items Rows */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {items.map((item, idx) => {
                    const itemImage = (item.images && item.images.length > 0) ? item.images[0] : '/assets/images/IMG_7098.webp';
                    const unitPrice = item.sale_price !== null && item.sale_price !== undefined ? item.sale_price : item.price;
                    const lineTotal = (unitPrice * item.quantity).toFixed(2);
                    const isSale = item.sale_price !== null && item.sale_price !== undefined && item.sale_price < item.price;

                    return (
                      <div
                        key={`${item.id}-${item.selectedSize}-${item.selectedVariant || ''}-${idx}`}
                        className="cart-item-row"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2.5fr 1fr 1fr 1fr 40px',
                          padding: '1.25rem 1.5rem',
                          alignItems: 'center',
                          borderBottom: idx !== items.length - 1 ? '1px solid var(--border-subtle, rgba(0, 0, 0, 0.06))' : 'none',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        {/* Product Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <Link
                            to={item.slug ? `/product/${item.slug}` : '/shop'}
                            style={{
                              width: '84px',
                              height: '84px',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              background: '#f4efe8',
                              border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                              display: 'block'
                            }}
                          >
                            <img
                              src={itemImage}
                              alt={item.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/assets/images/IMG_7098.webp';
                              }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Link>

                          <div>
                            <Link
                              to={item.slug ? `/product/${item.slug}` : '/shop'}
                              style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'var(--text-primary, #1c1c21)',
                                textDecoration: 'none',
                                display: 'block',
                                marginBottom: '0.35rem'
                              }}
                            >
                              {item.name}
                            </Link>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                background: 'rgba(179, 135, 40, 0.1)',
                                color: 'var(--accent-gold-dark, #8c6716)',
                                border: '1px solid rgba(179, 135, 40, 0.25)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}>
                                Size: {item.selectedSize || 'M'}
                              </span>

                              {item.selectedVariant && (
                                <span style={{
                                  fontSize: '0.75rem',
                                  background: 'rgba(0, 0, 0, 0.04)',
                                  color: 'var(--text-secondary, #525260)',
                                  border: '1px solid rgba(0, 0, 0, 0.08)',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '4px'
                                }}>
                                  {item.selectedVariant}
                                </span>
                              )}

                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #7e7e8c)' }}>
                                SKU: {item.sku || `XON-${item.id}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div style={{ textAlign: 'center' }} className="cart-col-price">
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary, #1c1c21)' }}>
                            ${unitPrice.toFixed(2)}
                          </span>
                          {isSale && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #7e7e8c)', textDecoration: 'line-through' }}>
                              ${item.price.toFixed(2)}
                            </div>
                          )}
                        </div>

                        {/* Stepper */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: '#f4efe8',
                            border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedVariant, item.quantity - 1)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary, #1c1c21)',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              aria-label="Decrease"
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{
                              minWidth: '32px',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              color: 'var(--text-primary, #1c1c21)'
                            }}>
                              {item.quantity}
                            </span>
                            <button
                              disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedVariant, item.quantity + 1)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary, #1c1c21)',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: (item.maxStock !== undefined && item.quantity >= item.maxStock) ? 'not-allowed' : 'pointer',
                                opacity: (item.maxStock !== undefined && item.quantity >= item.maxStock) ? 0.35 : 1
                              }}
                              title={item.maxStock !== undefined && item.quantity >= item.maxStock ? `Max stock (${item.maxStock}) reached` : 'Increase'}
                              aria-label="Increase"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold-dark, #8c6716)' }}>
                            ${lineTotal}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <div style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedVariant)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--status-error, #dc2626)',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.2s ease'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Bottom Toolbar */}
                <div style={{
                  padding: '1.25rem 1.5rem',
                  background: '#faf7f2',
                  borderTop: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.06))',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={clearCart}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--status-error, #dc2626)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Trash2 size={15} />
                    <span>Clear Entire Bag</span>
                  </button>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #525260)' }}>
                    Total Items: <strong style={{ color: 'var(--text-primary, #1c1c21)' }}>{totalCount}</strong>
                  </div>
                </div>
              </div>

              {/* Free Gifts & Promises */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '1.15rem',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                }}>
                  <Gift size={24} color="var(--accent-gold, #b38728)" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary, #1c1c21)' }}>Free Prep Kit</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #525260)' }}>Glue, tabs, buffer & stick included</div>
                  </div>
                </div>

                <div style={{
                  padding: '1.15rem',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                }}>
                  <ShieldCheck size={24} color="var(--accent-gold, #b38728)" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary, #1c1c21)' }}>Handcrafted Gel</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #525260)' }}>Reusable up to 30+ days wear</div>
                  </div>
                </div>

                <div style={{
                  padding: '1.15rem',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                }}>
                  <RotateCcw size={24} color="var(--accent-gold, #b38728)" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary, #1c1c21)' }}>Easy Support</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #525260)' }}>Dedicated sizing & style care</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.1))',
                borderRadius: '14px',
                padding: '1.65rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: 'var(--shadow-md, 0 8px 24px rgba(0, 0, 0, 0.06))'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary, #1c1c21)', letterSpacing: '0.02em' }}>
                  Order Summary
                </h2>

                {/* Promo Code Box */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #525260)', marginBottom: '0.4rem' }}>
                    Discount / Coupon Code
                  </label>
                  {promoCode ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(179, 135, 40, 0.08)',
                      border: '1px dashed var(--accent-gold, #b38728)',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-dark, #8c6716)' }}>
                        <Tag size={16} />
                        <span style={{ fontWeight: 800 }}>{promoCode.code}</span>
                        <span style={{ color: 'var(--text-secondary, #525260)', fontSize: '0.75rem' }}>({promoCode.description})</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        style={{ background: 'transparent', border: 'none', color: 'var(--status-error, #dc2626)', cursor: 'pointer', padding: '2px' }}
                        title="Remove coupon"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Enter code (e.g. XON10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.65rem 0.85rem',
                          background: '#fcfbf9',
                          border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                          borderRadius: '8px',
                          color: 'var(--text-primary, #1c1c21)',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: '#f4efe8',
                          border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                          color: 'var(--text-primary, #1c1c21)',
                          padding: '0.65rem 1.1rem',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#ebe4da'}
                        onMouseOut={e => e.currentTarget.style.background = '#f4efe8'}
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.9rem', color: 'var(--text-secondary, #525260)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ color: 'var(--text-primary, #1c1c21)', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-success, #059669)', fontWeight: 600 }}>
                      <span>Discount ({promoCode?.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping</span>
                    <span>
                      {isFreeShipping ? (
                        <span style={{ color: 'var(--status-success, #059669)', fontWeight: 700 }}>FREE</span>
                      ) : (
                        <span style={{ color: 'var(--text-primary, #1c1c21)' }}>${shippingFee.toFixed(2)}</span>
                      )}
                    </span>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border-subtle, rgba(0, 0, 0, 0.08))', margin: '0.4rem 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary, #1c1c21)' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--accent-gold-dark, #8c6716)' }}>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={openCheckout}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #c59b27 0%, #a67c1e 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(179, 135, 40, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>

                {/* Safe payment note */}
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted, #7e7e8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} color="var(--accent-gold, #b38728)" />
                  <span>Encrypted SSL 256-Bit Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        {recommendedProducts.length > 0 && (
          <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary, #1c1c21)', margin: 0 }}>
                  You May Also Love
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #525260)', margin: '0.25rem 0 0 0' }}>
                  Handcrafted silhouettes curated to pair with your selections.
                </p>
              </div>
              <Link to="/shop" style={{ color: 'var(--accent-gold-dark, #8c6716)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                View All →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {recommendedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 960px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
          .cart-table-header {
            display: none !important;
          }
          .cart-item-row {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .cart-col-price {
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}
