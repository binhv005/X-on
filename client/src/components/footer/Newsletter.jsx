import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function Newsletter() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      addToast?.('Please enter a valid email address.', 'error');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');
      const res = await api.submitInquiry({
        name: 'VIP Newsletter Subscriber',
        email: email.trim(),
        phone: phone.trim(),
        type: 'newsletter',
        message: `Subscribed to X-ON VIP Newsletter & Text Updates.${phone.trim() ? ` Phone: ${phone.trim()}` : ''}`
      });

      if (res.success || res.data) {
        setStatus('success');
        setMessage('Thank you for joining X-ON VIP! Your subscription has been saved.');
        addToast?.('Welcome to X-ON VIP! You have successfully subscribed.', 'success');
        setEmail('');
        setPhone('');
      } else {
        throw new Error(res.message || 'Subscription failed');
      }
    } catch (err) {
      setStatus('error');
      const errText = err.message || 'Failed to subscribe. Please try again.';
      setMessage(errText);
      addToast?.(errText, 'error');
    }
  };

  return (
    <div id="newsletter" style={{ width: '100%', padding: '1.75rem 0' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2.5rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Explanatory Text on the Same Row */}
        <div style={{ flex: '1 1 280px', maxWidth: '380px' }}>
          <h3 className="font-heading" style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '0.35rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            X-ON Newsletter / Updates
          </h3>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: 0
          }}>
            Sign up for emails and texts to be the first to know about exclusive deals, launches & updates!
          </p>
        </div>

        {/* Form Inputs & Button */}
        <div style={{ flex: '2 1 480px' }}>
          {status === 'success' ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.85rem 1.5rem',
              background: 'rgba(5, 150, 105, 0.1)',
              border: '1px solid rgba(5, 150, 105, 0.35)',
              borderRadius: '0px',
              color: '#059669',
              fontWeight: 600,
              fontSize: '0.92rem'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              width: '100%'
            }}>
              {/* Email Underlined Input */}
              <div style={{ flex: '1 1 200px' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1.5px solid rgba(232, 97, 84, 0.35)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    borderRadius: 0,
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Phone Underlined Input */}
              <div style={{ flex: '1 1 200px' }}>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1.5px solid rgba(232, 97, 84, 0.35)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    borderRadius: 0,
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* JOIN US Button */}
              <div style={{ flexShrink: 0 }}>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    background: 'linear-gradient(135deg, #f17c72 0%, #e26155 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderRadius: '0px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(226, 97, 84, 0.28)',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    opacity: status === 'loading' ? 0.7 : 1
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #f88f86 0%, #eb695d 100%)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #f17c72 0%, #e26155 100%)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {status === 'loading' ? 'JOINING...' : 'JOIN US'}
                </button>
              </div>
            </form>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.82rem', marginTop: '0.5rem' }}>
              <AlertCircle size={14} />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



