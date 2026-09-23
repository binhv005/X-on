import React, { useState, useEffect } from 'react';
import { Sparkles, Tag, Gift, CheckCircle, Copy, Check, Percent, ArrowRight, Star } from 'lucide-react';
import { api } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

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
  const subheading = content?.subheading || 'Curated luxury pairings and essential nail toolkits with exclusive discount pricing.';
  const bannerDiscount = content?.banner_discount || 'Up to 25% OFF';

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
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Banner Hero: Bundle Title with Bright Luxury Boho Motifs */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #fdf8f2 0%, #faefe2 50%, #fdf9f4 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          marginBottom: '3.5rem',
          boxShadow: '0 12px 36px rgba(180, 140, 75, 0.08)',
          overflow: 'hidden'
        }}>
          {/* Decorative Boho Organic SVG Motifs Background */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0
            }}
            viewBox="0 0 1000 360"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Left Mustard Blob */}
            <path
              d="M-40 -40 C60 -40 150 10 130 95 C110 170 15 160 -40 130 Z"
              fill="#f5b041"
              opacity="0.75"
            />
            {/* Top Left White Dots Pattern on Yellow Blob */}
            <g opacity="0.8" fill="#ffffff">
              <circle cx="15" cy="40" r="3.5" />
              <circle cx="35" cy="30" r="3.5" />
              <circle cx="55" cy="20" r="3.5" />
              <circle cx="30" cy="55" r="3.5" />
              <circle cx="50" cy="45" r="3.5" />
              <circle cx="70" cy="35" r="3.5" />
              <circle cx="45" cy="70" r="3.5" />
              <circle cx="65" cy="60" r="3.5" />
            </g>

            {/* Top Left Botanical Olive Branch */}
            <path
              d="M-10 140 Q60 110 135 60"
              stroke="#6b7c53"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path d="M30 115 C25 100 40 95 45 110 C40 120 32 120 30 115 Z" fill="#6b7c53" opacity="0.85" />
            <path d="M60 98 C65 85 80 85 80 100 C75 108 65 105 60 98 Z" fill="#6b7c53" opacity="0.85" />
            <path d="M85 80 C80 65 95 62 100 75 C95 85 88 85 85 80 Z" fill="#6b7c53" opacity="0.85" />
            <path d="M115 65 C120 52 135 55 132 68 C128 75 118 72 115 65 Z" fill="#6b7c53" opacity="0.85" />

            {/* Top Center Floating Elements */}
            <circle cx="460" cy="15" r="45" fill="#f8d6ab" opacity="0.65" />
            {/* Cute Peach Dots Matrix */}
            <g opacity="0.6" fill="#e79c78">
              <circle cx="230" cy="25" r="3" />
              <circle cx="245" cy="25" r="3" />
              <circle cx="260" cy="25" r="3" />
              <circle cx="230" cy="40" r="3" />
              <circle cx="245" cy="40" r="3" />
              <circle cx="260" cy="40" r="3" />
            </g>
            {/* Little Heart */}
            <path
              d="M580 40 C580 32 590 28 596 35 C602 28 612 32 612 40 C612 50 596 60 596 60 C596 60 580 50 580 40 Z"
              fill="#e76f51"
              opacity="0.75"
              transform="scale(0.8) translate(140, -10)"
            />

            {/* Top Right Dusty Blue Blob */}
            <path
              d="M620 -40 C660 30 720 50 780 10 C820 -20 830 -40 830 -40 Z"
              fill="#749cb8"
              opacity="0.75"
            />
            {/* Top Right Sage Green Organic Blob */}
            <path
              d="M820 -40 C850 40 930 70 1030 50 L1030 -40 Z"
              fill="#98a87b"
              opacity="0.8"
            />
            {/* White Dots on Green Blob */}
            <g opacity="0.85" fill="#ffffff">
              <circle cx="910" cy="20" r="3.5" />
              <circle cx="930" cy="15" r="3.5" />
              <circle cx="950" cy="25" r="3.5" />
              <circle cx="920" cy="38" r="3.5" />
              <circle cx="940" cy="32" r="3.5" />
              <circle cx="960" cy="42" r="3.5" />
            </g>
            {/* Dashed Curved Line */}
            <path
              d="M750 30 Q760 100 860 120"
              stroke="#6b5b45"
              strokeWidth="2.5"
              strokeDasharray="6,6"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* Bottom Left Peach Blob */}
            <path
              d="M-40 250 C40 230 110 270 90 350 C80 390 -40 390 -40 390 Z"
              fill="#f5ba9e"
              opacity="0.75"
            />
            {/* Bottom Left Organic Orange Swirl */}
            <path
              d="M-30 310 Q60 300 130 380"
              stroke="#e89838"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            {/* Bottom Left Dashed Angled Lines */}
            <g opacity="0.65" stroke="#718fa6" strokeWidth="2.5" strokeLinecap="round">
              <line x1="10" y1="230" x2="25" y2="215" />
              <line x1="25" y1="240" x2="40" y2="225" />
              <line x1="40" y1="250" x2="55" y2="235" />
              <line x1="20" y1="260" x2="35" y2="245" />
              <line x1="35" y1="270" x2="50" y2="255" />
            </g>

            {/* Bottom Right Dusty Navy Blob */}
            <path
              d="M870 390 C850 300 930 250 1030 290 L1030 390 Z"
              fill="#6a879d"
              opacity="0.85"
            />
            {/* Bottom Right Floating Little Triangles */}
            <polygon points="840,230 855,240 840,250" fill="#f4ad3b" opacity="0.85" />
            <polygon points="865,245 880,255 860,262" fill="#8ca59c" opacity="0.8" />
            <polygon points="850,270 860,285 845,282" fill="#6f899e" opacity="0.8" />

            {/* Bottom Right Berry Branch */}
            <path
              d="M740 380 Q710 320 670 290"
              stroke="#54483a"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <line x1="710" y1="340" x2="735" y2="330" stroke="#54483a" strokeWidth="1.8" opacity="0.85" />
            <circle cx="742" cy="328" r="6" fill="#e79c50" opacity="0.9" />
            <line x1="695" y1="315" x2="708" y2="295" stroke="#54483a" strokeWidth="1.8" opacity="0.85" />
            <circle cx="712" cy="290" r="6.5" fill="#759ab7" opacity="0.9" />
            <line x1="680" y1="300" x2="660" y2="310" stroke="#54483a" strokeWidth="1.8" opacity="0.85" />
            <circle cx="653" cy="314" r="6" fill="#e79c50" opacity="0.9" />
            <circle cx="663" cy="285" r="6.5" fill="#d88448" opacity="0.9" />
          </svg>

          {/* Banner Content (Foreground) */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.3rem',
              borderRadius: '999px',
              background: 'rgba(212, 175, 55, 0.18)',
              border: '1px solid rgba(180, 130, 30, 0.4)',
              color: 'var(--accent-gold-dark, #8c6716)',
              fontWeight: 800,
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <Tag size={15} /> Exclusive Savings: {bannerDiscount}
            </div>

            <h1 className="font-heading" style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              color: 'var(--text-primary, #1c1c21)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              {heading}
            </h1>
            <p style={{
              color: 'var(--text-secondary, #525260)',
              fontSize: '1.1rem',
              maxWidth: '680px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.7
            }}>
              {subheading}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--text-primary, #1c1c21)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle size={17} color="var(--accent-gold-dark, #8c6716)" /> 2+ Designer Nail Sets Included
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle size={17} color="var(--accent-gold-dark, #8c6716)" /> Full Salon Pro Hold Glue (15ml)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle size={17} color="var(--accent-gold-dark, #8c6716)" /> 120-Pack Ultra-Bond Adhesive Tabs
              </div>
            </div>
          </div>
        </div>

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
            {discountTiers.map(tier => (
              <div
                key={tier.id}
                className="glass-card"
                style={{
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  border: tier.popular ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  background: tier.popular ? 'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, var(--bg-surface) 100%)' : 'var(--bg-surface)'
                }}
              >
                {tier.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)',
                    color: '#000',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 14px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    boxShadow: '0 2px 8px rgba(212,175,55,0.4)',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={12} fill="currentColor" /> Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {tier.name}
                    </span>
                    <Gift size={20} color={tier.color} />
                  </div>

                  <div style={{
                    fontSize: '2.5rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    color: 'var(--accent-gold-light)',
                    lineHeight: 1,
                    marginBottom: '0.75rem'
                  }}>
                    {tier.discount}
                  </div>

                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    {tier.requirement}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {tier.perk}
                  </p>
                </div>

                {/* Promo Code Box */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px dashed var(--border-medium)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1rem'
                }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Promo Code
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                      {tier.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(tier.code)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
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
            ))}
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
  );
}

