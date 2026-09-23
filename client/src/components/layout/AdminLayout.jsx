import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileEdit,
  Sparkles,
  Users,
  Home,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/images/logo.png';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isAdmin, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/my-account');
    }
  }, [user, isAdmin, loading, navigate]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Website Content', path: '/admin/content', icon: FileEdit },
    { name: 'Blog & Gallery', path: '/admin/blog-gallery', icon: Sparkles },
    { name: 'Users & Wholesale', path: '/admin/users', icon: Users }
  ];

  const handleLogout = () => {
    logout();
    navigate('/my-account');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <LoadingSpinner text="Verifying administrative access..." />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Admin Sidebar (Desktop) */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 90,
        overflow: 'hidden'
      }} className="admin-desktop-sidebar">
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={logoImg}
            alt="X-ON Logo"
            style={{
              height: '46px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>

        {/* Navigation Items */}
        <nav style={{
          padding: '1rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }} className="admin-sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(90deg, rgba(179,135,40,0.18) 0%, rgba(179,135,40,0.05) 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-gold)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.35 }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={15} />
            <span>View Live Store</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#ef4444',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: '64px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 80
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="admin-mobile-toggle"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'none'
              }}
            >
              <Menu size={22} />
            </button>
            <h2 className="font-heading" style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              X-ON Management Portal
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Logged in as: <strong style={{ color: 'var(--accent-gold-dark)' }}>{user ? user.username : 'Administrator'}</strong>
            </span>
          </div>
        </header>

        {/* Page Outlet */}
        <main style={{ flex: 1, padding: '2rem', overflowX: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000 }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            style={{ width: '280px', height: '100%', background: 'var(--bg-secondary)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span className="font-heading" style={{ fontSize: '1.3rem', color: 'var(--accent-gold)' }}>X-ON Admin</span>
              <button onClick={() => setMobileSidebarOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}>
                <X size={20} />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: location.pathname === item.path ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', marginTop: '1rem', fontSize: '0.85rem' }}>
              ← Return to Live Store
            </Link>
          </div>
        </div>
      )}

      {/* CSS For Admin layout */}
      <style>{`
        .admin-desktop-sidebar,
        .admin-desktop-sidebar *,
        .admin-sidebar-nav,
        .admin-sidebar-nav * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .admin-desktop-sidebar::-webkit-scrollbar,
        .admin-desktop-sidebar *::-webkit-scrollbar,
        .admin-sidebar-nav::-webkit-scrollbar,
        .admin-sidebar-nav *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
        }
        @media (max-width: 900px) {
          .admin-desktop-sidebar {
            display: none !important;
          }
          .admin-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
