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
import findUsBg from '../../assets/images/findus-bg.jpg';
import motifTop from '../../assets/images/findus-motif-top.png';
import motifBottom from '../../assets/images/findus-motif-bottom.png';
import bundlePromoBg from '../../assets/images/bundle-promo-bg.jpg';
import stepCardBg from '../../assets/images/step-card-bg.jpg';

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
        const handmade = prods.filter(p => p.product_type === 'Handmade Press-On Nails');
        setAllHandmade(handmade);
        setHandmadeNails(handmade.slice(0, 8));
        setNailEssentials(prods.filter(p => p.product_type === 'Nail Essentials').slice(0, 3));
        setBestSellers(prods.filter(p => Boolean(p.is_best_seller) || (p.categories && (p.categories.includes('Best Sellers') || p.categories.includes('best-sellers')))).slice(0, 8));
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
        height: 'calc(100vh - 73px)',
        minHeight: 'calc(100vh - 73px)',
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
              borderRadius: '0px',
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
              background: 'linear-gradient(135deg, #e86154 0%, #c44237 100%)',
              color: '#ffffff',
              padding: '0.9rem 2.25rem',
              borderRadius: '0px',
              fontWeight: 800,
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(232, 97, 84, 0.45)',
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
              borderRadius: '0px',
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
              borderRadius: '0px',
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
              borderRadius: '0px',
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
              borderRadius: '0px',
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
                borderRadius: '0px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>{craftsmanshipVideos[selectedVideo].title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{craftsmanshipVideos[selectedVideo].subtitle}</div>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'var(--accent-gold)', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '0px', fontWeight: 800 }}>
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
                      borderRadius: '0px',
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
                    borderRadius: '0px',
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
                      borderRadius: '0px',
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
      <section style={{
        position: 'relative',
        width: '100%',
        backgroundImage: `url(${bundlePromoBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fbece8',
        padding: '4.5rem 0',
        borderTop: '1px solid rgba(232, 97, 84, 0.25)',
        borderBottom: '1px solid rgba(232, 97, 84, 0.25)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1280px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(10px)',
              padding: '2.5rem 2.25rem',
              border: '1px solid rgba(232, 97, 84, 0.3)',
              boxShadow: '0 12px 32px rgba(232, 97, 84, 0.12)'
            }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 800 }}>
                Special Multi-Pack Value
              </span>
              <h2 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--text-primary)', margin: '0.75rem 0 1rem 0', lineHeight: 1.2 }}>
                Bundle 3 Sets & Save 20%
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Mix & match your favorite handmade styles. Premium application kit included with every set.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/bundle-and-save" className="btn btn-primary btn-lg">
                  Build Your Bundle <ArrowRight size={16} />
                </Link>
                <Link to="/sizing-chart" className="btn btn-outline btn-lg" style={{ background: '#ffffff', color: 'var(--text-primary)', borderColor: 'rgba(232, 97, 84, 0.4)' }}>
                  Sizing Guide
                </Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.75rem', alignItems: 'stretch' }}>
              {/* Ticket 1: 15% OFF */}
              <div className="vintage-coupon-ticket">
                <span className="ticket-header-script">Special</span>
                <span className="ticket-header-title">SALE</span>
                <span className="ticket-subtext-top">Buy Any 2 Sets</span>
                <div className="ticket-discount-number">15%</div>
                <div className="ticket-discount-label">OFF</div>
                <div className="ticket-perforation" />
                <div className="ticket-footer-text">Auto-applied at checkout</div>
              </div>

              {/* Ticket 2: 20% OFF */}
              <div className="vintage-coupon-ticket">
                <span className="ticket-header-script">Bundle</span>
                <span className="ticket-header-title">SALE</span>
                <span className="ticket-subtext-top">Buy 3+ Sets</span>
                <div className="ticket-discount-number">20%</div>
                <div className="ticket-discount-label">OFF</div>
                <div className="ticket-perforation" />
                <div className="ticket-footer-text">Includes Free Shipping</div>
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
                      borderRadius: '0px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'linear-gradient(135deg, #f88b80 0%, #e26155 100%)' : 'var(--bg-surface)',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      border: isActive ? '1px solid transparent' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(232, 97, 84, 0.35)' : 'none'
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
            <div className="glass-card" style={{
              position: 'relative',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.50), rgba(255, 255, 255, 0.50)), url(${stepCardBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#ffdbe4',
              borderRadius: '0px',
              border: '1px solid rgba(232, 97, 84, 0.32)',
              boxShadow: '0 10px 28px rgba(232, 97, 84, 0.12)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f88b80 0%, #e26155 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 6px 16px rgba(232, 97, 84, 0.35)'
              }}>
                1
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#19181b' }}>
                Measure & Prep
              </h3>
              <p style={{ color: '#4a444a', fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500 }}>
                Gently push cuticles back, buff natural nail surface lightly with included buffer, and wipe clean with alcohol prep pad.
              </p>
            </div>

            <div className="glass-card" style={{
              position: 'relative',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.50), rgba(255, 255, 255, 0.50)), url(${stepCardBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#ffdbe4',
              borderRadius: '0px',
              border: '1px solid rgba(232, 97, 84, 0.32)',
              boxShadow: '0 10px 28px rgba(232, 97, 84, 0.12)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f88b80 0%, #e26155 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 6px 16px rgba(232, 97, 84, 0.35)'
              }}>
                2
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#19181b' }}>
                Apply Adhesive
              </h3>
              <p style={{ color: '#4a444a', fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500 }}>
                Choose adhesive sticky tabs for 3–7 day wear or salon brush-on glue for 2–3 week maximum durability.
              </p>
            </div>

            <div className="glass-card" style={{
              position: 'relative',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.50), rgba(255, 255, 255, 0.50)), url(${stepCardBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#ffdbe4',
              borderRadius: '0px',
              border: '1px solid rgba(232, 97, 84, 0.32)',
              boxShadow: '0 10px 28px rgba(232, 97, 84, 0.12)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f88b80 0%, #e26155 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 6px 16px rgba(232, 97, 84, 0.35)'
              }}>
                3
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#19181b' }}>
                Press On & Slay
              </h3>
              <p style={{ color: '#4a444a', fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500 }}>
                Align nail tip at 45° angle from cuticle line, press firmly for 30 seconds. Repeat and enjoy instant glam!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS & SOCIAL PROOF */}
      <section className="section-py" style={{ background: '#fdfaf9', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="brand-line">Customer Love & Social Proof</span>
            <h2 className="section-title">What They Say About X-ON</h2>
            <p className="section-subtitle">
              Loved by nail enthusiasts, content creators, and salon technicians across the nation.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {reviews.slice(0, 3).map((rev, index) => {
              const username = rev.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
              const likes = index === 0 ? 8 : index === 1 ? 5 : 3;
              const timeAgo = index === 0 ? '1w' : index === 1 ? '4d' : '2w';

              const sampleAvatars = [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150&q=80',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
              ];
              const avatarUrl = rev.avatar || sampleAvatars[index % sampleAvatars.length];

              return (
                <div
                  key={rev.id}
                  style={{
                    position: 'relative',
                    background: '#ffffff',
                    borderRadius: '0px',
                    padding: '1.35rem 1.35rem 1.15rem 1.35rem',
                    boxShadow: '0 8px 24px rgba(232, 97, 84, 0.08)',
                    border: '1px solid rgba(232, 97, 84, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 14px 30px rgba(232, 97, 84, 0.16)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 97, 84, 0.08)';
                  }}
                >
                  {/* Top Quote */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <svg width="26" height="20" viewBox="0 0 34 26" fill="#e86154" style={{ opacity: 0.85 }}>
                      <path d="M0 16.25C0 7.25 5.5 1.5 13.5 0L15 3.5C9.5 5.25 7.5 8.75 7.25 11.75C8.5 11.25 10 11 11.5 11C15.5 11 18.5 14 18.5 18.5C18.5 22.5 15.5 25.5 11.5 25.5C5 25.5 0 21 0 16.25ZM15.5 16.25C15.5 7.25 21 1.5 29 0L30.5 3.5C25 5.25 23 8.75 22.75 11.75C24 11.25 25.5 11 27 11C31 11 34 14 34 18.5C34 22.5 31 25.5 27 25.5C20.5 25.5 15.5 21 15.5 16.25Z" />
                    </svg>
                  </div>

                  {/* Instagram Comment Author Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {/* Instagram Rainbow Story Ring with Realistic Avatar Photo */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <img
                          src={avatarUrl}
                          alt={rev.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid #ffffff'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: '#434c34',
                          border: '1.5px solid #ffffff',
                          display: 'none',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}>
                          {rev.name.charAt(0)}
                        </div>
                      </div>

                      {/* Handle & Timestamp */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827' }}>
                          {username}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{timeAgo}</span>
                        <span style={{ fontSize: '0.78rem' }}>❤️</span>
                      </div>
                    </div>

                    {/* Red Heart & Like Counter */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                      <span style={{ color: '#ef4444', fontSize: '0.9rem', lineHeight: 1 }}>❤️</span>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>{likes}</span>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div style={{ flex: 1, marginBottom: '0.85rem' }}>
                    <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.55, margin: 0 }}>
                      <span style={{ color: '#2563eb', fontWeight: 600, marginRight: '5px' }}>@xon.pressons</span>
                      {rev.comment} 😍✨
                    </p>
                  </div>

                  {/* Card Bottom: Customer Name & 5 Gold Stars */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '0.75rem'
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>
                      {rev.name}
                    </span>
                    <RatingStars rating={rev.rating || 5} size={15} />
                  </div>

                  {/* Speech Bubble Tail at bottom-left */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: '22px',
                    width: '0',
                    height: '0',
                    borderTop: '10px solid #ffffff',
                    borderLeft: '10px solid transparent',
                    filter: 'drop-shadow(0 2px 2px rgba(67, 76, 52, 0.08))'
                  }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. FIND US & STUDIO SHOWCASE */}
      <section style={{
        position: 'relative',
        width: '100%',
        background: '#fcf6f3',
        backgroundImage: `url(${findUsBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3.75rem 1.5rem',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Top-Right Nail Polish & Brush Motif */}
        <img
          src={motifTop}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            maxWidth: '22%',
            pointerEvents: 'none',
            zIndex: 1,
            userSelect: 'none'
          }}
        />

        {/* Bottom-Left Nail Polish Bottle Motif */}
        <img
          src={motifBottom}
          alt=""
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '180px',
            maxWidth: '20%',
            pointerEvents: 'none',
            zIndex: 1,
            userSelect: 'none'
          }}
        />

        {/* Content above motifs */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto' }}>
          <span className="brand-line" style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem' }}>Visit Our Studio & Showcase</span>
          <h2 className="font-heading" style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Find Us
          </h2>
          
          {/* Location Block */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            fontSize: '1.08rem',
            color: 'var(--text-primary)',
            marginBottom: '1.85rem',
            flexWrap: 'wrap'
          }}>
            <MapPin size={22} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
            <strong>X-ON — 3168 Bill Beck Blvd, Kissimmee, FL 34744.</strong>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact-us" className="btn btn-primary" style={{ padding: '0.7rem 1.6rem' }}>
              Contact Our Studio
            </Link>
            <Link to="/wholesale-signup" className="btn btn-outline" style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '0.7rem 1.6rem' }}>
              Wholesale Registration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
