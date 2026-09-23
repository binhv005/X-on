import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Phone,
  CheckCircle,
  Star,
  Play,
  Pause,
  Gem,
  Gift,
  ShieldCheck,
  RotateCcw,
  Sliders,
  HeartHandshake,
  ShoppingBag,
  Mail,
  Send,
  Palette
} from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/product/ProductCard';
import PriceDisplay from '../../components/product/PriceDisplay';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Scroll-triggered Video Component: only plays when scrolled into viewport
function ScrollPlayVideo({ src, fallback, onEnded, style, className, loop = true, muted = true, playsInline = true, ...rest }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.15
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      onEnded={onEnded}
      onError={(e) => {
        if (fallback && e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
          e.currentTarget.play().catch(() => {});
        }
      }}
      style={style}
      className={className}
      {...rest}
    />
  );
}

export default function HomePage() {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [content, setContent] = useState(null);
  const [allHandmade, setAllHandmade] = useState([]);
  const [handmadeNails, setHandmadeNails] = useState([]);
  const [selectedShape, setSelectedShape] = useState('all');
  const [nailEssentials, setNailEssentials] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero single intro video (middle video played first individually)
  const singleIntroVideo = {
    id: 'intro-vid',
    title: 'Acrygel Haute Couture',
    src: '/assets/videos/1K34PRO8E_DMCL0D.mp4',
    fallback: 'https://res.cloudinary.com/ai1z2oaj/video/upload/v1790134359/1K34PRO8E_DMCL0D.mp4'
  };

  // Hero dual split videos (left and right side-by-side)
  const duoHeroVideos = [
    {
      id: 'duo-left',
      title: 'Artisan Floral & Pearl Swatches',
      src: '/assets/videos/1K34PRO84_DMCL0D.mp4',
      fallback: 'https://res.cloudinary.com/ai1z2oaj/video/upload/v1790134363/1K34PRO84_DMCL0D.mp4'
    },
    {
      id: 'duo-right',
      title: 'Moonlight Cat Eye & Chrome Couture',
      src: '/assets/videos/1K34PRO8K_DMCL0D.mp4',
      fallback: 'https://res.cloudinary.com/ai1z2oaj/video/upload/v1790134357/1K34PRO8E_DMCL0D_1.mp4'
    }
  ];

  // Craftsmanship video playlist
  const craftsmanshipVideos = [
    {
      id: 'craft-1',
      title: 'Precision Tip Shaping & Sculpting',
      subtitle: 'Seamless natural apex reinforcement',
      src: 'https://res.cloudinary.com/ai1z2oaj/video/upload/v1790134363/1K34PRO84_DMCL0D.mp4'
    },
    {
      id: 'craft-2',
      title: 'Multi-layer Gel Art & High Gloss Finish',
      subtitle: 'Salon durability tested for 3+ weeks wear',
      src: 'https://res.cloudinary.com/ai1z2oaj/video/upload/v1790135671/1K34PRO8K_DMCL0D_1.mp4'
    },
    {
      id: 'craft-3',
      title: 'Diamond Accents & Chrome Application',
      subtitle: 'Hand-placed crystals with UV resin bonding',
      src: 'https://res.cloudinary.com/ai1z2oaj/video/upload/v1790134357/1K34PRO8E_DMCL0D_1.mp4'
    }
  ];

  // Stage: 'single' (plays middle video only) -> 'duo' (plays left & right split)
  const [heroStage, setHeroStage] = useState('single');
  const [selectedVideo, setSelectedVideo] = useState(0);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [contentRes, productsRes, reviewsRes] = await Promise.all([
          api.getPageContent('home').catch(() => ({ data: null })),
          api.getProducts({ all: 'true' }).catch(() => ({ data: [] })),
          api.getReviews().catch(() => ({ data: [] }))
        ]);

        if (contentRes?.data) setContent(contentRes.data);

        const prods = productsRes?.data || [];
        const handmade = prods.filter(p => p.product_type === 'Handmade Press-On Nails' && !p.is_bundle);
        setAllHandmade(handmade);
        setHandmadeNails(handmade.slice(0, 8));
        setNailEssentials(prods.filter(p => p.product_type === 'Nail Essentials').slice(0, 3));
        setBestSellers(prods.filter(p => p.is_best_seller || (p.categories && p.categories.includes('Best Sellers'))).slice(0, 6));
        setReviews(reviewsRes?.data || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Curating X-ON collection..." />;
  }

  const heroHeading = content?.hero_heading || 'X-ON';
  const heroTagline = content?.hero_tagline || 'Press On. Slay On. Repeat.';
  const heroDesc = content?.hero_description || 'Where modern nail artistry meets effortless beauty. Handcrafted press-on sets and curated nail essentials designed for nail lovers and salon professionals alike.';
  const heroImg = content?.hero_image || '/assets/images/IMG_7098.JPG';

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* 1. HERO SECTION: DYNAMIC VIDEO STAGE (Single Middle Video -> 2 Split Videos Left & Right) */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 105px)',
        minHeight: '560px',
        maxHeight: '820px',
        overflow: 'hidden',
        background: '#09090c',
        transition: 'all 0.5s ease'
      }}>
        {/* STAGE 1: SINGLE INTRO VIDEO (MIDDLE VIDEO) */}
        {heroStage === 'single' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              background: '#000',
              animation: 'fadeIn 0.6s ease'
            }}
          >
            <ScrollPlayVideo
              src={singleIntroVideo.src}
              fallback={singleIntroVideo.fallback}
              loop={false}
              muted
              playsInline
              onEnded={() => setHeroStage('duo')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        )}

        {/* STAGE 2: 2 SIDE-BY-SIDE SPLIT VIDEOS (LEFT & RIGHT) */}
        {heroStage === 'duo' && (
          <div
            className="hero-video-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              width: '100%',
              height: '100%',
              position: 'absolute',
              inset: 0,
              animation: 'fadeIn 0.6s ease'
            }}
          >
            {duoHeroVideos.map((video, idx) => (
              <div
                key={`${video.id}-${idx}`}
                className={`hero-video-col hero-col-${idx}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  background: '#000',
                  borderRight: idx === 0 ? '2px solid rgba(255, 255, 255, 0.15)' : 'none'
                }}
              >
                <ScrollPlayVideo
                  src={video.src}
                  fallback={video.fallback}
                  loop={idx !== 0} // Loop right video, left triggers cycle back
                  muted
                  playsInline
                  onEnded={() => {
                    if (idx === 0) setHeroStage('single');
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Subtle Dark Bottom Vignette Gradient */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '220px',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.35) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 5
        }} />



        {/* Bottom Left Action Buttons: SHOP NOW & CALL NOW */}
        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '2.5rem',
          zIndex: 15,
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap'
        }}>
          {/* SHOP NOW Button */}
          <Link
            to="/shop"
            style={{
              background: 'rgba(18, 18, 22, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255, 255, 255, 0.95)',
              color: '#ffffff',
              padding: '0.9rem 2.25rem',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
              transition: 'all 0.2s ease',
              display: 'inline-block'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(18, 18, 22, 0.75)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            SHOP NOW
          </Link>

          {/* CALL NOW Button */}
          <a
            href="tel:689-212-8888"
            style={{
              background: 'linear-gradient(135deg, #df8924 0%, #c87110 100%)',
              color: '#ffffff',
              padding: '0.9rem 2.25rem',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(223, 137, 36, 0.5)',
              transition: 'all 0.2s ease',
              display: 'inline-block',
              border: '2px solid transparent'
            }}
            onMouseOver={e => { e.currentTarget.style.filter = 'brightness(1.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            CALL NOW
          </a>
        </div>

        {/* Responsive Mobile Styles */}
        <style>{`
          @media (max-width: 900px) {
            .hero-video-grid {
              grid-template-columns: 1fr !important;
            }
            .hero-col-1, .hero-col-2 {
              display: none !important;
            }
          }
          @media (min-width: 901px) and (max-width: 1200px) {
            .hero-video-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .hero-col-2 {
              display: none !important;
            }
          }
        `}</style>
      </section>

      {/* 2. VALUE PROPOSITIONS BAR */}
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(179, 135, 40, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <Gem size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>100% Handcrafted Gel</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Multi-layer salon builder gel strength</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(179, 135, 40, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <RotateCcw size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>Reusable Up to 5x</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Damage-free wear & easy soak-off</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(179, 135, 40, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <Gift size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>Free Application Kit</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Included with every handmade set</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(179, 135, 40, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <MapPin size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>Kissimmee Studio</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct artisan production in FL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISUAL CATEGORIES TILES */}
      <section className="section-py" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Explore Collections</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Find the perfect manicure style or professional care essentials for your everyday luxury routine.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {/* Tile 1 */}
            <Link to="/shop?product_type=handmade-press-on-nails" style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              height: '340px',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-sm)',
              display: 'block',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(179, 135, 40, 0.22)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <ScrollPlayVideo
                src="https://res.cloudinary.com/ai1z2oaj/video/upload/v1790134363/1K34PRO84_DMCL0D.mp4"
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.75rem',
                color: '#fff'
              }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold-light)', fontWeight: 700 }}>Artisan Line</span>
                <h3 className="font-heading" style={{ fontSize: '1.45rem', color: '#fff', margin: '0.25rem 0 0.5rem 0' }}>Handmade Nails</h3>
                <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.9)' }}>
                  Discover Sets <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Tile 2 */}
            <Link to="/shop?product_type=nail-essentials" style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              height: '340px',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-sm)',
              display: 'block',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(179, 135, 40, 0.22)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <ScrollPlayVideo
                src="https://res.cloudinary.com/ai1z2oaj/video/upload/v1790135671/1K34PRO8K_DMCL0D_1.mp4"
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.75rem',
                color: '#fff'
              }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold-light)', fontWeight: 700 }}>Salon Supplies</span>
                <h3 className="font-heading" style={{ fontSize: '1.45rem', color: '#fff', margin: '0.25rem 0 0.5rem 0' }}>Nail Essentials</h3>
                <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.9)' }}>
                  Explore Care <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Tile 3 */}
            <Link to="/bundle-and-save" style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              height: '340px',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-sm)',
              display: 'block',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(179, 135, 40, 0.22)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <ScrollPlayVideo
                src="https://res.cloudinary.com/ai1z2oaj/video/upload/v1790134357/1K34PRO8E_DMCL0D_1.mp4"
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.75rem',
                color: '#fff'
              }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold-light)', fontWeight: 700 }}>Exclusive Value</span>
                <h3 className="font-heading" style={{ fontSize: '1.45rem', color: '#fff', margin: '0.25rem 0 0.5rem 0' }}>Bundle & Save</h3>
                <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.9)' }}>
                  Save Up to 25% <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. REAL CRAFTSMANSHIP VIDEO SHOWCASE SECTION */}
      <section className="section-py" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">In Real Motion</span>
            <h2 className="section-title">Artistry in High Definition</h2>
            <p className="section-subtitle">
              See the brilliant light reflection, seamless cuticle curvature, and durable multi-layer salon build of authentic X-ON handmade nails.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            {/* Video Player Box */}
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
              border: '2px solid rgba(179, 135, 40, 0.4)',
              background: '#000',
              position: 'relative'
            }}>
              <ScrollPlayVideo
                key={craftsmanshipVideos[selectedVideo].src}
                src={craftsmanshipVideos[selectedVideo].src}
                loop
                muted
                playsInline
                style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>{craftsmanshipVideos[selectedVideo].title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{craftsmanshipVideos[selectedVideo].subtitle}</div>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'var(--accent-gold)', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
                  4K CLARITY
                </span>
              </div>
            </div>

            {/* Video Playlist & Feature List */}
            <div>
              <span className="brand-line">Why Handcrafted Nails Excel</span>
              <h3 className="font-heading" style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: '0.5rem 0 1.5rem 0' }}>
                Flawless Salon Results in 10 Minutes.
              </h3>

              {/* Video Selector Tabs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {craftsmanshipVideos.map((vid, idx) => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(idx)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      background: selectedVideo === idx ? 'var(--bg-surface)' : 'rgba(0,0,0,0.03)',
                      border: selectedVideo === idx ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      boxShadow: selectedVideo === idx ? 'var(--shadow-md)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: selectedVideo === idx ? 'var(--accent-gold-dark)' : 'var(--text-primary)' }}>
                        {vid.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {vid.subtitle}
                      </div>
                    </div>
                    <Play size={16} color={selectedVideo === idx ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/gallery-product" className="btn btn-primary">
                  View Nail Gallery
                </Link>
                <Link to="/sizing-chart" className="btn btn-outline">
                  Find Your Size Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS — HORIZONTAL SHOWCASE */}
      <section className="section-py" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Most Coveted</span>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">
              Our most viral sets, chosen by nail lovers for their irresistible luster and longevity.
            </p>
          </div>

          {/* Horizontal Best Sellers Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1240px',
            margin: '0 auto'
          }}>
            {bestSellers.map(product => {
              const image = product.images && product.images.length > 0 ? product.images[0] : '/assets/images/IMG_7098.JPG';
              return (
                <div
                  key={product.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: '14px',
                    gap: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    overflow: 'hidden'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Left: Compact Image (125px x 125px) */}
                  <Link
                    to={`/product/${product.slug}`}
                    style={{
                      position: 'relative',
                      width: '125px',
                      height: '125px',
                      flexShrink: 0,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      display: 'block'
                    }}
                  >
                    <img
                      src={image}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/IMG_7098.JPG';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {product.sale_price && (
                      <span className="badge badge-sale" style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '0.65rem', padding: '2px 6px' }}>
                        Sale
                      </span>
                    )}
                    <span className="badge badge-gold" style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '0.65rem', padding: '2px 6px' }}>
                      Best Seller
                    </span>
                  </Link>

                  {/* Right: Product Details & Quick Add */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minWidth: 0 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold-dark)', fontWeight: 700 }}>
                          {product.shape ? `${product.shape} Shape` : 'Handmade'}
                        </span>
                        {product.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <RatingStars rating={product.rating} size={11} />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({product.reviews_count || 5})</span>
                          </div>
                        )}
                      </div>

                      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{
                          fontSize: '0.98rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: '0.45rem',
                          lineHeight: 1.3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {product.name}
                        </h3>
                      </Link>

                      <PriceDisplay price={product.price} salePrice={product.sale_price} size="sm" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Sparkles size={11} color="var(--accent-gold)" /> Kit included
                      </span>
                      <button
                        onClick={() => addToCart(product, product.sizes?.[0] || 'M', 1)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ShoppingBag size={12} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/shop" className="btn btn-outline">
              View All Best Sellers <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. BUNDLE & SAVE PROMOTION BANNER */}
      <section style={{ padding: '2rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1c1c21 0%, #2a2824 50%, #1c1c21 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2.5rem',
            color: '#fff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            border: '1px solid rgba(179, 135, 40, 0.4)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold-light)', fontWeight: 700 }}>
                Special Multi-Pack Value
              </span>
              <h2 className="font-heading" style={{ fontSize: '2.4rem', color: '#fff', margin: '0.75rem 0 1rem 0', lineHeight: 1.2 }}>
                Bundle 3 Sets & Save 20%
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Mix & match any handmade press-on styles. Every set includes our signature dual-action application kit with premium nail tabs and salon liquid adhesive.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/bundle-and-save" className="btn btn-primary btn-lg">
                  Build Your Bundle <ArrowRight size={16} />
                </Link>
                <Link to="/sizing-chart" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Sizing Guide
                </Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(179, 135, 40, 0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold-light)', marginBottom: '0.25rem' }}>15% OFF</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>Buy Any 2 Sets</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>Auto-applied at checkout</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(179, 135, 40, 0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold-light)', marginBottom: '0.25rem' }}>20% OFF</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>Buy 3+ Sets</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>Includes Free Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ARTISAN SELECTION — HANDMADE PRESS-ON NAILS */}
      <section className="section-py" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="brand-line">Artisan Selection</span>
            <h2 className="section-title">Handmade Press-On Nails</h2>
            <p className="section-subtitle">
              Individually sculpted by certified nail artists using premium salon gel and high-pigment pigments.
            </p>

            {/* Shape Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {['all', 'Almond', 'Coffin', 'Stiletto', 'Square', 'Oval'].map(shape => {
                const isActive = selectedShape.toLowerCase() === shape.toLowerCase();
                return (
                  <button
                    key={shape}
                    onClick={() => {
                      setSelectedShape(shape);
                      if (shape === 'all') {
                        setHandmadeNails(allHandmade.slice(0, 8));
                      } else {
                        const filtered = allHandmade.filter(p => p.shape?.toLowerCase() === shape.toLowerCase());
                        setHandmadeNails(filtered.length > 0 ? filtered.slice(0, 8) : allHandmade.slice(0, 8));
                      }
                    }}
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: '24px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'linear-gradient(135deg, #b38728 0%, #8c6716 100%)' : 'var(--bg-surface)',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      border: isActive ? '1px solid transparent' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(179, 135, 40, 0.25)' : 'none'
                    }}
                  >
                    {shape === 'all' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Sparkles size={13} /> All Shapes
                      </span>
                    ) : shape}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact, elegant product grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1280px',
            margin: '0 auto'
          }}>
            {handmadeNails.map(product => (
              <ProductCard key={product.id} product={product} compact={true} imageAspect="78%" />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/shop?product_type=handmade-press-on-nails" className="btn btn-outline">
              View All Press-On Sets <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. NAIL ESSENTIALS & PROFESSIONAL CARE */}
      <section className="section-py" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Professional Essentials</span>
            <h2 className="section-title">Nail Essentials</h2>
            <p className="section-subtitle">
              Selected nail essentials designed with quality, style, and performance in mind for nail lovers and professionals.
            </p>
          </div>

          <div className="grid-3">
            {nailEssentials.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/shop?product_type=nail-essentials" className="btn btn-outline">
              Explore Professional Care & Adhesives <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. 3-STEP EASY APPLICATION GUIDE */}
      <section className="section-py" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Simple Routine</span>
            <h2 className="section-title">How It Works in 3 Easy Steps</h2>
            <p className="section-subtitle">
              Achieve a high-shine, damage-free salon manicure in the comfort of your home.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #b38728 0%, #8c6716 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 6px 16px rgba(179, 135, 40, 0.3)'
              }}>
                1
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Measure & Prep
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Gently push cuticles back, buff natural nail surface lightly with included buffer, and wipe clean with alcohol prep pad.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #b38728 0%, #8c6716 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 6px 16px rgba(179, 135, 40, 0.3)'
              }}>
                2
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Apply Adhesive
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Choose adhesive sticky tabs for 3–7 day wear or salon brush-on glue for 2–3 week maximum durability.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #b38728 0%, #8c6716 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 6px 16px rgba(179, 135, 40, 0.3)'
              }}>
                3
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Press On & Slay
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Align nail tip at 45° angle from cuticle line, press firmly for 30 seconds. Repeat and enjoy instant glam!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS & SOCIAL PROOF */}
      <section className="section-py" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Customer Love</span>
            <h2 className="section-title">Our Reviews</h2>
            <p className="section-subtitle">
              Loved by nail enthusiasts and salon technicians across the nation.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            maxWidth: '1240px',
            margin: '0 auto'
          }}>
            {reviews.slice(0, 3).map(rev => (
              <div
                key={rev.id}
                className="glass-card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  borderRadius: '14px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <RatingStars rating={rev.rating} size={15} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #b38728 0%, #8c6716 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>{rev.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-dark)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                      <CheckCircle size={12} /> Verified X-ON Customer
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FIND US & STUDIO SHOWCASE */}
      <section className="section-py" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-gold)'
          }}>
            <span className="brand-line" style={{ display: 'block', marginBottom: '0.5rem' }}>Visit Our Studio & Showcase</span>
            <h2 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Find Us
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={22} color="var(--accent-gold)" />
                <strong>3168 Bill Beck Blvd, Kissimmee, FL 34744</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={20} color="var(--accent-gold)" />
                <a href="tel:689-212-8888" style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>
                  689-212-8888
                </a>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
              From bespoke bridal styling to salon wholesale pickups, our Kissimmee artisan team is ready to assist you with every luxury nail detail.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact-us" className="btn btn-primary">
                Contact Our Studio
              </Link>
              <Link to="/wholesale-signup" className="btn btn-outline">
                Wholesale Registration
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
