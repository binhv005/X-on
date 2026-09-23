import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Calendar, Bell, ArrowRight, Play,
  Volume2, VolumeX, CheckCircle2, Camera, Gem, MapPin, X,
  Truck, ShieldCheck, Leaf, Crown
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import './GalleryComingSoonPage.css';

/* Mẫu fallback — hiển thị khi API chưa có dữ liệu */
const FALLBACK_CARDS = [
  {
    id: 'blooming-grace',
    eyebrow: 'Upcoming Collection 01',
    title: 'Blooming Grace',
    desc: 'A soft and romantic collection inspired by spring florals, featuring delicate 3D petals, pearls, and pastel tones.',
    season: 'Spring 2025',
    launch: 'Mar 15, 2025',
    media: '/assets/images/IMG_7106.JPG'
  },
  {
    id: 'celestial-twilight',
    eyebrow: 'Upcoming Collection 02',
    title: 'Celestial Twilight',
    desc: 'Deep galaxy blues, holographic constellation charting, and luminous quartz accents.',
    season: 'Summer 2025',
    launch: 'Jun 10, 2025',
    media: '/assets/images/IMG_7104.JPG'
  },
  {
    id: 'golden-baroque',
    eyebrow: 'Upcoming Collection 03',
    title: 'Golden Baroque Couture',
    desc: 'Dramatic gold filigree, antique pearls, and textured rococo gilding.',
    season: 'Fall 2025',
    launch: 'Aug 25, 2025',
    media: '/assets/images/IMG_7102.JPG'
  },
  {
    id: 'runway-featured',
    eyebrow: 'Featured / New Collection',
    title: 'High-Artisan Runway Series',
    desc: 'Limited-edition bespoke wearable art handcrafted by master technicians, exclusively for members.',
    season: 'Members Exclusive',
    launch: 'Exclusively for Members',
    media: '/assets/images/IMG_7098.JPG'
  }
];

const REEL_SRC = '/assets/videos/1K34PRO8K_DMCL0D.mp4';

