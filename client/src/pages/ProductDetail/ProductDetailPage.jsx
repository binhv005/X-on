import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
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
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
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
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedSize, quantity);
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
        <h2 className="font-heading" style={{ color: '#fff', marginBottom: '1rem' }}>Product Not Found</h2>
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
              marginBottom: '1rem'
            }}>
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      background: 'transparent',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Meta & Actions */}
          <div>
            <span className="brand-line" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
              {product.shape ? `${product.shape} Shape | ${product.product_type}` : product.product_type}
            </span>

            <h1 className="font-heading" style={{ fontSize: '2.2rem', color: '#fff', lineHeight: 1.25, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Rating and Reviews header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <RatingStars rating={product.rating || 5} size={18} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {product.rating || 5.0} ({product.reviews_count || product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price Display */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <PriceDisplay price={product.price} salePrice={product.sale_price} size="xl" />
            </div>

            {/* Short Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.98rem' }}>
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Select Size:</label>
                  <Link to="/sizing-chart" style={{ fontSize: '0.8rem', color: 'var(--accent-gold-light)', textDecoration: 'underline' }}>
                    Sizing Chart & Fit Guide
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '6px',
                        border: selectedSize === size ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: selectedSize === size ? 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.1) 100%)' : 'var(--bg-secondary)',
                        color: selectedSize === size ? '#fff' : 'var(--text-secondary)',
                        fontWeight: selectedSize === size ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                background: 'var(--bg-secondary)',
                overflow: 'hidden'
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ padding: '0.75rem 1rem', minWidth: '40px', textAlign: 'center', fontWeight: 600 }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                style={{ flex: 1, minWidth: '200px' }}
              >
                <ShoppingBag size={18} /> Add to Cart
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
                color: activeTab === 'description' ? '#fff' : 'var(--text-secondary)',
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
                color: activeTab === 'additional' ? '#fff' : 'var(--text-secondary)',
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
                color: activeTab === 'reviews' ? '#fff' : 'var(--text-secondary)',
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
                <h3 className="font-heading" style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.3rem' }}>
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
                <h3 className="font-heading" style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                  Specifications & Application
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <tbody>
                    {product.additional_info && typeof product.additional_info === 'object' ? (
                      Object.entries(product.additional_info).map(([k, v]) => (
                        <tr key={k} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--accent-gold-light)', width: '30%', textTransform: 'capitalize' }}>
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
                <h3 className="font-heading" style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                  Customer Feedback
                </h3>

                {product.reviews && product.reviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                    {product.reviews.map(rev => (
                      <div key={rev.id} style={{ padding: '1.5rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: '#fff' }}>{rev.name}</span>
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
