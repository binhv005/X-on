import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  Truck,
  Building2,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
    subtotal,
    shippingFee,
    discountAmount,
    finalTotal,
    promoCode
  } = useCart();

  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Ho Chi Minh',
    note: '',
    paymentMethod: 'cod' // 'cod' | 'card' | 'bank_transfer'
  });

  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addToast('Please provide your full name', 'error');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      addToast('Please enter an email address or phone number for order updates', 'error');
      return;
    }
    if (!formData.address.trim()) {
      addToast('Please enter your shipping address', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const lineItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.sale_price !== null && item.sale_price !== undefined ? item.sale_price : item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedVariant: item.selectedVariant || '',
        image: item.images && item.images.length > 0 ? item.images[0] : '/assets/images/IMG_7098.JPG',
        sku: item.sku || `XON-${item.id}`
      }));

      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim() || 'customer@example.com',
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city,
          note: formData.note.trim()
        },
        line_items: lineItems,
        shipping: shippingFee,
        discount: discountAmount,
        promo_code: promoCode ? promoCode.code : null,
        payment_metadata: {
          method: formData.paymentMethod,
          channel: formData.paymentMethod === 'cod' ? 'Cash On Delivery' : formData.paymentMethod === 'card' ? 'Online Card' : 'Bank Transfer'
        },
        shipping_metadata: {
          address: formData.address.trim(),
          city: formData.city,
          method: 'Standard Express Shipping'
        }
      };

      const res = await api.createOrder(orderPayload);
      if (res && (res.success || res.data)) {
        const created = res.data || res;
        setCompletedOrder(created);
        clearCart();
        addToast('Order placed successfully! Thank you for choosing X-ON.', 'success');
      } else {
        throw new Error('Could not create order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      addToast(err.message || 'Failed to complete order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    closeCheckout();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(28, 28, 33, 0.55)',
          backdropFilter: 'blur(6px)'
        }}
      />

      {/* Modal Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        background: '#ffffff',
        border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.1))',
        borderRadius: '16px',
        color: 'var(--text-primary, #1c1c21)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        zIndex: 2,
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#faf7f2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--accent-gold, #b38728)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary, #1c1c21)' }}>
              {completedOrder ? 'Order Confirmed' : 'Checkout & Delivery'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary, #1c1c21)',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {completedOrder ? (
            /* Success confirmation screen */
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(5, 150, 105, 0.1)',
                border: '2px solid #059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: '#059669'
              }}>
                <CheckCircle2 size={40} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary, #1c1c21)', marginBottom: '0.4rem' }}>
                Thank You For Your Order!
              </h3>
              <p style={{ color: 'var(--text-secondary, #525260)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Your order <strong style={{ color: 'var(--accent-gold-dark, #8c6716)' }}>{completedOrder.id || 'XON-ORD'}</strong> has been placed and is being prepared with haute couture craftsmanship.
              </p>

              <div style={{
                background: '#faf7f2',
                border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                borderRadius: '10px',
                padding: '1.25rem',
                textAlign: 'left',
                maxWidth: '480px',
                margin: '0 auto 1.5rem auto',
                fontSize: '0.85rem',
                lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted, #7e7e8c)' }}>Recipient:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary, #1c1c21)' }}>{formData.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted, #7e7e8c)' }}>Delivery Address:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary, #1c1c21)' }}>{formData.address}, {formData.city}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted, #7e7e8c)' }}>Payment:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-gold-dark, #8c6716)' }}>
                    {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod === 'card' ? 'Online Card' : 'Bank Transfer'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))' }}>
                  <span style={{ color: 'var(--text-muted, #7e7e8c)' }}>Total Amount:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary, #1c1c21)', fontSize: '1rem' }}>${(completedOrder.total || finalTotal).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                style={{
                  background: 'linear-gradient(135deg, #c59b27 0%, #a67c1e 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.8rem 2.25rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(179, 135, 40, 0.25)'
                }}
              >
                Back to Storefront
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Shipping Address Information */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold-dark, #8c6716)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={16} /> 1. Shipping Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary, #525260)', fontWeight: 600, marginBottom: '0.35rem' }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jessica Nguyen"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: '#fcfbf9',
                        border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                        borderRadius: '6px',
                        color: 'var(--text-primary, #1c1c21)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary, #525260)', fontWeight: 600, marginBottom: '0.35rem' }}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +84 901 234 567"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: '#fcfbf9',
                        border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                        borderRadius: '6px',
                        color: 'var(--text-primary, #1c1c21)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary, #525260)', fontWeight: 600, marginBottom: '0.35rem' }}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: '#fcfbf9',
                        border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                        borderRadius: '6px',
                        color: 'var(--text-primary, #1c1c21)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary, #525260)', fontWeight: 600, marginBottom: '0.35rem' }}>City / Region</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Ho Chi Minh City / California"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: '#fcfbf9',
                        border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                        borderRadius: '6px',
                        color: 'var(--text-primary, #1c1c21)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary, #525260)', fontWeight: 600, marginBottom: '0.35rem' }}>Delivery Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, Apartment / House number, District"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: '#fcfbf9',
                      border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                      borderRadius: '6px',
                      color: 'var(--text-primary, #1c1c21)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ marginTop: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary, #525260)', fontWeight: 600, marginBottom: '0.35rem' }}>Order Note / Custom Sizing Details (Optional)</label>
                  <textarea
                    name="note"
                    rows={2}
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Special delivery notes or custom finger measurements..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: '#fcfbf9',
                      border: '1px solid var(--border-medium, rgba(0, 0, 0, 0.14))',
                      borderRadius: '6px',
                      color: 'var(--text-primary, #1c1c21)',
                      fontSize: '0.85rem',
                      resize: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold-dark, #8c6716)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={16} /> 2. Payment Method
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {/* Cash on Delivery (Active) */}
                  <label style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: `1.5px solid ${formData.paymentMethod === 'cod' ? 'var(--accent-gold, #b38728)' : 'var(--border-subtle, rgba(0, 0, 0, 0.1))'}`,
                    background: formData.paymentMethod === 'cod' ? '#fdf8ee' : '#faf7f2',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: formData.paymentMethod === 'cod' ? '0 2px 8px rgba(179, 135, 40, 0.12)' : 'none',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      style={{ accentColor: 'var(--accent-gold, #b38728)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary, #1c1c21)' }}>Cash on Delivery</span>
                        <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Khả dụng</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #525260)' }}>Thanh toán tiền mặt khi nhận hàng</div>
                    </div>
                  </label>

                  {/* Card Payment (Disabled) */}
                  <div style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1.5px dashed rgba(0, 0, 0, 0.15)',
                    background: '#f6f5f2',
                    cursor: 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    opacity: 0.65,
                    userSelect: 'none'
                  }}>
                    <input
                      type="radio"
                      disabled
                      checked={false}
                      style={{ cursor: 'not-allowed' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted, #7e7e8c)' }}>Card Payment</span>
                        <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Đang phát triển</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #7e7e8c)' }}>Visa, MasterCard, JCB (Sắp ra mắt)</div>
                    </div>
                  </div>

                  {/* Bank Transfer (Disabled) */}
                  <div style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1.5px dashed rgba(0, 0, 0, 0.15)',
                    background: '#f6f5f2',
                    cursor: 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    opacity: 0.65,
                    userSelect: 'none'
                  }}>
                    <input
                      type="radio"
                      disabled
                      checked={false}
                      style={{ cursor: 'not-allowed' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted, #7e7e8c)' }}>Bank Transfer</span>
                        <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Đang phát triển</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #7e7e8c)' }}>Instant QR transfer (Sắp ra mắt)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div style={{
                background: '#faf7f2',
                border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                borderRadius: '8px',
                padding: '1rem 1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-secondary, #525260)' }}>
                  <span>Items Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'}):</span>
                  <span style={{ color: 'var(--text-primary, #1c1c21)', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--status-success, #059669)', fontWeight: 600 }}>
                    <span>Coupon Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary, #525260)' }}>
                  <span>Shipping:</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: 'var(--status-success, #059669)' }}>FREE</strong> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary, #1c1c21)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))' }}>
                  <span>Total Due:</span>
                  <span style={{ color: 'var(--accent-gold-dark, #8c6716)' }}>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || items.length === 0}
                style={{
                  background: 'linear-gradient(135deg, #c59b27 0%, #a67c1e 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(179, 135, 40, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order • ${finalTotal.toFixed(2)}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
