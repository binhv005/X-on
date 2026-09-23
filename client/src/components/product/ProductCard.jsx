import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import PriceDisplay from './PriceDisplay';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasSale = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.price;
  const image = product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80';

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultSize, 1);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} style={{ position: 'relative', display: 'block', overflow: 'hidden', paddingTop: '100%' }}>
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Badges Overlay */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 2 }}>
          {hasSale && (
            <span className="badge badge-sale">
              Sale
            </span>
          )}
          {product.is_best_seller && (
            <span className="badge badge-gold">
              Best Seller
            </span>
          )}
          {product.is_bundle && (
            <span className="badge badge-gold">
              Bundle & Save
            </span>
          )}
        </div>

        {/* Quick View Button */}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          right: '0.75rem',
          zIndex: 2,
          opacity: 0.9
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(18, 18, 22, 0.85)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--border-medium)',
            color: '#fff'
          }}>
            <Eye size={16} />
          </span>
        </div>
      </Link>

      {/* Product Meta */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Shape / Product Type indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              {product.shape ? `${product.shape} Shape` : product.product_type || 'Nail Artistry'}
            </span>
            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RatingStars rating={product.rating} size={12} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({product.reviews_count || 0})</span>
              </div>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.4,
              marginBottom: '0.6rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.name}
            </h4>
          </Link>

          {/* Sizes / Variant Indicator */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <span
                  key={size}
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: '0.5rem'
        }}>
          <PriceDisplay price={product.price} salePrice={product.sale_price} size="md" />

          {product.sizes && product.sizes.length > 1 ? (
            <Link
              to={`/product/${product.slug}`}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            >
              Select options
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              title="Add to cart"
            >
              <ShoppingBag size={14} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
