import React, { useState, useEffect } from 'react';
import { Sparkles, Tag, Gift, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function BundleAndSavePage() {
  const [content, setContent] = useState(null);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBundleData() {
      try {
        setLoading(true);
        const [contentRes, productsRes] = await Promise.all([
          api.getPageContent('bundle').catch(() => ({ data: null })),
          api.getProducts({ all: 'true' }).catch(() => ({ data: [] }))
        ]);

        if (contentRes?.data) setContent(contentRes.data);

        const prods = productsRes?.data || [];
        // Filter products with is_bundle or sale discount
        const bundles = prods.filter(p => p.is_bundle || (p.sale_price && (p.price - p.sale_price) >= 5));
        setBundleProducts(bundles);
      } catch (err) {
        console.error('Error fetching bundle data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBundleData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading luxury bundles & saving packages..." />;
  }

  const heading = content?.heading || 'Bundle and Save';
  const subheading = content?.subheading || 'Curated luxury pairings and essential nail toolkits with exclusive discount pricing.';
  const bannerDiscount = content?.banner_discount || 'Up to 25% OFF';

  return (
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Banner Hero */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(18,18,22,0.95) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          marginBottom: '4rem',
          boxShadow: 'var(--shadow-gold)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            background: 'rgba(212, 175, 55, 0.25)',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold-light)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            <Tag size={15} /> Exclusive Savings: {bannerDiscount}
          </div>

          <h1 className="font-heading" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', color: '#fff', marginBottom: '1rem' }}>
            {heading}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: 1.7 }}>
            {subheading}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="var(--accent-gold)" /> 2+ Designer Nail Sets Included
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="var(--accent-gold)" /> Full Salon Pro Hold Glue (15ml)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="var(--accent-gold)" /> 120-Pack Ultra-Bond Adhesive Tabs
            </div>
          </div>
        </div>

        {/* Bundle Grid */}
        <div>
          <div className="section-header">
            <span className="brand-line">Curated Packages</span>
            <h2 className="section-title">Available Bundles & Value Sets</h2>
          </div>

          <div className="grid-3">
            {bundleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
