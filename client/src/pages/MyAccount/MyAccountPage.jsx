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

  // If user is already logged in, show user dashboard overview
  if (user) {
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
                <h1 className="font-heading" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
                  Hello, {user.name || user.username}!
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Member Role: <strong style={{ color: 'var(--accent-gold-dark)', textTransform: 'capitalize' }}>{user.role.replace('_', ' ')}</strong>
                </p>
              </div>

              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>

            <div className="grid-2" style={{ marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Account Details</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Username:</strong> {user.username}</div>
                  <div><strong>Status:</strong> <span className="badge badge-success">{user.status}</span></div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Quick Shortcuts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <Link to="/shop" style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>→ Browse Handmade Nails</Link>
                  <Link to="/bundle-and-save" style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>→ View Bundle & Save</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" style={{ color: '#c87110', fontWeight: 700 }}>→ Open Admin Dashboard</Link>
                  )}
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
      <div className="container" style={{ maxWidth: '600px' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <User size={16} /> Customer & Wholesale Portal
          </span>
          <h1 className="section-title">My Account</h1>
          <p className="section-subtitle">
            Sign in to access your custom sizing profiles, orders, and wholesale member discounts.
          </p>
        </div>

        {/* Auth Container Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-gold)'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
              style={{
                flex: 1,
                padding: '1.25rem',
                background: activeTab === 'login' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'login' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                color: activeTab === 'login' ? '#fff' : 'var(--text-secondary)',
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
                padding: '1.25rem',
                background: activeTab === 'register' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'register' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                color: activeTab === 'register' ? '#fff' : 'var(--text-secondary)',
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
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                    Demo Admin: <code>admin@x-on.com</code> / <code>admin123</code>
                  </small>
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
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold-light)', cursor: 'pointer', textDecoration: 'underline' }}
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
