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
import logoImg from '../../assets/images/logo.webp';

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
        background: isScrolled ? 'rgba(252, 251, 249, 0.96)' : 'rgba(252, 251, 249, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all 0.3s ease'
      }}>

        {/* Main Navbar */}
        <div style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '1rem' }}>
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
          >
            <img
              src={logoImg}
              alt="X-ON Logo"
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            {/* <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link> */}

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
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
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
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface-elevated)'; e.currentTarget.style.color = 'var(--accent-gold-dark)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
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
                    style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s ease' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface-elevated)'; e.currentTarget.style.color = 'var(--accent-gold-dark)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  >
                    Gallery Product
                  </Link>
                  <Link
                    to="/gallery-coming-soon"
                    style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s ease' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface-elevated)'; e.currentTarget.style.color = 'var(--accent-gold-dark)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
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
              to="/cart"
              style={{
                position: 'relative',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.4rem',
                textDecoration: 'none'
              }}
              title="Shopping Bag"
              aria-label="View shopping bag"
            >
              <ShoppingBag size={21} />
              {totalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'linear-gradient(135deg, #f88b80 0%, #e26155 100%)',
                  color: '#ffffff',
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
                color: 'var(--text-primary)',
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
          background: 'rgba(252, 251, 249, 0.98)',
          zIndex: 899,
          overflowY: 'auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* <Link to="/" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Home</Link> */}
          <Link to="/shop" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Shop All</Link>
          <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Link to="/shop?product_type=handmade-press-on-nails" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Handmade Press-On Nails</Link>
            <Link to="/shop?product_type=nail-essentials" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Nail Essentials</Link>
            <Link to="/shop?product_type=best-sellers" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Best Sellers</Link>
          </div>
          <Link to="/about" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>About X-ON</Link>
          <Link to="/wholesale-signup" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Wholesale Signup</Link>
          <Link to="/bundle-and-save" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Bundle and Save</Link>
          <Link to="/sizing-chart" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Sizing Chart</Link>
          <Link to="/gallery-product" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Product Gallery</Link>
          <Link to="/gallery-coming-soon" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Gallery Coming Soon</Link>
          <Link to="/blog" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Blog</Link>
          <Link to="/contact-us" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Contact Us</Link>
          <Link to="/cart" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-dark)' }}>Shopping Bag ({totalCount})</Link>
          <Link to="/my-account" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-dark)' }}>My Account / Login</Link>
          {isAdmin && (
            <Link to="/admin" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ff9b85' }}>Admin Portal</Link>
          )}
        </div>
      )}

      {/* Responsive Styles Injection */}
      <style>{`
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.15rem;
          white-space: nowrap;
          flex-shrink: 1;
        }
        .nav-link {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.2s ease;
          text-decoration: none;
          white-space: nowrap !important;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          line-height: 1;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--accent-gold);
        }
        @media (max-width: 1300px) {
          .desktop-nav {
            gap: 0.85rem;
          }
          .nav-link {
            font-size: 0.82rem;
          }
        }
        @media (max-width: 1180px) {
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
