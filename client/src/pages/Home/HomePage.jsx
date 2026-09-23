import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MapPin, Phone, CheckCircle, Star } from 'lucide-react';
import { api } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function HomePage() {
  const [content, setContent] = useState(null);
  const [handmadeNails, setHandmadeNails] = useState([]);
  const [nailEssentials, setNailEssentials] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [contentRes, productsRes, reviewsRes] = await Promise.all([
          api.getPageContent('home').catch(() => ({ data: null })),
          api.getProducts({ all: 'true' }).catch(() => ({ data: [] })),
          api.getReviews().catch(() => ({ data: [] }))
        ]);

        if (contentRes?.data) setContent(contentRes.data);

        const prods = productsRes?.data || [];
        setHandmadeNails(prods.filter(p => p.product_type === 'Handmade Press-On Nails' && !p.is_bundle).slice(0, 4));
        setNailEssentials(prods.filter(p => p.product_type === 'Nail Essentials').slice(0, 3));
        setBestSellers(prods.filter(p => p.is_best_seller || (p.categories && p.categories.includes('Best Sellers'))).slice(0, 4));
        setReviews(reviewsRes?.data || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Curating X-ON collection..." />;
  }

  const heroHeading = content?.hero_heading || 'X-ON';
  const heroTagline = content?.hero_tagline || 'Press On. Slay On. Repeat.';
  const heroDesc = content?.hero_description || 'Where modern nail artistry meets effortless beauty. Handcrafted press-on sets and curated nail essentials designed for nail lovers and salon professionals alike.';
  const heroImg = content?.hero_image || 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1600&q=80';

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(to right, rgba(252, 251, 249, 0.95) 0%, rgba(252, 251, 249, 0.82) 50%, rgba(252, 251, 249, 0.35) 100%), url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 0'
      }}>
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              <Sparkles size={16} /> Handmade Press-On Nails & Nail Essentials
            </span>
            <h1 className="font-heading" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              {heroHeading} <br />
              <span className="gradient-text-gold" style={{ fontStyle: 'italic' }}>{heroTagline}</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              {heroDesc}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Shop Handmade Nails <ArrowRight size={18} />
              </Link>
              <Link to="/bundle-and-save" className="btn btn-outline btn-lg">
                Bundle & Save
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem' }}>
              <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', marginBottom: '0.3rem' }}>
                100% Handcrafted Gel
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Multi-layer builder gel for salon strength.</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', marginBottom: '0.3rem' }}>
                Reusable Up to 5x
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Damage-free wear with dual-action application kits.</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', marginBottom: '0.3rem' }}>
                Custom Precision Fit
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Available across 6 designer silhouettes & sizing maps.</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', marginBottom: '0.3rem' }}>
                Kissimmee, FL Studio
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Direct studio artisan production & wholesale shipping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Handmade Press-On Nails */}
      <section className="section-py">
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Artisan Selection</span>
            <h2 className="section-title">Handmade Press-On Nails</h2>
            <p className="section-subtitle">
              Individually sculpted by certified nail artists using premium salon gel and high-pigment pigments.
            </p>
          </div>

          <div className="grid-4">
            {handmadeNails.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/shop?product_type=handmade-press-on-nails" className="btn btn-outline">
              View All Press-On Sets <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Best Sellers */}
      <section className="section-py" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Most Coveted</span>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">
              Our viral chrome velvets, classic French reimagined, and high-performance bundles.
            </p>
          </div>

          <div className="grid-4">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Nail Essentials */}
      <section className="section-py">
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Professional Essentials</span>
            <h2 className="section-title">Nail Essentials</h2>
            <p className="section-subtitle">
              Selected nail essentials designed with quality, style, and performance in mind for nail lovers and professionals.
            </p>
          </div>

          <div className="grid-3">
            {nailEssentials.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/shop?product_type=nail-essentials" className="btn btn-outline">
              Explore Professional Care & Adhesives <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Brand Story Showcase */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '5rem 0'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <span className="brand-line">The X-ON Philosophy</span>
              <h2 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--text-primary)', margin: '0.75rem 0 1.5rem 0', lineHeight: 1.25 }}>
                Modern Nail Artistry Meets Effortless Beauty.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Created for nail lovers and professionals alike, X-ON offers handmade press-on nails and carefully selected nail essentials designed with quality, style, and performance in mind.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                From statement-making nail sets to everyday professional supplies, every X-ON product is chosen to make beautiful nails easier, faster, and more accessible—without compromising on a polished, luxury finish.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/about" className="btn btn-primary">
                  Read Our Story
                </Link>
                <Link to="/sizing-chart" className="btn btn-secondary">
                  Fit & Sizing Guide
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-gold)',
                boxShadow: 'var(--shadow-gold)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80"
                  alt="X-ON Handmade Nail Craftsmanship"
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Our Reviews */}
      <section className="section-py" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Social Proof</span>
            <h2 className="section-title">Our Reviews</h2>
            <p className="section-subtitle">
              Loved by nail enthusiasts and salon technicians across the nation.
            </p>
          </div>

          <div className="grid-3">
            {reviews.slice(0, 3).map(rev => (
              <div key={rev.id} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <RatingStars rating={rev.rating} size={16} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{rev.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle size={12} /> Verified X-ON Customer
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Find Us */}
      <section className="section-py" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-gold)'
          }}>
            <span className="brand-line" style={{ display: 'block', marginBottom: '0.5rem' }}>Visit Our Studio & Showcase</span>
            <h2 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Find Us
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={22} color="var(--accent-gold)" />
                <strong>3168 Bill Beck Blvd, Kissimmee, FL 34744</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={20} color="var(--accent-gold)" />
                <a href="tel:689-212-8888" style={{ color: 'var(--accent-gold-light)', fontWeight: 600 }}>
                  689-212-8888
                </a>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
              From bespoke bridal styling to salon wholesale pickups, our Kissimmee artisan team is ready to assist you with every luxury nail detail.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/contact-us" className="btn btn-primary">
                Contact Our Studio
              </Link>
              <Link to="/wholesale-signup" className="btn btn-outline">
                Wholesale Registration
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
