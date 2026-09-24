import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Tag,
  Diamond,
  Gift,
  Crown,
  User,
  Store,
  MapPin,
  Phone,
  Mail,
  Lock,
  ChevronDown
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './WholesaleSignupPage.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = {
  username: '',
  email: '',
  business_name: '',
  business_address: '',
  phone: '',
  password: '',
  confirm_password: '',
  membership: 'Wholesale customer'
};

export default function WholesaleSignupPage() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setErrorMessage('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Please enter a username.';
    if (!formData.email.trim()) errs.email = 'Please enter your business email.';
    else if (!EMAIL_RE.test(formData.email.trim().toLowerCase())) errs.email = 'Please enter a valid email address.';
    if (!formData.business_name.trim()) errs.business_name = 'Please enter your business name.';
    if (!formData.business_address.trim()) errs.business_address = 'Please enter your business address.';
    if (!formData.phone.trim()) errs.phone = 'Please enter your phone number.';
    if (!formData.password) errs.password = 'Please create a password.';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters long.';
    if (formData.password !== formData.confirm_password) errs.confirm_password = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setErrorMessage('Please review the highlighted fields below.');
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
      const msg = err.message || 'Failed to submit application. Please try again.';
      setErrorMessage(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (f) => (fieldErrors[f] ? 'xws-input xws-input-error' : 'xws-input');

  const field = (id, name, Icon, label, props = {}) => (
    <>
      <label className="xws-label" htmlFor={id}>{label}</label>
      <div className="xws-field">
        <Icon size={17} />
        <input id={id} name={name} className={inputCls(name)} value={formData[name]} onChange={handleChange} {...props} />
      </div>
      {fieldErrors[name] && <div className="xws-field-err">{fieldErrors[name]}</div>}
    </>
  );

  return (
    <div className="xws">
      <section className="xws-hero">
      <div className="xws-container">
        <div className="xws-grid">
          {/* ================= LEFT ================= */}
          <div>
            <span className="xws-eyebrow">
              <Building2 size={15} /> Professional Partner Program
            </span>
            <h1 className="xws-title">
              Wholesale Partner
              <br />
              Registration
            </h1>
            <p className="xws-desc">
              Handmade salon-grade press-on nails for studios, boutiques &amp; salon chains.
            </p>

            <div className="xws-perks">
              <div className="xws-perk">
                <span className="xws-perk-ico"><Tag size={22} /></span>
                <b>Tiered Margins</b>
                <p>Up to 50% off sets.</p>
              </div>
              <div className="xws-perk">
                <span className="xws-perk-ico"><Diamond size={22} /></span>
                <b>Priority Batching</b>
                <p>Fast salon reorders.</p>
              </div>
              <div className="xws-perk">
                <span className="xws-perk-ico"><Gift size={22} /></span>
                <b>Marketing Support</b>
                <p>Displays + fitting kits.</p>
              </div>
            </div>

            <div className="xws-script-gold">Beauty Grows Stronger Together ♡</div>
          </div>

          {/* ================= FORM CARD ================= */}
          <div className="xws-card">
            <div className="xws-badge" aria-hidden="true">
              <svg viewBox="0 0 100 100" width="88" height="88">
                <defs>
                  <path id="xws-circle" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" />
                </defs>
                <text fontSize="9.5" letterSpacing="2" fill="#5e4410" fontWeight="700">
                  <textPath href="#xws-circle">PROFESSIONAL • PARTNER •</textPath>
                </text>
                <text x="50" y="58" textAnchor="middle" fontSize="20" fill="#5e4410">♛</text>
              </svg>
            </div>

            {success ? (
              <div className="xws-success">
                <span className="xws-success-ico"><CheckCircle2 size={30} /></span>
                <h3 className="xws-card-title">Application received!</h3>
                <p className="xws-card-sub" style={{ marginTop: '8px' }}>
                  Thank you for applying to the X-ON Wholesale Partner Network. Our team will
                  review your application and get back to you within 2–3 business days.
                </p>
                <button
                  type="button"
                  className="xws-submit"
                  style={{ width: 'auto', padding: '15px 34px' }}
                  onClick={() => {
                    setSuccess(false);
                    setFormData(EMPTY);
                    setFieldErrors({});
                  }}
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <>
                <div className="xws-card-eyebrow">Join Our Community</div>
                <h2 className="xws-card-title">Register Wholesale Account</h2>
                <p className="xws-card-sub">
                  Complete the form below — approval within 2–3 business days.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  {errorMessage && (
                    <div className="xws-alert" role="alert">
                      <AlertCircle size={15} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="xws-2col">
                    <div>
                      {field('xws-username', 'username', User, 'Username *', {
                        placeholder: 'e.g. miami_glam_nails', autoComplete: 'username'
                      })}
                    </div>
                    <div>
                      {field('xws-biz', 'business_name', Store, 'Business Name *', {
                        placeholder: 'Salon, spa or boutique', autoComplete: 'organization'
                      })}
                    </div>
                  </div>

                  {field('xws-addr', 'business_address', MapPin, 'Business Address *', {
                    placeholder: 'Street address, City, State, ZIP Code', autoComplete: 'street-address'
                  })}

                  <div className="xws-2col">
                    <div>
                      {field('xws-phone', 'phone', Phone, 'Phone Number *', {
                        type: 'tel', placeholder: 'e.g. 407-555-0199', autoComplete: 'tel'
                      })}
                    </div>
                    <div>
                      {field('xws-email', 'email', Mail, 'Email Address *', {
                        type: 'email', placeholder: 'contact@yourbusiness.com', autoComplete: 'email'
                      })}
                    </div>
                  </div>

                  <div className="xws-2col">
                    <div>
                      {field('xws-pass', 'password', Lock, 'Password *', {
                        type: 'password', placeholder: 'Min 6 characters', autoComplete: 'new-password'
                      })}
                    </div>
                    <div>
                      {field('xws-pass2', 'confirm_password', Lock, 'Confirm Password *', {
                        type: 'password', placeholder: 'Repeat password', autoComplete: 'new-password'
                      })}
                    </div>
                  </div>

                  <label className="xws-label" htmlFor="xws-mem">Membership Type</label>
                  <div className="xws-field">
                    <Crown size={17} />
                    <select
                      id="xws-mem" name="membership" className="xws-select"
                      value={formData.membership} onChange={handleChange}
                    >
                      <option value="Wholesale customer">Wholesale customer</option>
                    </select>
                    <span className="xws-select-chev"><ChevronDown size={17} /></span>
                  </div>

                  <button type="submit" className="xws-submit" disabled={loading}>
                    {loading ? 'Submitting application...' : (
                      <>Submit application <ArrowRight size={16} /></>
                    )}
                  </button>

                  <div className="xws-secure">
                    <Lock size={13} /> Your information is secure and will only be used for wholesale purposes.
                  </div>
                  <p className="xws-terms">
                    By submitting, you agree to our <Link to="/legal/terms">Terms</Link> &amp;{' '}
                    <Link to="/legal/privacy-policy">Privacy Policy</Link>.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}
