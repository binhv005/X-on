import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Copy, Check, Percent, ArrowRight, Star } from 'lucide-react';
import { api } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import bundleBannerBg from '../../assets/images/bundle-banner-bg.webp';

export default function BundleAndSavePage() {
  const [content, setContent] = useState(null);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const { addToast } = useToast();

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

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Promo code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(''), 3000);
  };

  if (loading) {
    return <LoadingSpinner text="Loading luxury bundles & saving packages..." />;
  }

  const heading = content?.heading || 'Bundle and Save';
  const subheading = content?.subheading || 'Luxury nail pairings & essential toolkits at exclusive bundle prices.';

  const discountTiers = [
    {
      id: 'duo',
      name: 'Duo Glow Pair',
      discount: '15% OFF',
      requirement: 'Buy Any 2 Nail Sets',
      code: 'DUO15',
      perk: 'Free Adhesive Prep Kit included',
      popular: false,
      color: '#d4af37'
    },
    {
      id: 'trio',
      name: 'Trio Glam Suite',
      discount: '20% OFF',
      requirement: 'Buy Any 3 Nail Sets',
      code: 'TRIO20',
      perk: 'Free Organic Cuticle Oil + Fast Shipping',
      popular: true,
      color: '#cfa83b'
    },
    {
      id: 'master',
      name: 'Salon Master Vault',
      discount: '25% OFF',
      requirement: 'Buy 4+ Nail Sets or Bundles',
      code: 'MASTER25',
      perk: 'Free Full Toolkit (Glue, Tabs, Oil & Buffer)',
      popular: false,
      color: '#e11d48'
    }
  ];

  return (
    <div>
      {/* Full-width Hero Banner with Dark Overlay and No Edge Gaps */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `radial-gradient(circle at center, rgba(15, 15, 18, 0.42) 0%, rgba(15, 15, 18, 0.72) 100%), url(${bundleBannerBg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: '3.5rem 1.5rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '850px', position: 'relative', zIndex: 2 }}>
          <h1 className="font-heading" style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            textShadow: '0 3px 20px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.9)'
          }}>
            {heading}
          </h1>
          <p style={{
            color: '#f3f4f6',
            fontSize: '1.15rem',
            maxWidth: '720px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontWeight: 500,
            textWrap: 'balance',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
          }}>
            {subheading}
          </p>
        </div>
      </section>

      <div className="section-py" style={{ paddingTop: '4rem' }}>
        <div className="container">

        {/* Section: Discount Cards (Bundle & Save Tiers) */}
        <div style={{ marginBottom: '4.5rem' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Percent size={15} /> Stack & Save Discounts
            </span>
            <h2 className="section-title">Bundle Discount Cards</h2>
            <p className="section-subtitle">
              Combine your favorite styles or grab a pre-packaged suite and apply these codes at checkout.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}>
            {discountTiers.map(tier => {
              const discountPercent = tier.discount.replace(/[^0-9%]/g, '');

              return (
                <div
                  key={tier.id}
                  style={{
                    position: 'relative',
                    borderRadius: '24px',
                    padding: '2.5rem 1.75rem 1.75rem 1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    background: `
                      linear-gradient(120deg, rgba(255,255,255,0.42) 0%, rgba(0,0,0,0.03) 30%, rgba(255,255,255,0.48) 50%, rgba(0,0,0,0.05) 75%, rgba(255,255,255,0.32) 100%),
                      linear-gradient(135deg, #e4d5c8 0%, #ecdccf 35%, #dbc5b4 70%, #eadbd0 100%)
                    `,
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(110, 70, 45, 0.08)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(110, 70, 45, 0.14)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(110, 70, 45, 0.08)';
                  }}
                >

                  <div>
                    {/* Top Tier Title & "Sale" Script */}
                    <div style={{ position: 'relative', marginBottom: '1.25rem', marginTop: '0.25rem' }}>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: '#ab4e2e',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-heading)'
                      }}>
                        {tier.name}
                      </div>
                      <div style={{
                        fontFamily: '"Alex Brush", "Playfair Display", cursive',
                        fontSize: '3.2rem',
                        color: '#7a7646',
                        marginTop: '-1.1rem',
                        marginBottom: '-0.4rem',
                        lineHeight: 1,
                        userSelect: 'none',
                        transform: 'rotate(-4deg)'
                      }}>
                        Sale
                      </div>
                    </div>

                    {/* Giant Discount Number with UPTO & OFF */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      marginBottom: '1.25rem',
                      lineHeight: 1
                    }}>
                      <span style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#ab4e2e',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}>
                        UPTO
                      </span>
                      <span style={{
                        fontSize: '4.2rem',
                        fontWeight: 800,
                        color: '#ab4e2e',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em'
                      }}>
                        {discountPercent}
                      </span>
                      <span style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#ab4e2e',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}>
                        OFF
                      </span>
                    </div>

                    {/* Requirements & Perks */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#5e321e',
                        textTransform: 'uppercase'
                      }}>
                        {tier.requirement}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        color: '#7d4e38',
                        textTransform: 'uppercase',
                        lineHeight: 1.45
                      }}>
                        {tier.perk}
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Box */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(8px)',
                    border: '1px dashed rgba(171, 78, 46, 0.45)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{
                        display: 'block',
                        fontSize: '0.68rem',
                        textTransform: 'uppercase',
                        color: '#8c5943',
                        fontWeight: 700,
                        letterSpacing: '0.08em'
                      }}>
                        Promo Code
                      </span>
                      <span style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        color: '#ab4e2e'
                      }}>
                        {tier.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(tier.code)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ab4e2e',
                        color: '#ab4e2e',
                        borderRadius: '8px',
                        padding: '0.38rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = '#ab4e2e';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#ab4e2e';
                      }}
                      title="Copy code"
                    >
                      {copiedCode === tier.code ? (
                        <>
                          <Check size={14} color="#10b981" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bundle Grid: Available Bundles & Value Sets */}
        <div>
          <div className="section-header">
            <span className="brand-line">Ready-To-Ship Sets</span>
            <h2 className="section-title">Available Bundles & Value Sets</h2>
            <p className="section-subtitle">
              Instant savings on all-inclusive nail suites and pairing collections.
            </p>
          </div>

          <div className="grid-3">
            {bundleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

