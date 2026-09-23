import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Palette,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productTypeOpen, setProductTypeOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false);

  const { user, isAdmin } = useAuth();
  const { totalCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductTypeOpen(false);
    setThemeDropdownOpen(false);
    setGalleryDropdownOpen(false);
  }, [location.pathname]);

  const productTypes = [
    { name: 'All Press-On Nails', path: '/shop?product_type=handmade-press-on-nails', desc: 'Handcrafted luxury gel sets' },
    { name: 'Nail Essentials', path: '/shop?product_type=nail-essentials', desc: 'Salon-grade glues, tabs & prep kits' },
    { name: 'Best Sellers', path: '/shop?product_type=best-sellers', desc: 'Our most loved and viral silhouettes' }
  ];

  const designThemes = [
    { name: 'Minimalist Chic', path: '/shop?theme=minimalist-chic' },
    { name: 'Glitz & Glamour', path: '/shop?theme=glitz-glamour' },
    { name: 'French Modern', path: '/shop?theme=french-modern' },
    { name: 'Cat Eye & Chrome', path: '/shop?theme=cat-eye-chrome' }
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: isScrolled ? 'rgba(10, 10, 12, 0.95)' : 'rgba(10, 10, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all 0.3s ease'
      }}>
        {/* Top Announcement Bar */}
        <div style={{
          background: 'linear-gradient(90deg, #18181f 0%, #2a2215 50%, #18181f 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '0.4rem 1rem',
          fontSize: '0.78rem',
          textAlign: 'center',
          color: 'var(--accent-gold-light)',
          letterSpacing: '0.06em'
        }}>
          <span>✨ FREE APPLICATION KIT WITH EVERY HANDMADE SET | PRESS ON. SLAY ON. REPEAT. ✨</span>
        </div>

        {/* Main Navbar */}
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span className="font-heading" style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              background: 'linear-gradient(135deg, #fff 0%, #f3e5ab 60%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              X-ON
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>

            <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
              Shop
            </Link>

            {/* Product Type Mega Menu */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setProductTypeOpen(true)}
              onMouseLeave={() => setProductTypeOpen(false)}
            >
              <button
                className="nav-link"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span>Product Type</span>
                <ChevronDown size={14} />
              </button>

              {productTypeOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '280px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  boxShadow: 'var(--shadow-lg)',
                  animation: 'slideUp 0.15s ease-out'
                }}>
                  {productTypes.map(item => (
                    <Link
                      key={item.name}
                      to={item.path}
                      style={{
                        display: 'block',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--bg-surface-elevated)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Design Theme Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setThemeDropdownOpen(true)}
              onMouseLeave={() => setThemeDropdownOpen(false)}
            >
              <button
                className="nav-link"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span>Design Theme</span>
                <ChevronDown size={14} />
              </button>

              {themeDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '220px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  animation: 'slideUp 0.15s ease-out'
                }}>
                  {designThemes.map(item => (
                    <Link
                      key={item.name}
                      to={item.path}
                      style={{
                        display: 'block',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none'
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface-elevated)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              About
            </Link>

            <Link to="/wholesale-signup" className={`nav-link ${location.pathname === '/wholesale-signup' ? 'active' : ''}`}>
              Wholesale Signup
            </Link>

            <Link to="/bundle-and-save" className={`nav-link ${location.pathname === '/bundle-and-save' ? 'active' : ''}`}>
              Bundle and Save
            </Link>

            <Link to="/sizing-chart" className={`nav-link ${location.pathname === '/sizing-chart' ? 'active' : ''}`}>
              Sizing Chart
            </Link>

            {/* Gallery Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setGalleryDropdownOpen(true)}
              onMouseLeave={() => setGalleryDropdownOpen(false)}
            >
              <button
                className="nav-link"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span>Gallery</span>
                <ChevronDown size={14} />
              </button>

              {galleryDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '240px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <Link
                    to="/gallery-product"
                    style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface-elevated)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    Gallery Product (Now Selling)
                  </Link>
                  <Link
                    to="/gallery-coming-soon"
                    style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface-elevated)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    Gallery Coming Soon
                  </Link>
                </div>
              )}
            </div>

            <Link to="/blog" className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}>
              Blog
            </Link>

            <Link to="/contact-us" className={`nav-link ${location.pathname === '/contact-us' ? 'active' : ''}`}>
              Contact
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAdmin && (
              <Link
                to="/admin"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                title="Admin Dashboard"
              >
                <ShieldAlert size={14} /> Admin
              </Link>
            )}

            <Link
              to="/my-account"
              style={{
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem'
              }}
              title="My Account"
            >
              <User size={20} />
              <span className="desktop-nav-text" style={{ fontSize: '0.85rem' }}>
                {user ? user.username : 'Login'}
              </span>
            </Link>

            <Link
              to="/shop"
              style={{
                position: 'relative',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.4rem'
              }}
              title="Shopping Bag"
            >
              <ShoppingBag size={21} />
              {totalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)',
                  color: '#000',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'none',
                padding: '0.25rem'
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 10, 12, 0.98)',
          zIndex: 899,
          overflowY: 'auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <Link to="/" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Home</Link>
          <Link to="/shop" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Shop All</Link>
          <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Link to="/shop?product_type=handmade-press-on-nails" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Handmade Press-On Nails</Link>
            <Link to="/shop?product_type=nail-essentials" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Nail Essentials</Link>
            <Link to="/shop?product_type=best-sellers" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Best Sellers</Link>
          </div>
          <Link to="/about" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>About X-ON</Link>
          <Link to="/wholesale-signup" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Wholesale Signup</Link>
          <Link to="/bundle-and-save" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Bundle and Save</Link>
          <Link to="/sizing-chart" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Sizing Chart</Link>
          <Link to="/gallery-product" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Product Gallery</Link>
          <Link to="/gallery-coming-soon" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Gallery Coming Soon</Link>
          <Link to="/blog" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Blog</Link>
          <Link to="/contact-us" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Contact Us</Link>
          <Link to="/my-account" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-gold)' }}>My Account / Login</Link>
          {isAdmin && (
            <Link to="/admin" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ff9b85' }}>Admin Portal</Link>
          )}
        </div>
      )}

      {/* Responsive Styles Injection */}
      <style>{`
        .nav-link {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.2s ease;
          text-decoration: none;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--accent-gold);
        }
        @media (max-width: 1100px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
          .desktop-nav-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
