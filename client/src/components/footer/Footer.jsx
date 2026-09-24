import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import logoImg from '../../assets/images/logo-transparent.png';
import Newsletter from './Newsletter';

export default function Footer() {
  return (
    <footer style={{
      background: '#faf4f2',
      borderTop: '1px solid rgba(232, 97, 84, 0.2)',
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
            <Link
              to="/"
              onClick={() => {
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              style={{ display: 'inline-block', marginBottom: '1.25rem', textDecoration: 'none' }}
            >
              <img
                src={logoImg}
                alt="X-ON Logo"
                style={{
                  height: '76px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </Link>
            <p className="brand-line" style={{ marginBottom: '0.85rem', fontSize: '0.88rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.12em' }}>
              Press On. Slay On. Repeat.
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.65', color: 'var(--text-secondary)', margin: 0 }}>
              X-ON is where modern nail artistry meets effortless luxury. Handcrafted bespoke press-on nails and premium essentials designed for long-lasting salon elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading footer-heading" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '0.1em', marginBottom: '1.25rem', textTransform: 'uppercase', fontWeight: 700 }}>
              Explore X-ON
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/shop" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Shop All Nails</Link></li>
              <li><Link to="/bundle-and-save" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Bundle & Save</Link></li>
              <li><Link to="/sizing-chart" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Sizing Chart & Fit Guide</Link></li>
              <li><Link to="/gallery-product" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Product Gallery</Link></li>
              <li><Link to="/gallery-coming-soon" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Coming Soon Collections</Link></li>
              <li><Link to="/blog" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Beauty & Nail Journal</Link></li>
            </ul>
          </div>

          {/* Business & Pro */}
          <div>
            <h4 className="font-heading footer-heading" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '0.1em', marginBottom: '1.25rem', textTransform: 'uppercase', fontWeight: 700 }}>
              Partnerships & Info
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>About Our Artistry</Link></li>
              <li><Link to="/wholesale-signup" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Wholesale Registration</Link></li>
              <li><Link to="/contact-us" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Contact Support</Link></li>
              <li><Link to="/my-account" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>My Account</Link></li>
              <li><Link to="/legal/terms" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Terms & Conditions</Link></li>
              <li><Link to="/legal/privacy-policy" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact & Location Block */}
          <div>
            <h4 className="font-heading footer-heading" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '0.1em', marginBottom: '1.25rem', textTransform: 'uppercase', fontWeight: 700 }}>
              Kissimmee Studio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>3168 Bill Beck Blvd, Kissimmee, FL 34744</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <a href="tel:689-212-8888" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  689-212-8888
                </a>
              </div>

              {/* Social Media Icons */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.35rem' }}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(232, 97, 84, 0.25)',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    e.currentTarget.style.background = 'var(--accent-gold)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'rgba(232, 97, 84, 0.25)';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                  title="Instagram"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(232, 97, 84, 0.25)',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    e.currentTarget.style.background = 'var(--accent-gold)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'rgba(232, 97, 84, 0.25)';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                  title="Facebook"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section: Email, Phone & Join Us on 1 single row */}
        <div style={{
          borderTop: '1px solid rgba(232, 97, 84, 0.18)',
          paddingTop: '1rem',
          paddingBottom: '1rem'
        }}>
          <Newsletter />
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(232, 97, 84, 0.18)',
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
            <Link to="/legal/terms" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Terms</Link>
            <Link to="/legal/privacy-policy" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
