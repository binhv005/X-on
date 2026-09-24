import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const CLOUDINARY_IMG_MAP = {
  'IMG_7098': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237942/x-on/products/IMG_7098.webp',
  'IMG_7099': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237944/x-on/products/IMG_7099.webp',
  'IMG_7100': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237945/x-on/products/IMG_7100.webp',
  'IMG_7101': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237948/x-on/products/IMG_7101.webp',
  'IMG_7102': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237953/x-on/products/IMG_7102.webp',
  'IMG_7103': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237957/x-on/products/IMG_7103.webp',
  'IMG_7104': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237959/x-on/products/IMG_7104.webp',
  'IMG_7105': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237962/x-on/products/IMG_7105.webp',
  'IMG_7106': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237964/x-on/products/IMG_7106.webp',
  'IMG_7107': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237967/x-on/products/IMG_7107.webp',
  'IMG_7110': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237968/x-on/products/IMG_7110.webp',
  'IMG_7111': 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237969/x-on/products/IMG_7111.webp'
};

function resolveProductImage(url) {
  if (!url || typeof url !== 'string') return 'https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237942/x-on/products/IMG_7098.webp';
  const clean = url.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  for (const [key, cdnUrl] of Object.entries(CLOUDINARY_IMG_MAP)) {
    if (clean === key || clean === `${key}.webp` || clean === `/assets/images/${key}.webp`) return cdnUrl;
  }
  return clean.startsWith('/') ? clean : `/${clean}`;
}

export default function ProductCard({ product, compact = false, imageAspect = '100%' }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isOutOfStock = product.status === 'out_of_stock' || (product.stock !== undefined && Number(product.stock) <= 0);
  const hasSale = !isOutOfStock && product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.price;
  const rawImages = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : (typeof product.images === 'string' && product.images ? [product.images] : []);
  const images = rawImages.length > 0 ? rawImages : [CLOUDINARY_IMG_MAP['IMG_7098']];
  const primaryImage = resolveProductImage(images[0] || CLOUDINARY_IMG_MAP['IMG_7098']);

  // Standard sizes to display (or from product)
  const allDisplaySizes = ['XS', 'S', 'M', 'L'];
  const hasSizeStock = product.size_stock && typeof product.size_stock === 'object' && Object.keys(product.size_stock).length > 0;
  const availableSizes = isOutOfStock ? [] : (product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L']).filter(s => {
    if (hasSizeStock && product.size_stock[s] !== undefined) {
      return Number(product.size_stock[s]) > 0;
    }
    return true;
  });

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'transparent',
        overflow: 'hidden'
      }}
    >
      {/* Product Image Container (Sharp Corners - No Border Radius) */}
      <div style={{ position: 'relative', width: '100%', borderRadius: '0px', overflow: 'hidden', background: '#f5f5f5' }}>
        <Link
          to={`/product/${product.slug}`}
          style={{
            position: 'relative',
            display: 'block',
            overflow: 'hidden',
            paddingTop: compact ? '85%' : imageAspect
          }}
        >
          {/* Primary Image with Smooth Hover Zoom In */}
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = CLOUDINARY_IMG_MAP['IMG_7098'];
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: isOutOfStock ? 'grayscale(35%)' : 'none',
              opacity: isOutOfStock ? 0.85 : 1,
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, filter 0.3s ease'
            }}
          />
        </Link>

        {/* Favorite Heart Button (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(prev => !prev);
          }}
          aria-label="Add to favorites"
          style={{
            position: 'absolute',
            top: '0.65rem',
            right: '0.65rem',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
            transition: 'all 0.2s ease',
            color: isFavorite ? '#ef4444' : '#374151'
          }}
        >
          <Heart size={17} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#374151'} />
        </button>

        {/* Status / Badges Container (Top Left) */}
        <div style={{
          position: 'absolute',
          top: '0.65rem',
          left: '0.65rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          zIndex: 2,
          pointerEvents: 'none'
        }}>
          {isOutOfStock ? (
            <span style={{
              padding: '3px 8px',
              borderRadius: '0px',
              background: 'rgba(17, 24, 39, 0.88)',
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Out of Stock
            </span>
          ) : (
            <>
              {Boolean(product.is_best_seller) && (
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '0px',
                  background: 'linear-gradient(135deg, #f88b80, #e26155)',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 6px rgba(232, 97, 84, 0.35)'
                }}>
                  ★ Best Seller
                </span>
              )}
              {Boolean(product.is_bundle) && (
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '0px',
                  background: 'rgba(15, 23, 42, 0.92)',
                  color: '#f8fafc',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  border: '1px solid rgba(232, 97, 84, 0.55)'
                }}>
                  Bundle & Save
                </span>
              )}
              {hasSale && (
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '0px',
                  background: 'rgba(220, 38, 38, 0.9)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  Sale
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Meta */}
      <div style={{ paddingTop: '0.85rem', paddingBottom: '0.5rem', display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h4 style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 0.35rem 0',
            lineHeight: 1.35,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.name}
          </h4>
        </Link>

        {/* Price */}
        <div style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {hasSale ? (
            <>
              <span>${product.sale_price?.toFixed(2)}</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 400 }}>
                ${product.price?.toFixed(2)}
              </span>
            </>
          ) : (
            <span>${(product.price || 0).toFixed(2)}</span>
          )}
        </div>

        {/* Size Selection Square Boxes */}
        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
          {allDisplaySizes.map(size => {
            const isAvailable = availableSizes.includes(size);
            return (
              <Link
                key={size}
                to={`/product/${product.slug}?size=${size}`}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0px',
                  border: isAvailable ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                  background: isAvailable
                    ? '#ffffff'
                    : 'linear-gradient(to top right, transparent calc(50% - 0.75px), #9ca3af, transparent calc(50% + 0.75px)) #f9fafb',
                  color: isAvailable ? 'var(--text-primary)' : '#9ca3af',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  cursor: isAvailable ? 'pointer' : 'default',
                  transition: 'all 0.15s ease'
                }}
                title={isAvailable ? `Size ${size}` : `Size ${size} (Out of stock)`}
              >
                {size}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