export default function GalleryComingSoonPage() {
  const { addToast } = useToast();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Studio reel modal
  const [reelModalOpen, setReelModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Notify modal
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [selectedColTitle, setSelectedColTitle] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  useEffect(() => {
    async function loadCollections() {
      try {
        setLoading(true);
        const res = await api.getComingSoonCollections();
        if (res.success && res.data) setCollections(res.data);
      } catch (err) {
        console.error('Error fetching coming soon collections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted, reelModalOpen]);

  const handleOpenNotify = (colTitle) => {
    setSelectedColTitle(colTitle);
    setNotifySuccess(false);
    setNotifyModalOpen(true);
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifySuccess(true);
    addToast(`You are on the VIP priority waitlist for ${selectedColTitle || 'upcoming releases'}!`, 'success');
    setTimeout(() => {
      setNotifyModalOpen(false);
      setNotifyEmail('');
      setNotifySuccess(false);
    }, 2000);
  };

  if (loading) {
    return <LoadingSpinner text="Loading upcoming collection previews..." />;
  }

  /* Ưu tiên dữ liệu admin, thiếu thì dùng 4 mẫu mặc định */
  const list = collections.length
    ? collections.map((c, i) => ({
        id: c.id,
        eyebrow: c.collection_name || `Upcoming Collection 0${i + 1}`,
        title: c.title,
        desc: c.subtitle || '',
        season: c.expected_launch || 'Seasonal Release',
        launch: c.expected_launch || 'To be announced',
        media: c.media,
        fallbackImg: FALLBACK_CARDS[i % FALLBACK_CARDS.length].media
      }))
    : FALLBACK_CARDS.map((c) => ({ ...c, fallbackImg: c.media }));

  return (
    <div className="gcs">
      {/* ================= HERO ================= */}
      <section className="gcs-hero">
        <div className="gcs-container">
          <div className="gcs-hero-grid">
            <div>
              <span className="gcs-eyebrow">
                <Sparkles size={14} /> Exclusive Sneak Peeks
              </span>
              <h1 className="gcs-title">
                Gallery —<br />
                Coming Soon Collections
              </h1>
              <p className="gcs-desc">
                Preview our upcoming seasonal releases and high-concept artisan collections currently
                in development at our Kissimmee design studio.
              </p>
              <div className="gcs-cta-row">
                <a href="#upcoming-collections" className="gcs-btn-gold">
                  Explore Upcoming <ArrowRight size={15} />
                </a>
                <button type="button" className="gcs-btn-ghost" onClick={() => setReelModalOpen(true)}>
                  <Play size={14} fill="#ffffff" /> Watch Studio Reel
                </button>
              </div>
              <div className="gcs-stats">
                <div className="gcs-stat">
                  <b>{list.length}</b>
                  <span>Upcoming Collections</span>
                </div>
                <div className="gcs-stat-sep" />
                <div className="gcs-stat">
                  <b>100%</b>
                  <span>Handcrafted Designs</span>
                </div>
                <div className="gcs-stat-sep" />
                <div className="gcs-stat">
                  <b>Be First</b>
                  <span>Get Notified</span>
                </div>
              </div>
            </div>

            <div className="gcs-hero-visual" aria-hidden="true">
              <div className="gcs-pill">
                <b>X-ON</b>
                <span>Design Studio</span>
                <em><MapPin size={10} /> Kissimmee, FL</em>
              </div>
              <div className="gcs-script-white">Behind<br />the Studio Craft</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE BAR ================= */}
      <div className="gcs-features">
        <div className="gcs-container">
          <div className="gcs-features-grid">
            <div className="gcs-feature">
              <span className="gcs-feature-ico"><Camera size={22} strokeWidth={1.8} /></span>
              <div>
                <b>Real Studio Previews</b>
                <p>See authentic behind-the-scenes content from our design process.</p>
              </div>
            </div>
            <div className="gcs-feature">
              <span className="gcs-feature-ico"><Gem size={22} strokeWidth={1.8} /></span>
              <div>
                <b>Upcoming Trends</b>
                <p>Be the first to know what&rsquo;s next in nail artistry.</p>
              </div>
            </div>
            <div className="gcs-feature">
              <span className="gcs-feature-ico"><Bell size={22} strokeWidth={1.8} /></span>
              <div>
                <b>Get Notified</b>
                <p>Join our list and never miss a new drop.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WHAT'S COMING NEXT ================= */}
      <div className="gcs-list" id="upcoming-collections" style={{ scrollMarginTop: '90px' }}>
        <div className="gcs-container">
          <div className="gcs-list-head">
            <div>
              <div className="gcs-list-eyebrow">Upcoming Collections</div>
              <h2 className="gcs-list-title">What&rsquo;s Coming Next</h2>
            </div>
            <div className="gcs-list-script">More Nails<br />More Possibilities ♡</div>
          </div>

          <div className="gcs-cards">
            {list.map((col, idx) => (
              <article className="gcs-card" key={col.id}>
                <div className="gcs-card-media">
                  <img
                    src={col.media}
                    alt={col.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = col.fallbackImg; }}
                  />
                  <span className="gcs-season">{col.season}</span>
                </div>
                <div className="gcs-card-body">
                  <div className="gcs-card-eyebrow">{col.eyebrow}</div>
                  <h3 className="gcs-card-title">{col.title}</h3>
                  {col.desc && <p className="gcs-card-desc">{col.desc}</p>}
                </div>
                <div className="gcs-card-side">
                  <span className="gcs-launch"><Calendar size={14} /> Launching</span>
                  <span className="gcs-date">{col.launch}</span>
                  <button type="button" className="gcs-notify" onClick={() => handleOpenNotify(col.title)}>
                    <Bell size={14} /> Notify Me
                  </button>
                  <span className="gcs-first">Be the first to shop</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ================= QUOTE BAND ================= */}
      <section className="gcs-quote">
        <div className="gcs-quote-inner">
          <p>&ldquo;Artistry Takes Time,<br />But Beauty is Always Worth the Wait.&rdquo;</p>
          <span>X-ON</span>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <div className="gcs-trust">
        <div className="gcs-container">
          <div className="gcs-trust-grid">
            <div className="gcs-trust-item"><Crown size={30} strokeWidth={1.6} /><span>Handcrafted<br />Excellence</span></div>
            <div className="gcs-trust-item"><Truck size={30} strokeWidth={1.6} /><span>Global<br />Shipping</span></div>
            <div className="gcs-trust-item"><ShieldCheck size={30} strokeWidth={1.6} /><span>Trusted by<br />Professionals</span></div>
            <div className="gcs-trust-item"><Leaf size={30} strokeWidth={1.6} /><span>Sustainable<br />Beauty Practices</span></div>
          </div>
        </div>
      </div>

      {/* ================= STUDIO REEL MODAL ================= */}
      {reelModalOpen && (
        <div className="gcs-overlay" onClick={() => setReelModalOpen(false)}>
          <div className="gcs-modal gcs-modal-video" onClick={(e) => e.stopPropagation()}>
            <div className="gcs-modal-head">
              <h3 className="gcs-modal-title" style={{ color: '#e9dcc2' }}>
                <Sparkles size={20} color="#d4a338" /> Studio Teaser Reel
              </h3>
              <button type="button" className="gcs-x" onClick={() => setReelModalOpen(false)} aria-label="Close">
                <X size={17} />
              </button>
            </div>
            <video ref={videoRef} src={REEL_SRC} controls autoPlay muted={isMuted} playsInline />
            <div className="gcs-video-bar">
              <small>X-ON Kissimmee Design Studio — Behind the Craft</small>
              <button type="button" className="gcs-mute" onClick={() => setIsMuted((m) => !m)}>
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NOTIFY MODAL ================= */}
      {notifyModalOpen && (
        <div className="gcs-overlay" onClick={() => setNotifyModalOpen(false)}>
          <div className="gcs-modal" onClick={(e) => e.stopPropagation()}>
            {notifySuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle2 size={48} color="#b08a2e" style={{ margin: '0 auto 1rem auto' }} />
                <h3 className="gcs-modal-title" style={{ justifyContent: 'center' }}>You&rsquo;re on the VIP List!</h3>
                <p style={{ color: '#6f6259', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  We will email you 24 hours before public drop with exclusive private checkout access.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit}>
                <div className="gcs-modal-head">
                  <h3 className="gcs-modal-title">
                    <Bell size={20} color="#b08a2e" /> VIP Launch Notification
                  </h3>
                  <button type="button" className="gcs-x" onClick={() => setNotifyModalOpen(false)} aria-label="Close">
                    <X size={17} />
                  </button>
                </div>
                <p style={{ color: '#6f6259', fontSize: '0.9rem', lineHeight: 1.5, margin: '6px 0 0' }}>
                  Be the first to secure limited sets from <strong>{selectedColTitle}</strong> before public release.
                </p>
                <label className="gcs-label" htmlFor="gcs-notify-email">Email Address *</label>
                <input
                  id="gcs-notify-email"
                  type="email"
                  className="gcs-input"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
                <div className="gcs-modal-actions">
                  <button type="button" className="gcs-btn-secondary" onClick={() => setNotifyModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="gcs-btn-gold" style={{ border: 'none' }}>
                    Join VIP Waitlist
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
