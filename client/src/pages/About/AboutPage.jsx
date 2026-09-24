import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Check, Award, HeartHandshake, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import aboutHeroBg from '../../assets/images/about-hero-bg.webp';

export default function AboutPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        setLoading(true);
        const res = await api.getPageContent('about');
        if (res.success && res.data) {
          setContent(res.data);
        }
      } catch (err) {
        console.error('Error fetching about page content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading X-ON brand story..." />;
  }

  const brandLine = content?.brand_line || 'Press On. Slay On. Repeat.';
  const tagline = (content?.tagline && content.tagline !== 'X-ON is where modern nail artistry meets effortless beauty.')
    ? content.tagline
    : 'Modern Nail Artistry & Effortless Beauty';
  const brandDesc = content?.brand_description || `X-ON delivers handmade bespoke press-on nails and curated essentials designed for effortless luxury and lasting performance.\n\nMaking salon-quality manicures faster, easier, and accessible to everyone — without compromising on a polished finish.`;
  const address = content?.address || '3168 Bill Beck Blvd, Kissimmee, FL 34744';
  const phone = content?.phone || '689-212-8888';
  const heroImage = content?.image || '/assets/images/IMG_7101.webp';

  return (
    <div>
      {/* Hero Header */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 75px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `radial-gradient(circle at center, rgba(15, 15, 18, 0.45) 0%, rgba(15, 15, 18, 0.70) 100%), url(${aboutHeroBg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#e3d2ea',
        padding: '3rem 1.5rem',
        borderBottom: '1px solid rgba(232, 97, 84, 0.25)',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem', color: '#fcaaa2', textShadow: '0 2px 10px rgba(0,0,0,0.6)', fontSize: '0.82rem', letterSpacing: '0.18em', fontWeight: 700 }}>
            <Sparkles size={14} color="#fcaaa2" /> The Artistry of X-ON
          </span>
          <h1 className="font-heading" style={{ fontSize: 'clamp(1.85rem, 3.8vw, 2.75rem)', color: '#ffffff', marginBottom: '1.15rem', lineHeight: 1.35, letterSpacing: '0.04em', textShadow: '0 3px 18px rgba(0, 0, 0, 0.7)' }}>
            {tagline}
          </h1>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fcaaa2', textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)', margin: 0 }}>
            {brandLine}
          </p>
        </div>
      </section>

      {/* Main Narrative & Imagery */}
      <section className="section-py">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <span className="brand-line">Our Craft & Mission</span>
              <h2 className="font-heading" style={{ fontSize: '2.1rem', color: 'var(--text-primary)', margin: '0.5rem 0 1.25rem 0', lineHeight: 1.25 }}>
                Sculpted by Hand, Crafted for Distinction
              </h2>

              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {brandDesc.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} style={{ margin: 0 }}>{paragraph}</p>
                ))}
              </div>

              {/* Studio Info Card */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem 1.75rem',
                borderRadius: '0px',
                background: '#faf0ee',
                border: '1px solid rgba(232, 97, 84, 0.25)',
                boxShadow: '0 4px 18px rgba(232, 97, 84, 0.08)'
              }}>
                <h4 className="font-heading" style={{ color: 'var(--accent-gold-dark)', fontSize: '1.05rem', marginBottom: '0.85rem', letterSpacing: '0.04em' }}>
                  X-ON Headquarters & Studio
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <MapPin size={18} color="var(--accent-gold)" />
                    <span style={{ color: 'var(--text-primary)' }}>{address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Phone size={18} color="var(--accent-gold)" />
                    <a href={`tel:${phone}`} style={{ color: 'var(--accent-gold-dark)', fontWeight: 600, textDecoration: 'none' }}>{phone}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Collage */}
            <div>
              <div style={{
                borderRadius: '0px',
                overflow: 'hidden',
                border: '1px solid rgba(232, 97, 84, 0.2)',
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}>
                <img
                  src={heroImage || '/assets/images/IMG_7101.webp'}
                  alt="X-ON Artisanal Nails"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/IMG_7101.webp';
                  }}
                  style={{ width: '100%', height: '520px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="brand-line">The Difference</span>
            <h2 className="section-title">Built on Three Foundations</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch'
          }}>
            {/* Card 1 */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              borderRadius: '0px',
              border: '1px solid rgba(232, 97, 84, 0.16)',
              boxShadow: '0 4px 16px rgba(232, 97, 84, 0.06)',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(232, 97, 84, 0.14)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 97, 84, 0.06)';
            }}
            >
              <div style={{ width: '42%', minHeight: '190px', flexShrink: 0, position: 'relative' }}>
                <img
                  src="/assets/images/IMG_7101.webp"
                  alt="Quality Without Compromise"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ flex: 1, padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Salon Quality
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                  Quality Without Compromise
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                  Multi-layer soft gel coating with zero chipping or bending.
                </p>
                <Link to="/shop?product_type=handmade-press-on-nails" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Shop Sets <ArrowRight size={13} color="var(--accent-gold)" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              borderRadius: '0px',
              border: '1px solid rgba(232, 97, 84, 0.16)',
              boxShadow: '0 4px 16px rgba(232, 97, 84, 0.06)',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(232, 97, 84, 0.14)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 97, 84, 0.06)';
            }}
            >
              <div style={{ width: '42%', minHeight: '190px', flexShrink: 0, position: 'relative' }}>
                <img
                  src="/assets/images/IMG_7106.webp"
                  alt="Style & Trend Leadership"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ flex: 1, padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Trend Forward
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                  Style & Trend Leadership
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                  Runway velvet chrome & timeless handcrafted aesthetics.
                </p>
                <Link to="/gallery-product" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  View Gallery <ArrowRight size={13} color="var(--accent-gold)" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              borderRadius: '0px',
              border: '1px solid rgba(232, 97, 84, 0.16)',
              boxShadow: '0 4px 16px rgba(232, 97, 84, 0.06)',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(232, 97, 84, 0.14)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 97, 84, 0.06)';
            }}
            >
              <div style={{ width: '42%', minHeight: '190px', flexShrink: 0, position: 'relative' }}>
                <img
                  src="/assets/images/IMG_7107.webp"
                  alt="Effortless Performance"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ flex: 1, padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  10-Min Routine
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                  Effortless Performance
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                  10-minute application for weeks of salon durability.
                </p>
                <Link to="/sizing-chart" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  How To Apply <ArrowRight size={13} color="var(--accent-gold)" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
