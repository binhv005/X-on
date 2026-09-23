import React from 'react';

export default function PriceDisplay({ price, salePrice, size = 'md' }) {
  const hasSale = salePrice !== null && salePrice !== undefined && salePrice < price;

  const fontSizes = {
    sm: '0.9rem',
    md: '1.1rem',
    lg: '1.4rem',
    xl: '1.8rem'
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
      {hasSale ? (
        <>
          <span style={{
            fontSize: fontSizes[size],
            fontWeight: 700,
            color: 'var(--accent-gold)'
          }}>
            ${salePrice.toFixed(2)}
          </span>
          <span style={{
            fontSize: `calc(${fontSizes[size]} * 0.85)`,
            color: 'var(--text-muted)',
            textDecoration: 'line-through'
          }}>
            ${price.toFixed(2)}
          </span>
        </>
      ) : (
        <span style={{
          fontSize: fontSizes[size],
          fontWeight: 700,
          color: 'var(--accent-gold-light)'
        }}>
          ${(price || 0).toFixed(2)}
        </span>
      )}
    </div>
  );
}
