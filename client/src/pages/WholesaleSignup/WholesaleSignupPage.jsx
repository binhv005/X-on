import React, { useState } from 'react';
import { Sparkles, Building2, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function WholesaleSignupPage() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    business_name: '',
    business_address: '',
    phone: '',
    password: '',
    confirm_password: '',
    membership: 'Wholesale customer'
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
    if (!formData.username || !formData.email || !formData.business_name || !formData.business_address || !formData.phone || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match. Please verify your password entry.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const res = await api.submitWholesale(formData);
      if (res.success) {
        setSuccess(true);
        addToast('Wholesale application submitted successfully!', 'success');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit application. Please try again.');
      addToast(err.message || 'Submission failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-py" style={{ paddingTop: '3rem' }}>
      <div className="container">
        {/* Header Intro */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3.5rem auto' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Building2 size={16} /> Professional Partner Program
          </span>
          <h1 className="section-title">Wholesale Partner Registration</h1>
          <p className="section-subtitle">
            Partner with X-ON to offer salon-grade handmade press-on nails and curated essentials in your beauty studio, boutique, or salon chain with tiered volume pricing.
          </p>
        </div>

        {/* Content & Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
          {/* Left Column: Benefits & Hero Image */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <img
                src="/assets/images/IMG_7101.JPG"
                alt="X-ON Wholesale Partner Showcase"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/images/IMG_7098.JPG';
                }}
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              />
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1.2rem', marginBottom: '1rem' }}>
                Wholesale Member Benefits
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Sparkles size={16} color="var(--accent-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span><strong>Tiered Margins:</strong> Exclusive 35% - 50% wholesale discounts on handcrafted nail sets and bulk essentials.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Sparkles size={16} color="var(--accent-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span><strong>Priority Studio Batching:</strong> Dedicated artisan team handling your salon’s scheduled reorders.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Sparkles size={16} color="var(--accent-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span><strong>Marketing Collateral & Sizing Kits:</strong> Counter display packaging and bespoke fitting sets included.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-gold)'
          }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto'
                }}>
                  <CheckCircle2 size={36} color="#10b981" />
                </div>
                <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  Application Received!
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Thank you for applying to the X-ON Wholesale Partner Network. Our accounts review team will verify your business credentials and activate your wholesale catalog access within 24-48 hours.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      username: '',
                      email: '',
                      business_name: '',
                      business_address: '',
                      phone: '',
                      password: '',
                      confirm_password: '',
                      membership: 'Wholesale customer'
                    });
                  }}
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  Register Wholesale Account
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Please complete the business registration form below.
                </p>

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
                  <label className="form-label">Username *</label>
                  <input
                    type="text"
                    name="username"
                    className="form-input"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. miami_glam_nails"
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
                    placeholder="contact@yourbusiness.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Business Name *</label>
                  <input
                    type="text"
                    name="business_name"
                    className="form-input"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="Your salon, spa or boutique name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Business Address *</label>
                  <textarea
                    rows="2"
                    name="business_address"
                    className="form-textarea"
                    value={formData.business_address}
                    onChange={handleChange}
                    placeholder="Street address, City, State, ZIP Code"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 407-555-0199"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-input"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirm_password"
                      className="form-input"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Membership Type</label>
                  <input
                    type="text"
                    name="membership"
                    className="form-input"
                    value={formData.membership}
                    readOnly
                    style={{ background: 'var(--bg-primary)', opacity: 0.8 }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }}
                >
                  {loading ? 'Submitting Application...' : (
                    <>
                      Submit Application <ArrowRight size={16} />
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
