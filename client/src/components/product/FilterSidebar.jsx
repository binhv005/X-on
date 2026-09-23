import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedShape,
  setSelectedShape,
  selectedProductType,
  setSelectedProductType,
  selectedTheme,
  setSelectedTheme,
  onReset
}) {
  const shapes = ['Almond', 'Coffin', 'Oval', 'Round', 'Square', 'Stiletto'];
  const productTypes = ['Best Sellers', 'Handmade Press-On Nails', 'Nail Essentials'];
  const themes = ['Minimalist Chic', 'Glitz & Glamour', 'French Modern', 'Cat Eye & Chrome'];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-light)', fontWeight: 600 }}>
          <Filter size={18} />
          <span className="font-heading" style={{ fontSize: '1rem' }}>Filter Products</span>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Reset all filters"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Product Type Filter */}
      <div>
        <h5 className="form-label" style={{ marginBottom: '0.6rem' }}>Product Type</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="product_type"
              checked={!selectedProductType}
              onChange={() => setSelectedProductType('')}
              style={{ accentColor: 'var(--accent-gold)' }}
            />
            <span style={{ color: !selectedProductType ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>All Types</span>
          </label>
          {productTypes.map(pt => (
            <label key={pt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="product_type"
                checked={selectedProductType.toLowerCase() === pt.toLowerCase()}
                onChange={() => setSelectedProductType(pt)}
                style={{ accentColor: 'var(--accent-gold)' }}
              />
              <span style={{ color: selectedProductType.toLowerCase() === pt.toLowerCase() ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>
                {pt}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Shape Filter */}
      <div>
        <h5 className="form-label" style={{ marginBottom: '0.6rem' }}>Nail Shape</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
          {shapes.map(shape => {
            const isSelected = selectedShape.toLowerCase() === shape.toLowerCase();
            return (
              <button
                key={shape}
                type="button"
                onClick={() => setSelectedShape(isSelected ? '' : shape)}
                style={{
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-secondary)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {shape}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h5 className="form-label" style={{ marginBottom: '0.6rem' }}>Price Range ($)</h5>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            placeholder="Min"
            className="form-input"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            style={{ padding: '0.5rem 0.6rem', fontSize: '0.85rem' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input
            type="number"
            placeholder="Max"
            className="form-input"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            style={{ padding: '0.5rem 0.6rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Design Themes */}
      <div>
        <h5 className="form-label" style={{ marginBottom: '0.6rem' }}>Design Theme</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {themes.map(theme => {
            const isSelected = selectedTheme.toLowerCase() === theme.toLowerCase();
            return (
              <label key={theme} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => setSelectedTheme(isSelected ? '' : theme)}
                  style={{ accentColor: 'var(--accent-gold)' }}
                />
                <span style={{ color: isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>{theme}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
