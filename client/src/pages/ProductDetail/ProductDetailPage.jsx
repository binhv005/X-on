import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2
} from 'lucide-react';
import { api } from '../../services/api';
import PriceDisplay from '../../components/product/PriceDisplay';
import RatingStars from '../../components/common/RatingStars';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart, items } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // description | additional | reviews
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await api.getProductBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data);
          if (res.data.images && res.data.images.length > 0) {
            setSelectedImage(res.data.images[0]);
          }
          if (res.data.sizes && res.data.sizes.length > 0) {
            setSelectedSize(res.data.sizes[0]);
          }
          if (res.data.variants && res.data.variants.length > 0) {
            setSelectedVariant(res.data.variants[0].name);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const hasSizeStock = product?.size_stock && typeof product.size_stock === 'object' && Object.keys(product.size_stock).length > 0;
  const currentSizeQty = hasSizeStock && selectedSize && product.size_stock[selectedSize] !== undefined
    ? Number(product.size_stock[selectedSize])
    : (Array.isArray(product?.sizes) && product.sizes.length > 0
        ? Math.max(0, Math.floor((Number(product?.stock) || 0) / product.sizes.length))
        : (product?.stock !== undefined ? Number(product.stock) : 99));

  const maxAvailable = Math.max(0, currentSizeQty);
  const isTotalOutOfStock = product?.status === 'out_of_stock' || (product?.stock !== undefined && Number(product?.stock) <= 0);
  const isOutOfStock = isTotalOutOfStock || maxAvailable <= 0;

  useEffect(() => {
    if (maxAvailable > 0) {
      setQuantity(prev => Math.max(1, Math.min(prev, maxAvailable)));
    }
  }, [selectedSize, maxAvailable]);

  const handleAddToCart = () => {
    if (!product || isOutOfStock) {
      addToast(currentSizeQty <= 0 ? `Size ${selectedSize} is currently out of stock.` : 'This product is currently out of stock.', 'error');
      return;
    }
    const currentInCart = items?.find(
      i => i.id === product.id && i.selectedSize === selectedSize && (i.selectedVariant || '') === (selectedVariant || '')
    )?.quantity || 0;

    if (currentInCart >= maxAvailable) {
      addToast(`You already have the maximum available quantity (${maxAvailable}) for Size ${selectedSize} in your bag.`, 'warning');
      return;
    }

    const qtyToAdd = Math.min(quantity, maxAvailable - currentInCart);
    addToCart(product, selectedSize, qtyToAdd, selectedVariant);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewEmail || !reviewComment) {
      addToast('Please complete all fields to submit your review.', 'error');
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await api.createReview({
        product_id: product.id,
        rating: reviewRating,
        name: reviewName,
        email: reviewEmail,
        comment: reviewComment
      });

      if (res.success) {
        setReviewSuccess(true);
        addToast('Thank you! Your review has been published.', 'success');
        // Update local review list
        setProduct(prev => ({
          ...prev,
          reviews: [res.data, ...(prev.reviews || [])],
          reviews_count: (prev.reviews_count || 0) + 1
        }));
        setReviewComment('');
        setReviewName('');
        setReviewEmail('');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading luxury product details..." />;
  }

  if (!product) {
    return (
      <div className="section-py container" style={{ textAlign: 'center' }}>
        <h2 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The product you are looking for may have been updated or removed.</p>
        <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="section-py" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--text-muted)' }}>Shop</Link>
          <span>/</span>
          <span style={{ color: 'var(--accent-gold-light)' }}>{product.name}</span>
        </div>

        {/* Product Showcase Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3.5rem', marginBottom: '4rem' }}>
          {/* Gallery Column */}
          <div>
            {/* Main Featured Image */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface)',
              position: 'relative',
              paddingTop: '100%',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img
                src={selectedImage || product.images?.[0] || '/assets/images/IMG_7098.JPG'}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/images/IMG_7098.JPG';
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />

              {/* Prev / Next Navigation Arrows (Only if multiple images) */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIdx = product.images.indexOf(selectedImage || product.images[0]);
                      const prevIdx = (currentIdx - 1 + product.images.length) % product.images.length;
                      setSelectedImage(product.images[prevIdx]);
                    }}
                    aria-label="Previous Image"
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 3,
                      boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s ease',
                      color: '#111827'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#ffffff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const currentIdx = product.images.indexOf(selectedImage || product.images[0]);
                      const nextIdx = (currentIdx + 1) % product.images.length;
                      setSelectedImage(product.images[nextIdx]);
                    }}
                    aria-label="Next Image"
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 3,
                      boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s ease',
                      color: '#111827'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#ffffff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'}
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Image Counter Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0.85rem',
                    right: '0.85rem',
                    background: 'rgba(15, 17, 21, 0.75)',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                    letterSpacing: '0.04em',
                    zIndex: 2
                  }}>
                    {Math.max(1, product.images.indexOf(selectedImage || product.images[0]) + 1)} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                scrollbarWidth: 'thin'
              }}>
                {product.images.map((img, idx) => {
                  const isActive = (selectedImage || product.images[0]) === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      style={{
                        width: '78px',
                        height: '78px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: isActive ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: '#ffffff',
                        padding: 0,
                        cursor: 'pointer',
                        flexShrink: 0,
                        position: 'relative',
                        boxShadow: isActive ? '0 0 0 2px rgba(212, 175, 55, 0.25)' : 'none',
                        opacity: isActive ? 1 : 0.75,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.opacity = '0.75';
                      }}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/IMG_7098.JPG';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Meta & Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
              <span className="brand-line" style={{ display: 'inline-block' }}>
                {product.shape ? `${product.shape} Shape | ${product.product_type}` : product.product_type}
              </span>
              {Boolean(product.is_best_seller) && (
                <span style={{
                  padding: '2px 9px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 5px rgba(212,175,55,0.3)'
                }}>
                  ★ Best Seller
                </span>
              )}
              {Boolean(product.is_bundle) && (
                <span style={{
                  padding: '2px 9px',
                  borderRadius: '12px',
                  background: '#0f172a',
                  color: '#f8fafc',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  border: '1px solid var(--border-gold)'
                }}>
                  Bundle & Save
                </span>
              )}
            </div>

            <h1 className="font-heading" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Rating and Reviews header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <RatingStars rating={product.rating || 5} size={18} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {product.rating || 5.0} ({product.reviews_count || product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price Display & Stock Status */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <PriceDisplay price={product.price} salePrice={product.sale_price} size="xl" />
              {isTotalOutOfStock ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  ● Out of Stock
                </span>
              ) : currentSizeQty <= 0 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}>
                  ● Size {selectedSize} Out of Stock
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}>
                  ● In Stock {hasSizeStock && selectedSize && product.size_stock?.[selectedSize] !== undefined ? `(${currentSizeQty} available for Size ${selectedSize})` : `(${product.stock} available)`}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.98rem' }}>
              {product.description}
            </p>

            {/* Shape, Variant and Size Selection */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Select Length & Style:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v.name)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: selectedVariant === v.name ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                        color: selectedVariant === v.name ? '#fff' : 'var(--text-secondary)',
                        border: selectedVariant === v.name ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Select Size:
                  </label>
                  <Link to="/sizing-chart" style={{ fontSize: '0.80rem', color: 'var(--accent-gold-dark)', textDecoration: 'underline' }}>
                    Sizing Guide
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizes.map((s) => {
                    const szStock = hasSizeStock && product.size_stock?.[s] !== undefined ? Number(product.size_stock[s]) : (product.stock || 1);
                    const isSzOut = szStock <= 0;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: selectedSize === s ? 'var(--accent-gold)' : isSzOut ? 'rgba(0,0,0,0.03)' : 'var(--bg-secondary)',
                          color: selectedSize === s ? '#fff' : isSzOut ? 'var(--text-muted)' : 'var(--text-secondary)',
                          border: selectedSize === s ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                          textDecoration: isSzOut ? 'line-through' : 'none',
                          opacity: isSzOut ? 0.6 : 1
                        }}
                        title={isSzOut ? `Size ${s} is out of stock` : `Size ${s} (${szStock} in stock)`}
                      >
                        {s} {isSzOut ? '(Out)' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--border-medium)',
                borderRadius: '6px',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
                opacity: isOutOfStock ? 0.5 : 1
              }}>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: isOutOfStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span style={{ padding: '0.75rem 1rem', minWidth: '40px', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= maxAvailable}
                  onClick={() => setQuantity(prev => Math.min(maxAvailable, prev + 1))}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: (isOutOfStock || quantity >= maxAvailable) ? 'not-allowed' : 'pointer',
                    opacity: (isOutOfStock || quantity >= maxAvailable) ? 0.35 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={quantity >= maxAvailable ? `Maximum stock of ${maxAvailable} reached` : 'Increase quantity'}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  background: isOutOfStock ? '#4b5563' : undefined,
                  borderColor: isOutOfStock ? '#4b5563' : undefined,
                  color: '#ffffff',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  opacity: isOutOfStock ? 0.85 : 1
                }}
              >
                <ShoppingBag size={18} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* SKU and Meta */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.85rem'
            }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>SKU:</strong>{' '}
                <span style={{ color: 'var(--text-primary)' }}>{product.SKU}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Categories:</strong>{' '}
                <span style={{ color: 'var(--text-primary)' }}>
                  {Array.isArray(product.categories) ? product.categories.join(', ') : product.product_type}
                </span>
              </div>
              {product.shape && (
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Shape:</strong>{' '}
                  <span style={{ color: 'var(--text-primary)' }}>{product.shape}</span>
                </div>
              )}
            </div>

            {/* Value Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem', textAlign: 'center' }}>
              <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <ShieldCheck size={18} color="var(--accent-gold)" style={{ margin: '0 auto 0.3rem auto' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Salon Strength</span>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <Truck size={18} color="var(--accent-gold)" style={{ margin: '0 auto 0.3rem auto' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Fast Studio Ship</span>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <RotateCcw size={18} color="var(--accent-gold)" style={{ margin: '0 auto 0.3rem auto' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Reusable 5x+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '5rem'
        }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                padding: '1.25rem 2rem',
                background: activeTab === 'description' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'description' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                color: activeTab === 'description' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              style={{
                padding: '1.25rem 2rem',
                background: activeTab === 'additional' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'additional' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                color: activeTab === 'additional' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '1.25rem 2rem',
                background: activeTab === 'reviews' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'reviews' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                color: activeTab === 'reviews' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2.5rem' }}>
            {activeTab === 'description' && (
              <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                <h3 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.3rem' }}>
                  Artisan Handcrafted Quality
                </h3>
                <p style={{ marginBottom: '1.25rem' }}>{product.description}</p>
                <p>
                  Every X-ON handmade press-on nail is created with the philosophy that modern nail artistry should meet effortless beauty. From statement-making nail sets to everyday professional supplies, every product is chosen to make beautiful nails easier, faster, and more accessible—without compromising on a polished, luxury finish.
                </p>
              </div>
            )}

            {activeTab === 'additional' && (
              <div>
                <h3 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                  Specifications & Application
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <tbody>
                    {product.additional_info && typeof product.additional_info === 'object' ? (
                      Object.entries(product.additional_info).map(([k, v]) => (
                        <tr key={k} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--accent-gold-dark)', width: '30%', textTransform: 'capitalize' }}>
                            {k.replace(/_/g, ' ')}
                          </td>
                          <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{v}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>
                          Includes 10 Handcrafted Nails, Professional Salon Glue, 24 Adhesive Tabs, Cuticle Pusher, Mini File & Alcohol Prep Pads.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Existing Reviews */}
                <h3 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                  Customer Feedback
                </h3>

                {product.reviews && product.reviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                    {product.reviews.map(rev => (
                      <div key={rev.id} style={{ padding: '1.5rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rev.name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                        </div>
                        <RatingStars rating={rev.rating} size={15} />
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>No reviews yet. Be the first to share your experience with this set!</p>
                )}

                {/* Review Form */}
                <div style={{
                  padding: '2rem',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-gold)'
                }}>
                  <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1.15rem', marginBottom: '1.25rem' }}>
                    Write a Review
                  </h4>

                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Rating *</label>
                      <RatingStars rating={reviewRating} size={22} interactive onChange={setReviewRating} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-input"
                          value={reviewEmail}
                          onChange={e => setReviewEmail(e.target.value)}
                          placeholder="Your email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Review *</label>
                      <textarea
                        rows="4"
                        className="form-textarea"
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Tell others what you love about this nail set..."
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={reviewSubmitting}
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.related && product.related.length > 0 && (
          <div>
            <div className="section-header">
              <span className="brand-line">Complete Your Look</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="grid-4">
              {product.related.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
