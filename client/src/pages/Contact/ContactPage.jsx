import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Sparkles, CheckCircle2, AlertCircle, Send, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    order_number: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in Name, Email, and Message.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const res = await api.submitInquiry(formData);
      if (res.success) {
        setSuccess(true);
        addToast('Message sent to X-ON studio team successfully!', 'success');
        setFormData({ name: '', email: '', order_number: '', message: '' });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
      addToast(err.message || 'Submission error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Header Introduction */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> Connect with X-ON
          </span>
          <h1 className="section-title">Contact Us</h1>
          <p className="gradient-text-gold" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            X-ON — handmade press-on nails & carefully selected nail essentials.
          </p>
          <p className="section-subtitle">
            X-ON is where modern nail artistry meets effortless beauty.
          </p>
        </div>

        {/* Benefit Blocks */}
        <div className="grid-4" style={{ marginBottom: '4rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', marginBottom: '0.4rem' }}>
              Handmade Press-On Nails
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Artisan sculpted with multi-layered salon builder gel.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', marginBottom: '0.4rem' }}>
              Nail Essentials
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Pro adhesives, adhesive tabs & cuticle restoration elixirs.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', marginBottom: '0.4rem' }}>
              Quality, Style & Performance
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Designed for nail lovers and salon professionals alike.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', marginBottom: '0.4rem' }}>
              Accessible Luxury
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Easier, faster, and more accessible beauty with a luxury finish.
            </p>
          </div>
        </div>

        {/* Contact Information & Form Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
          {/* Left Column: Direct Info */}
          <div>
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
              <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Studio Contact Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(179, 135, 40, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} color="var(--accent-gold)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Hotline</div>
                    <a href="tel:689-212-8888" style={{ color: 'var(--accent-gold-dark)', fontWeight: 700, fontSize: '1.15rem' }}>
                      689-212-8888
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} color="var(--accent-gold)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Studio & Flagship Showcase</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.5 }}>
                      3168 Bill Beck Blvd, Kissimmee, FL 34744
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <ShieldCheck size={28} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>Client Promise:</strong> All inquiries receive a dedicated response from our Kissimmee artisan team within 1 business day.
              </div>
            </div>
          </div>

          {/* Right Column: Contact X-ON Form */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-gold)'
          }}>
            <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Contact X-ON Form
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Send us a message regarding custom sizing, wedding party sets, wholesale inquiries, or general support.
            </p>

            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <CheckCircle2 size={32} color="#10b981" />
                </div>
                <h4 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  Message Sent!
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Thank you for reaching out. We will review your inquiry and get back to you shortly.
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setSuccess(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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

                <div className="form-group">
                  <label className="form-label">First & Last Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sophia Montgomery"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. sophia@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone / Order Number (optional)</label>
                  <input
                    type="text"
                    name="order_number"
                    className="form-input"
                    value={formData.order_number}
                    onChange={handleChange}
                    placeholder="e.g. 689-212-8888 or XON-ORD-8821"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    rows="4"
                    name="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can our master nail artists help you today?"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.9rem' }}
                >
                  {loading ? 'Sending Message...' : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
