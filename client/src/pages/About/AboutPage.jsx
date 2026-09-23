import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Phone, Check, Award, HeartHandshake } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
  const tagline = content?.tagline || 'X-ON is where modern nail artistry meets effortless beauty.';
  const brandDesc = content?.brand_description || `Created for nail lovers and professionals alike, X-ON offers handmade press-on nails and carefully selected nail essentials designed with quality, style, and performance in mind.\n\nFrom statement-making nail sets to everyday professional supplies, every X-ON product is chosen to make beautiful nails easier, faster, and more accessible—without compromising on a polished, luxury finish.\n\nX-ON — Press On. Slay On. Repeat.`;
  const address = content?.address || '3168 Bill Beck Blvd, Kissimmee, FL 34744';
  const phone = content?.phone || '689-212-8888';
  const heroImage = content?.image || '/assets/images/IMG_7101.JPG';

  return (
    <div>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-primary) 100%)',
        padding: '5rem 0 4rem 0',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} /> The Artistry of X-ON
          </span>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            {tagline}
          </h1>
          <p className="gradient-text-gold" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {brandLine}
          </p>
        </div>
      </section>

      {/* Main Narrative & Imagery */}
      <section className="section-py">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="brand-line">Our Craft & Mission</span>
              <h2 className="font-heading" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', margin: '0.5rem 0 1.5rem 0' }}>
                Sculpted by Hand, Crafted for Distinction
              </h2>

              <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {brandDesc.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Studio Info Card */}
              <div style={{
                marginTop: '2.5rem',
                padding: '1.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                boxShadow: 'var(--shadow-gold)'
              }}>
                <h4 className="font-heading" style={{ color: 'var(--accent-gold-dark)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  X-ON Headquarters & Studio
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <MapPin size={18} color="var(--accent-gold)" />
                    <span style={{ color: 'var(--text-primary)' }}>{address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Phone size={18} color="var(--accent-gold)" />
                    <a href={`tel:${phone}`} style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>{phone}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Collage */}
            <div>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
              }}>
                <img
                  src={heroImage}
                  alt="X-ON Artisanal Nails"
                  style={{ width: '100%', height: '520px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">The Difference</span>
            <h2 className="section-title">Built on Three Foundations</h2>
          </div>

          <div className="grid-3">
            <div className="glass-card" style={{ padding: '2.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles size={24} color="var(--accent-gold)" />
              </div>
              <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                Quality Without Compromise
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Every set is layered with salon-strength soft gel and builder coatings, preventing chipping, bending, or thinning.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Award size={24} color="var(--accent-gold)" />
              </div>
              <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                Style & Trend Leadership
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                From runway-inspired velvet chrome to timeless French aesthetics, our collections define luxury nail fashion.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <HeartHandshake size={24} color="var(--accent-gold)" />
              </div>
              <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                Effortless Performance
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Quick 10-minute application with durable salon hold for weeks of polished perfection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
