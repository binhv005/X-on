import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Bell, ArrowRight, Lock } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function GalleryComingSoonPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        setLoading(true);
        const res = await api.getComingSoonCollections();
        if (res.success && res.data) {
          setCollections(res.data);
        }
      } catch (err) {
        console.error('Error fetching coming soon collections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading upcoming collection previews..." />;
  }

  return (
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Header Hero */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> Exclusive Sneak Peeks
          </span>
          <h1 className="section-title">Gallery — Coming Soon Collections</h1>
          <p className="section-subtitle">
            Preview our upcoming seasonal releases and high-concept artisan collections currently in development at our Kissimmee design studio.
          </p>
        </div>

        {/* Collections Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {collections.map((col, idx) => (
            <div
              key={col.id}
              className="glass-card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center',
                padding: '2.5rem'
              }}
            >
              {/* Media Preview */}
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                paddingTop: '65%',
                border: '1px solid var(--border-medium)'
              }}>
                <img
                  src={col.media}
                  alt={col.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(10, 10, 12, 0.85)',
                  backdropFilter: 'blur(6px)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-gold)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Calendar size={13} /> {col.expected_launch || 'Seasonal Release'}
                </div>
              </div>

              {/* Text & Meta */}
              <div>
                <span className="brand-line" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  {col.collection_name || `Collection 0${idx + 1}`}
                </span>
                <h2 className="font-heading" style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', lineHeight: 1.3 }}>
                  {col.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {col.subtitle || 'An avant-garde exploration of texture, pigment depth, and hand-sculpted contours.'}
                </p>

                <div style={{
                  padding: '1.25rem',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    <Lock size={16} color="var(--accent-gold)" />
                    <span>VIP Member Priority Access</span>
                  </div>
                  <a href="#newsletter" className="btn btn-outline btn-sm">
                    <Bell size={13} /> Notify Me on Launch
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
