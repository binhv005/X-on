import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Lock,
  Sparkles,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Mail,
  ArrowRight
} from 'lucide-react';
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
  const body = content?.body || '';

  return (
    <div>
      {/* Hero Header */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #14161a 0%, #1c1f26 100%)',
        padding: '5rem 1.5rem 4rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '850px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.25rem',
            borderRadius: '999px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(245, 211, 118, 0.4)',
            color: '#f5d376',
            fontWeight: 800,
            fontSize: '0.82rem',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <ShieldCheck size={16} color="#f5d376" /> Official Studio Documentation
          </div>

          <h1 className="font-heading" style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            {title}
          </h1>

          <p style={{
            color: '#9ca3af',
            fontSize: '1.05rem',
            maxWidth: '620px',
            margin: '0 auto 1.75rem auto',
            lineHeight: 1.6
          }}>
            {pageKey === 'privacy'
              ? 'Learn how X-ON collects, utilizes, and protects your personal data with enterprise-grade encryption.'
              : 'Our terms of service, handcrafted nail policies, sizing guidelines, and salon studio agreements.'}
          </p>

          {/* Navigation Pill Switcher */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '4px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.25)'
          }}>
            <Link
              to="/legal/terms"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.6rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: pageKey === 'terms' ? 700 : 500,
                color: pageKey === 'terms' ? '#111827' : '#9ca3af',
                background: pageKey === 'terms' ? '#f5d376' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <FileText size={16} /> Terms & Conditions
            </Link>
            <Link
              to="/legal/privacy-policy"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.6rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: pageKey === 'privacy' ? 700 : 500,
                color: pageKey === 'privacy' ? '#111827' : '#9ca3af',
                background: pageKey === 'privacy' ? '#f5d376' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <Lock size={16} /> Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="section-py" style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          {/* Document Meta Info Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem 1.5rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            marginBottom: '2.5rem',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)'
          }}>
            <div>
              <strong>Effective Date:</strong> {content?.last_updated || 'September 2026'}
            </div>
            <div>
              <strong>Jurisdiction:</strong> Florida, USA (X-ON Studio)
            </div>
          </div>

          {/* Policy / Terms Content Container */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.75,
              fontWeight: 400,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {(() => {
                if (!body) return null;
                const parts = body.split(/(?=### )/g);

                return parts.map((part, pIdx) => {
                  const trimmed = part.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('### ')) {
                    const lines = trimmed.split('\n');
                    const headingLine = lines[0].replace(/^###\s*/, '').trim();
                    const contentLines = lines.slice(1);

                    const contentElements = [];
                    let currentList = [];

                    const flushList = (keySuffix) => {
                      if (currentList.length > 0) {
                        contentElements.push(
                          <ul key={`list-${keySuffix}`} style={{
                            listStyleType: 'disc',
                            paddingLeft: '1.35rem',
                            margin: '0.5rem 0 0.85rem 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.45rem'
                          }}>
                            {currentList.map((item, iIdx) => {
                              const colonIdx = item.indexOf(': ');
                              if (colonIdx !== -1) {
                                const label = item.substring(0, colonIdx);
                                const rest = item.substring(colonIdx + 2);
                                return (
                                  <li key={iIdx} style={{
                                    color: 'var(--text-secondary, #4b5563)',
                                    fontSize: '0.94rem',
                                    lineHeight: '1.7',
                                    fontWeight: 400
                                  }}>
                                    <strong style={{ color: 'var(--text-primary, #1c1c21)', fontWeight: 600 }}>{label}:</strong>{' '}
                                    <span>{rest}</span>
                                  </li>
                                );
                              }
                              return (
                                <li key={iIdx} style={{
                                  color: 'var(--text-secondary, #4b5563)',
                                  fontSize: '0.94rem',
                                  lineHeight: '1.7',
                                  fontWeight: 400
                                }}>
                                  {item}
                                </li>
                              );
                            })}
                          </ul>
                        );
                        currentList = [];
                      }
                    };

                    let pCounter = 0;
                    for (let i = 0; i < contentLines.length; i++) {
                      const line = contentLines[i].trim();
                      if (!line) {
                        flushList(`p-${pCounter}`);
                        continue;
                      }

                      if (line.startsWith('- ')) {
                        currentList.push(line.substring(2).trim());
                      } else {
                        flushList(`p-${pCounter}`);
                        pCounter++;
                        contentElements.push(
                          <p key={`p-${pCounter}-${i}`} style={{
                            margin: '0 0 0.75rem 0',
                            fontWeight: 400,
                            fontSize: '0.95rem',
                            color: 'var(--text-secondary, #4b5563)',
                            lineHeight: '1.75'
                          }}>
                            {line}
                          </p>
                        );
                      }
                    }
                    flushList(`p-${pCounter}-end`);

                    return (
                      <div key={pIdx} style={{
                        paddingTop: pIdx > 0 ? '1.75rem' : '0',
                        marginTop: pIdx > 0 ? '1.5rem' : '0',
                        borderTop: pIdx > 0 ? '1px solid var(--border-subtle, #f0ede6)' : 'none'
                      }}>
                        <h2 style={{
                          fontFamily: 'var(--font-heading, Cinzel, serif)',
                          color: 'var(--text-primary, #1c1c21)',
                          fontSize: '1.18rem',
                          fontWeight: 700,
                          letterSpacing: '0.01em',
                          marginBottom: '0.75rem',
                          lineHeight: 1.4
                        }}>
                          {headingLine}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {contentElements}
                        </div>
                      </div>
                    );
                  }

                  // Intro / Preamble before first heading
                  return (
                    <div key={pIdx} style={{
                      paddingBottom: '1.35rem',
                      borderBottom: '1px solid var(--border-subtle, #f0ede6)',
                      marginBottom: '0.75rem'
                    }}>
                      <p style={{
                        margin: 0,
                        fontWeight: 400,
                        fontSize: '0.98rem',
                        color: 'var(--text-secondary, #4b5563)',
                        lineHeight: '1.8'
                      }}>
                        {trimmed}
                      </p>
                    </div>
                  );
                })
              })()}
            </div>

            {/* Studio Contact / Escalation Box */}
            <div style={{
              marginTop: '3.5rem',
              padding: '2rem',
              borderRadius: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={20} color="var(--accent-gold)" />
                <h3 className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                  Have questions about our {pageKey === 'privacy' ? 'privacy policy' : 'terms'}?
                </h3>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Our artisan customer care team is available to assist with custom sizing verifications, wholesale agreements, and privacy requests.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.92rem', color: 'var(--text-primary)', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--accent-gold)" />
                  <span>3168 Bill Beck Blvd, Kissimmee, FL 34744</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={18} color="var(--accent-gold)" />
                  <a href="tel:689-212-8888" style={{ color: 'var(--accent-gold-dark)', fontWeight: 700 }}>
                    689-212-8888
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
