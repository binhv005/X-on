import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Star,
  Award,
  Clock,
  Check,
  Package,
  Users,
  HeartHandshake,
  ShieldCheck,
  Store
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './ContactPage.css';

const PHONE = '689-212-8888';
const ADDRESS_L1 = '3168 Bill Beck Blvd,';
const ADDRESS_L2 = 'Kissimmee, FL 34744';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const HANDMADE_POINTS = [
  { icon: <Sparkles size={13} />, text: 'Unique & trendy designs' },
  { icon: <Award size={13} />, text: 'High-quality materials' },
  { icon: <Star size={13} />, text: 'Multiple styles for every look' },
  { icon: <Clock size={13} />, text: 'Easy, fast & more accessible beauty' },
  { icon: <Check size={13} />, text: 'A polished, luxury finish' }
];

const ESSENTIALS_POINTS = [
  { icon: <Package size={13} />, text: 'Carefully selected products' },
  { icon: <Users size={13} />, text: 'For nail lovers & professionals' },
  { icon: <Award size={13} />, text: 'Quality, style & performance' },
  { icon: <Store size={13} />, text: 'Everything you need in one place' },
  { icon: <HeartHandshake size={13} />, text: 'Elevate your nail experience' }
];

export default function ContactPage() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({ name: '', email: '', order_number: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setFormError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your first & last name.';
    else if (formData.name.trim().length > 120) errs.name = 'Name is too long (max 120 characters).';
    if (!formData.email.trim()) errs.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(formData.email.trim().toLowerCase())) errs.email = 'Please enter a valid email address.';
    if (!formData.message.trim()) errs.message = 'Please tell us how we can help.';
    else if (formData.message.trim().length < 10) errs.message = 'Message should be at least 10 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setFormError('Please review the highlighted fields below.');
      return;
    }
    try {
      setLoading(true);
      setFormError('');
      const res = await api.submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        order_number: formData.order_number.trim(),
        message: formData.message.trim()
      });
      if (res.success) {
        setSuccess(true);
        addToast('Message sent to X-ON studio team successfully!', 'success');
        setFormData({ name: '', email: '', order_number: '', message: '' });
      }
    } catch (err) {
      const msg = err.message || 'Failed to send message. Please try again or call our hotline.';
      setFormError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const smoothScrollTo = (targetPosition, duration = 850) => {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      } else {
        document.documentElement.style.scrollBehavior = prevScrollBehavior;
      }
    };

    requestAnimationFrame(step);
  };

  const scrollToForm = (e) => {
    e.preventDefault();
    const el = document.getElementById('xc-form');
    if (el) {
      const headerOffset = 72;
      const elementPosition = el.getBoundingClientRect().top;
      const targetY = elementPosition + (window.pageYOffset || document.documentElement.scrollTop) - headerOffset;
      smoothScrollTo(targetY, 850);
    }
  };

  return (
    <div className="xcontact">
      {/* ================= HERO — LET'S TALK NAILS ================= */}
      <section className="xc-hero">
        <div className="xc-container">
          <div className="xc-hero-grid">
            <div className="xc-hero-left">
              <div className="xc-eyebrow">Contact Us</div>
              <h1 className="xc-hero-title">
                LET&rsquo;S TALK
                <br />
                <span className="xc-wine-text">NAILS.</span>
                <span className="xc-spark">✦</span>
              </h1>
              <p className="xc-hero-sub">
                Questions, custom sets, or wholesale inquiries?
                <br />
                We&rsquo;re here to assist you.
              </p>
              <button
                type="button"
                onClick={scrollToForm}
                className="xc-btn-wine"
                style={{ marginTop: '0.85rem' }}
              >
                Get in touch <ArrowRight size={15} />
              </button>
            </div>

            <div className="xc-hero-visual" aria-hidden="true">
              <div className="xc-arch">
                <img
                  src="/assets/images/IMG_7098.JPG"
                  alt="X-ON handmade emerald and gold press-on nails"
                  loading="eager"
                />
              </div>
              <div className="xc-polaroid">
                <img
                  src="/assets/images/IMG_7106.JPG"
                  alt="X-ON pink 3D floral press-on nails"
                  loading="lazy"
                />
              </div>
              <div className="xc-sticker">
                Small details
                <br />
                Make a <b>big statement</b> <b>♡</b>
              </div>
              <div className="xc-badge">
                <svg viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
                  <defs>
                    <path id="xc-circle" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
                  </defs>
                  <text fontSize="10" letterSpacing="2.2" fill="#b38728" fontWeight="700">
                    <textPath href="#xc-circle">HANDMADE NAILS • X-ON •</textPath>
                  </text>
                  <text x="50" y="48" textAnchor="middle" fontSize="15" fill="#b38728">✦</text>
                  <text x="50" y="68" textAnchor="middle" fontSize="14" fontFamily="Cinzel, serif" fontWeight="700" fill="#1c1c21">X-ON</text>
                </svg>
              </div>
              <div className="xc-side-note">
                <span className="xc-side-star">✦</span>
                BEAUTY
                <br />
                QUALITY
                <br />
                CONFIDENCE
                <br />
                ALWAYS WITH YOU
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE X-ON? ================= */}
      <section className="xc-why">
        <div className="xc-container">
          <div className="xc-why-head">
            <div>
              <div className="xc-eyebrow">Why Choose</div>
              <h2 className="xc-why-title">X-ON?</h2>
            </div>
            <div className="xc-why-script">
              Nail Art
              <br />A Better You ♡
            </div>
          </div>

          <div className="xc-why-grid">
            <article className="xc-why-card">
              <img
                src="/assets/images/IMG_7101.JPG"
                alt="Handmade citrus and floral press-on nails"
                loading="lazy"
              />
              <div className="xc-why-body">
                <div className="xc-why-num">01</div>
                <h3 className="xc-why-name">
                  Handmade
                  <br />
                  Press-On Nails
                </h3>
                <ul className="xc-why-list">
                  {HANDMADE_POINTS.map((p) => (
                    <li key={p.text}>
                      <span className="xc-why-ico">{p.icon}</span>
                      <span>{p.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/shop" className="xc-text-link">
                  Shop now <ArrowRight size={14} />
                </Link>
              </div>
            </article>

            <article className="xc-why-card">
              <img
                src="/assets/images/IMG_7104.JPG"
                alt="Blue chrome and mosaic nail essentials collection"
                loading="lazy"
              />
              <div className="xc-why-body">
                <div className="xc-why-num">02</div>
                <h3 className="xc-why-name">Nail Essentials</h3>
                <ul className="xc-why-list">
                  {ESSENTIALS_POINTS.map((p) => (
                    <li key={p.text}>
                      <span className="xc-why-ico">{p.icon}</span>
                      <span>{p.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/shop" className="xc-text-link">
                  Discover now <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= CONTACT X-ON + FORM ================= */}
      <section className="xc-contact" id="xc-form" style={{ scrollMarginTop: '90px' }}>
        <div className="xc-container">
          <div className="xc-contact-grid">
            <div className="xc-contact-info">
              <h2 className="xc-contact-title">
                CONTACT
                <br />
                <span>X-ON</span>
              </h2>
              <div className="xc-contact-rule" aria-hidden="true" />
              <p className="xc-contact-sub">We&rsquo;d love to hear from you!</p>
              <p className="xc-contact-desc">
                Have a question about our products or an order? Send us a message and we&rsquo;ll get back to you promptly.
              </p>

              <div className="xc-info-row">
                <span className="xc-info-ico">
                  <Phone size={19} />
                </span>
                <div>
                  <strong>
                    <a href={`tel:${PHONE}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {PHONE}
                    </a>
                  </strong>
                  <small>Mon - Sun, 9:00 AM - 6:00 PM (EST)</small>
                </div>
              </div>

              <div className="xc-info-row">
                <span className="xc-info-ico">
                  <MapPin size={19} />
                </span>
                <div className="xc-info-addr">
                  {ADDRESS_L1}
                  <br />
                  {ADDRESS_L2}
                </div>
              </div>

              <div className="xc-connect-script">Let&rsquo;s Connect</div>
            </div>

            <div className="xc-form-card">
              {success ? (
                <div className="xc-success">
                  <span className="xc-success-ico">
                    <CheckCircle2 size={30} />
                  </span>
                  <h3 className="xc-form-title">Message sent!</h3>
                  <p className="xc-form-sub" style={{ marginTop: '8px' }}>
                    Thank you for reaching out to X-ON. Your inquiry has been saved and our studio
                    team will reply shortly.
                  </p>
                  <button type="button" className="xc-btn-wine" onClick={() => setSuccess(false)}>
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="xc-form-title">Send us a message</h3>
                  <p className="xc-form-sub">Fill out the form below and we&rsquo;ll get back to you soon.</p>
                  <form onSubmit={handleSubmit} noValidate>
                    {formError && (
                      <div className="xc-form-alert" role="alert">
                        <AlertCircle size={15} />
                        <span>{formError}</span>
                      </div>
                    )}

                    <label className="xc-label" htmlFor="xc-name">
                      First &amp; Last Name <i>*</i>
                    </label>
                    <input
                      id="xc-name"
                      name="name"
                      className={`xc-input${fieldErrors.name ? ' xc-input-error' : ''}`}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                    {fieldErrors.name && <div className="xc-field-err">{fieldErrors.name}</div>}

                    <label className="xc-label" htmlFor="xc-email">
                      Email Address <i>*</i>
                    </label>
                    <input
                      id="xc-email"
                      name="email"
                      type="email"
                      className={`xc-input${fieldErrors.email ? ' xc-input-error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {fieldErrors.email && <div className="xc-field-err">{fieldErrors.email}</div>}

                    <label className="xc-label" htmlFor="xc-order">
                      Phone / Order Number
                    </label>
                    <input
                      id="xc-order"
                      name="order_number"
                      className="xc-input"
                      value={formData.order_number}
                      onChange={handleChange}
                      placeholder="Phone number or order # (optional)"
                    />

                    <label className="xc-label" htmlFor="xc-message">
                      Message <i>*</i>
                    </label>
                    <textarea
                      id="xc-message"
                      name="message"
                      className={`xc-textarea${fieldErrors.message ? ' xc-input-error' : ''}`}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                    />
                    {fieldErrors.message && <div className="xc-field-err">{fieldErrors.message}</div>}

                    <button type="submit" className="xc-btn-wine xc-submit" disabled={loading}>
                      {loading ? 'Sending...' : (
                        <>
                          Send message <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    <p className="xc-terms">
                      By submitting this form, you agree to our{' '}
                      <Link to="/legal/terms">Terms</Link> &amp; <Link to="/legal/privacy-policy">Privacy Policy</Link>.
                      <br />
                      We&rsquo;ll only use your information to respond to your inquiry.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHOLESALE BANNER ================= */}
      <section className="xc-wholesale">
        <div className="xc-container">
          <div className="xc-ws-banner">
            <img
              src="/assets/images/IMG_7105.JPG"
              alt="Yellow 3D floral wholesale press-on nails"
              loading="lazy"
            />
            <div>
              <h3 className="xc-ws-title">Looking to stock X-ON?</h3>
              <p className="xc-ws-sub">Wholesale inquiries welcome!</p>
              <p className="xc-ws-desc">
                Join our wholesale program and bring X-ON to your store. Get exclusive pricing and
                access to our latest collections.
              </p>
            </div>
            <Link to="/wholesale-signup" className="xc-btn-wine">
              Wholesale signup <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
