import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/images/logo.png';
import Newsletter from './Newsletter';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        {/* Main Footer Links & Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand Col */}
          <div style={{ maxWidth: '340px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={logoImg}
                  alt="X-ON Logo"
                  style={{
                    height: '56px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </Link>
            <p className="brand-line" style={{ marginBottom: '0.85rem', fontSize: '0.85rem' }}>
              Press On. Slay On. Repeat.
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.65', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              X-ON is where modern nail artistry meets effortless luxury. Handcrafted bespoke press-on nails and premium essentials designed for long-lasting salon elegance.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', transition: 'all 0.2s ease'
                }}
                title="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', transition: 'all 0.2s ease'
                }}
                title="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading" style={{ fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '0.08em', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
              Explore X-ON
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/shop" style={{ color: 'var(--text-secondary)' }}>Shop All Nails</Link></li>
              <li><Link to="/bundle-and-save" style={{ color: 'var(--text-secondary)' }}>Bundle & Save</Link></li>
              <li><Link to="/sizing-chart" style={{ color: 'var(--text-secondary)' }}>Sizing Chart & Fit Guide</Link></li>
              <li><Link to="/gallery-product" style={{ color: 'var(--text-secondary)' }}>Product Gallery</Link></li>
              <li><Link to="/gallery-coming-soon" style={{ color: 'var(--text-secondary)' }}>Coming Soon Collections</Link></li>
              <li><Link to="/blog" style={{ color: 'var(--text-secondary)' }}>Beauty & Nail Journal</Link></li>
            </ul>
          </div>

          {/* Business & Pro */}
          <div>
            <h4 className="font-heading" style={{ fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '0.08em', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
              Partnerships & Info
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)' }}>About Our Artistry</Link></li>
              <li><Link to="/wholesale-signup" style={{ color: 'var(--text-secondary)' }}>Wholesale Registration</Link></li>
              <li><Link to="/contact-us" style={{ color: 'var(--text-secondary)' }}>Contact Support</Link></li>
              <li><Link to="/my-account" style={{ color: 'var(--text-secondary)' }}>My Account</Link></li>
              <li><Link to="/legal/terms" style={{ color: 'var(--text-secondary)' }}>Terms & Conditions</Link></li>
              <li><Link to="/legal/privacy-policy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact & Location Block */}
          <div>
            <h4 className="font-heading" style={{ fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '0.08em', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
              Kissimmee Studio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>3168 Bill Beck Blvd, Kissimmee, FL 34744</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <a href="tel:689-212-8888" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  689-212-8888
                </a>
              </div>
              <div style={{
                marginTop: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--accent-gold-light)'
              }}>
                <ShieldCheck size={16} />
                <span>100% Handcrafted Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section: Email, Phone & Join Us on 1 single row */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
          paddingBottom: '1rem'
        }}>
          <Newsletter />
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} X-ON. All rights reserved. Press On. Slay On. Repeat.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/legal/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link>
            <Link to="/legal/privacy-policy" style={{ color: 'var(--text-muted)' }}>Privacy</Link>
            <Link to="/admin" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
