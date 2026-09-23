import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Mail, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function MyAccountPage() {
  const { user, login, register, logout } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('login'); // login | register
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both username/email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      await login(loginEmail, loginPassword);
      addToast('Welcome back to X-ON!', 'success');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid login credentials.');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regEmail || !regPassword) {
      setErrorMessage('Please provide your email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      await register({
        username: regUsername,
        email: regEmail,
        password: regPassword
      });
      addToast('Account created successfully!', 'success');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    addToast('Password reset link sent to your email!', 'info');
  };

  const handleQuickLogin = async (email, password, roleName) => {
    try {
      setLoading(true);
      setErrorMessage('');
      await login(email, password);
      addToast(`Logged in as ${roleName}!`, 'success');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show user dashboard overview
  if (user) {
    const roleBadges = {
      admin: { label: '👑 System Administrator', class: 'badge-gold' },
      wholesale_customer: { label: '💼 Wholesale Partner (B2B)', class: 'badge-sale' },
      customer: { label: '🛍️ Verified Customer', class: 'badge-success' }
    };
    const currentBadge = roleBadges[user.role] || { label: user.role, class: 'badge-neutral' };

    return (
      <div className="section-py" style={{ paddingTop: '3.5rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem',
            boxShadow: 'var(--shadow-gold)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
              <div>
                <span className="brand-line">Account Profile</span>
                <h1 className="font-heading" style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: '0.4rem 0' }}>
                  Hello, {user.name || user.username}!
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <span className={`badge ${currentBadge.class}`} style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
                    {currentBadge.label}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={logout}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>

            {/* Admin Direct Access Banner if role === 'admin' */}
            {user.role === 'admin' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(179,135,40,0.12) 0%, rgba(207,168,59,0.06) 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 className="font-heading" style={{ fontSize: '1.15rem', color: 'var(--accent-gold-dark)', marginBottom: '0.25rem' }}>
                    👑 Administrator Portal Access Granted
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    You have full management access to Products, Orders, CMS Content, Blog/Gallery & Wholesale Inquiries.
                  </p>
                </div>
                <Link to="/admin" className="btn btn-primary">
                  🚀 Launch Admin Portal <ArrowRight size={16} />
                </Link>
              </div>
            )}

            <div className="grid-2" style={{ marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1rem' }}>Account Details</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Username:</strong> {user.username}</div>
                  <div><strong>Full Name:</strong> {user.name || 'Not provided'}</div>
                  <div><strong>Member Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role.replace('_', ' ')}</span></div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1rem' }}>Quick Shortcuts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <Link to="/shop" style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>→ Explore Handmade Nails Collection</Link>
                  <Link to="/bundle-and-save" style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>→ View Bundle & Save Sets</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" style={{ color: '#c87110', fontWeight: 700 }}>→ Open Admin Dashboard</Link>
                  )}
                  <button
                    onClick={logout}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', textAlign: 'left', width: '100%', marginTop: '0.4rem' }}
                  >
                    🔄 Switch to another demo role
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <User size={16} /> X-ON
          </span>
          <h1 className="section-title">My Account</h1>
          <p className="section-subtitle">
            Sign in to access your custom sizing profiles, orders, and wholesale member discounts.
          </p>
        </div>

        {/* ⚡ Quick 1-Click Demo Login Panel */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--accent-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Demo 1-Click Login
              </strong>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Demo Evaluation Mode</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
            {/* 1. Admin Quick Login */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@x-on.com', 'admin123', 'Administrator')}
              disabled={loading}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.85rem',
                border: '1px solid rgba(179,135,40,0.35)',
                background: 'linear-gradient(135deg, rgba(179,135,40,0.08) 0%, rgba(207,168,59,0.02) 100%)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-gold-dark)' }}>
                <span>👑</span> Administrator
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Full Management Access
              </span>
            </button>

            {/* 2. Wholesale Partner Quick Login */}
            <button
              type="button"
              onClick={() => handleQuickLogin('sarah.salon@example.com', 'user123', 'Wholesale Partner')}
              disabled={loading}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.85rem',
                border: '1px solid var(--border-medium)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                <span>💼</span> Wholesale Partner
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                B2B Studio Belle
              </span>
            </button>

            {/* 3. Retail Customer Quick Login */}
            <button
              type="button"
              onClick={() => handleQuickLogin('chloe.k@example.com', 'user123', 'Customer')}
              disabled={loading}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.85rem',
                border: '1px solid var(--border-medium)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                <span>🛍️</span> Retail Customer
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Chloe Kim (Shopper)
              </span>
            </button>
          </div>
        </div>

        {/* Auth Container Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
              style={{
                flex: 1,
                padding: '1.1rem',
                background: activeTab === 'login' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'login' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                color: activeTab === 'login' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
              style={{
                flex: 1,
                padding: '1.1rem',
                background: activeTab === 'register' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'register' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                color: activeTab === 'register' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Register
            </button>
          </div>

          <div style={{ padding: '2.5rem' }}>
            {errorMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '0.88rem',
                marginBottom: '1.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Tab Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Username or Email Address *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="admin@x-on.com or your username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      style={{ accentColor: 'var(--accent-gold)' }}
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setForgotModal(true)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold-dark)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Lost your password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {loading ? 'Logging in...' : (
                    <>
                      Login <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Register Tab Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Username (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="Choose a username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    required
                  />
                </div>

                {/* Privacy Notice */}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our{' '}
                  <Link to="/legal/privacy-policy" style={{ color: 'var(--accent-gold-light)', textDecoration: 'underline' }}>
                    Privacy Notice
                  </Link>.
                </p>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {loading ? 'Creating Account...' : (
                    <>
                      Register <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Lost Password Modal */}
        {forgotModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              maxWidth: '440px',
              width: '100%',
              padding: '2rem'
            }}>
              <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                Password Recovery
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
              </p>

              {forgotSent ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ color: '#34d399', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Reset link dispatched to {forgotEmail}
                  </p>
                  <button onClick={() => { setForgotModal(false); setForgotSent(false); }} className="btn btn-secondary btn-sm">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label className="form-label">Username or Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button type="button" onClick={() => setForgotModal(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Reset Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
