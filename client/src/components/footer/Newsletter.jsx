import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setStatus('error');
      setMessage('Please agree to receive updates and accept our Privacy Policy.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you for subscribing to X-ON VIP updates! Check your inbox for your 10% welcome gift.');
      setEmail('');
      setPhone('');
    }, 800);
  };

  return (
    <section style={{
      background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-surface) 100%)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '4.5rem 1rem'
    }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        <span className="brand-line" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Join The Inner Circle
        </span>
        <h2 className="font-heading" style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>
          X-ON Newsletter / Updates
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6' }}>
          Be the first to preview limited artisan collections, seasonal color drops, and professional nail care masterclasses.
        </p>

        {status === 'success' ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.75rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            color: '#34d399',
            fontSize: '0.95rem'
          }}>
            <CheckCircle2 size={20} />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              width: '100%',
              maxWidth: '560px',
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, minWidth: '220px' }}
                disabled={status === 'loading'}
                required
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'loading'}
                style={{ whiteSpace: 'nowrap' }}
              >
                {status === 'loading' ? 'Subscribing...' : (
                  <>
                    Subscribe <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {status === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.85rem' }}>
                <AlertCircle size={15} />
                <span>{message}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                id="newsletter-consent"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ accentColor: 'var(--accent-gold)' }}
              />
              <label htmlFor="newsletter-consent" style={{ cursor: 'pointer' }}>
                I agree to receive marketing communications and agree to the{' '}
                <Link to="/legal/terms" style={{ color: 'var(--accent-gold-light)', textDecoration: 'underline' }}>
                  Terms
                </Link>{' '}
                &{' '}
                <Link to="/legal/privacy-policy" style={{ color: 'var(--accent-gold-light)', textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>.
              </label>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
