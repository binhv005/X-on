import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LegalPage() {
  const { slug = 'terms' } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const pageKey = slug === 'privacy-policy' || slug === 'privacy' ? 'privacy' : 'terms';

  useEffect(() => {
    async function loadLegalContent() {
      try {
        setLoading(true);
        const res = await api.getPageContent('legal');
        if (res.success && res.data) {
          setContent(res.data[pageKey] || res.data.terms);
        }
      } catch (err) {
        console.error('Error fetching legal content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLegalContent();
  }, [slug, pageKey]);

  if (loading) {
    return <LoadingSpinner text="Loading legal guidelines..." />;
  }

  const title = content?.title || (pageKey === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions');
  const body = content?.body || `X-ON is where modern nail artistry meets effortless beauty. All our handmade press-on nails and selected nail essentials are crafted under strict quality standards.`;

  return (
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Navigation Switcher */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <Link
            to="/legal/terms"
            style={{
              fontWeight: pageKey === 'terms' ? 700 : 500,
              color: pageKey === 'terms' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              borderBottom: pageKey === 'terms' ? '2px solid var(--accent-gold)' : 'none',
              paddingBottom: '0.5rem',
              fontSize: '0.95rem'
            }}
          >
            Terms & Conditions
          </Link>
          <Link
            to="/legal/privacy-policy"
            style={{
              fontWeight: pageKey === 'privacy' ? 700 : 500,
              color: pageKey === 'privacy' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              borderBottom: pageKey === 'privacy' ? '2px solid var(--accent-gold)' : 'none',
              paddingBottom: '0.5rem',
              fontSize: '0.95rem'
            }}
          >
            Privacy Policy
          </Link>
        </div>

        {/* Content Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2.5rem'
        }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={16} /> Official Brand Documentation
          </span>

          <h1 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {title}
          </h1>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Effective Date: {content?.last_updated || 'September 2026'} | X-ON Studio
          </div>

          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.85,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {body.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginTop: '1.25rem', marginBottom: '0.25rem' }}>
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Contact Box */}
          <div style={{
            marginTop: '3rem',
            padding: '1.5rem',
            borderRadius: '8px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-gold)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Questions regarding our terms?</strong> Connect directly with our studio support at{' '}
            <a href="tel:689-212-8888" style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>689-212-8888</a> or visit us at{' '}
            <strong>3168 Bill Beck Blvd, Kissimmee, FL 34744</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
