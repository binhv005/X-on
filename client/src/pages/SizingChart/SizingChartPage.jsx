import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Ruler,
  Check,
  HelpCircle,
  Eye,
  Layers,
  Sliders,
  ArrowRight,
  Heart,
  ShoppingBag,
  Info,
  Calculator,
  Compass
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Direct Image Asset Imports for 100% Vite build & runtime resolution
import topShowcaseBanner from '../../assets/images/ChatGPT-Image-18_51_04-20-thg-7-2026.png';
import nailShapesBannerImg from '../../assets/images/8ba0b55c-fdc6-441d-9c9e-4af35d3fab65.png';
import customNailBarGuideImg from '../../assets/images/0a9ef85d-1399-40c6-927c-a9a7b5858f6d.png';

export default function SizingChartPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sizing'); // 'sizing' | 'shapes' | 'length'

  // Interactive Size Matcher state
  const [calcThumb, setCalcThumb] = useState('');
  const [calcIndex, setCalcIndex] = useState('');
  const [calcMiddle, setCalcMiddle] = useState('');
  const [calcRing, setCalcRing] = useState('');
  const [calcPinky, setCalcPinky] = useState('');
  const [matchedSize, setMatchedSize] = useState(null);

  useEffect(() => {
    async function loadSizingData() {
      try {
        setLoading(true);
        const res = await api.getPageContent('sizing');
        if (res.success && res.data) {
          setContent(res.data);
        }
      } catch (err) {
        console.error('Error fetching sizing chart content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSizingData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading sizing chart & measurement guide..." />;
  }

  const sizes = content?.sizes || [
    { size: 'XS', thumb: '14mm', index: '10mm', middle: '11mm', ring: '10mm', pinky: '7mm', popular: false },
    { size: 'S', thumb: '15mm', index: '11mm', middle: '12mm', ring: '11mm', pinky: '8mm', popular: true },
    { size: 'M', thumb: '16mm', index: '12mm', middle: '13mm', ring: '12mm', pinky: '9mm', popular: true },
    { size: 'L', thumb: '18mm', index: '13mm', middle: '14mm', ring: '13mm', pinky: '10mm', popular: false },
    { size: 'Custom', thumb: 'Custom mm', index: 'Custom mm', middle: 'Custom mm', ring: 'Custom mm', pinky: 'Custom mm', popular: false }
  ];

  const lengthDetails = content?.length_details || [
    {
      name: 'Short',
      length: '14mm - 16mm',
      tag: 'Everyday Active',
      recommendation: 'Perfect for typing, daily tasks, healthcare professionals, and a natural polished look with zero snagging.'
    },
    {
      name: 'Medium',
      length: '18mm - 22mm',
      tag: 'Most Popular',
      recommendation: 'Our signature versatile length. Strikes the ideal balance of elongated finger elegance and practical comfort.'
    },
    {
      name: 'Long',
      length: '24mm - 28mm',
      tag: 'Glamour & Events',
      recommendation: 'Dramatic, statement-making silhouette designed for photoshoots, galas, weekend escapes, and luxury evening wear.'
    },
    {
      name: 'Extra Long',
      length: '30mm+',
      tag: 'Runway Editorial',
      recommendation: 'Ultra-luxurious high-fashion couture finish engineered with reinforced apex structure for head-turning presence.'
    }
  ];

  const shapes = [
    {
      name: 'Almond',
      tag: 'Universal Flattery',
      desc: 'Tapered sides curving softly to a delicate rounded peak. Universally slimming and naturally elongating for all hands.'
    },
    {
      name: 'Coffin',
      tag: 'Modern Trend',
      desc: 'Tapered gracefully inward with a crisp, straight horizontal square tip for a bold, luxurious silhouette.'
    },
    {
      name: 'Oval',
      tag: 'Timeless Classic',
      desc: 'Gently curved along the natural cuticle arch. Understated, highly durable, and effortless for everyday luxury.'
    },
    {
      name: 'Square',
      tag: 'Clean & Structured',
      desc: 'Crisp 90-degree parallel sidewalls with straight edges. Clean, razor-modern, and architectural.'
    },
    {
      name: 'Stiletto',
      tag: 'Couture Statement',
      desc: 'Sculpted to a dramatic razor point. The ultimate runway statement for bold, high-fashion styling.'
    },
    {
      name: 'Round',
      tag: 'Effortless Wear',
      desc: 'Soft circular contours ideal for shorter natural nail beds with maximum durability and comfort.'
    }
  ];

  const sectionTabs = [
    { id: 'sizing', label: '1. Sizing Table & Measurement', icon: Ruler },
    { id: 'shapes', label: '2. Signature Shapes', icon: Sparkles },
    { id: 'length', label: '3. Length & Lifestyle Guide', icon: Sliders }
  ];

  const handleQuickMatch = (e) => {
    e.preventDefault();
    const t = parseFloat(calcThumb) || 0;
    if (t >= 17) setMatchedSize('L (Large) — or Custom Sizing');
    else if (t >= 15.5) setMatchedSize('M (Medium) — Most Popular');
    else if (t >= 14.5) setMatchedSize('S (Small)');
    else if (t > 0) setMatchedSize('XS (Extra Small)');
    else setMatchedSize('Please enter at least your thumb width');
  };

  return (
    <div style={{ background: 'var(--bg-primary, #fcfbf9)', minHeight: '85vh', color: 'var(--text-primary, #1c1c21)' }}>
      {/* 1. Full-width Hero Header Banner with Image Background & Dark Overlay */}
      <section style={{
        position: 'relative',
        padding: '6.5rem 1.5rem 5.5rem 1.5rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Showcase Image */}
        <img
          src={topShowcaseBanner}
          alt="X-ON Nail Sizing & Shape Showcase"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/images/ChatGPT-Image-18_51_04-20-thg-7-2026.png';
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 38%',
            zIndex: 1
          }}
        />

        {/* Soft Overlay — giống Bundle and Save, không đen gắt */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(15, 15, 18, 0.42) 0%, rgba(15, 15, 18, 0.72) 100%)',
          zIndex: 2
        }} />

        {/* Hero Content Over Image */}
        <div className="container" style={{ maxWidth: '850px', position: 'relative', zIndex: 3 }}>
          <h1 className="font-heading" style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
          }}>
            Sizing Chart & Fit Guide
          </h1>

          <p style={{
            color: '#e5e7eb',
            fontSize: '1.1rem',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.65,
            textWrap: 'balance',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)'
          }}>
            {content?.intro_body || 'Measure once for a bespoke salon fit — use XS–L presets or custom mm sizing below.'}
          </p>
        </div>
      </section>

      <div className="section-py" style={{ paddingTop: '3.5rem', paddingBottom: '2.5rem' }}>
        <div className="container">
          {/* Navigation Tab Switcher */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '3.5rem',
            padding: '0 1rem'
          }}>
            <div style={{
              display: 'inline-flex',
              background: '#f3ece3',
              padding: '0.4rem',
              borderRadius: '999px',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              gap: '0.35rem',
              maxWidth: '100%',
              overflowX: 'auto',
              boxShadow: '0 4px 14px rgba(67, 76, 52, 0.06)'
            }}>
              {sectionTabs.map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.75rem 1.6rem',
                      borderRadius: '999px',
                      border: 'none',
                      background: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? 'var(--text-primary, #1c1c21)' : 'var(--text-secondary, #525260)',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.25s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <IconComponent size={17} color={isActive ? 'var(--accent-gold-dark, #8c6716)' : 'var(--text-muted)'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: SIZING & MEASUREMENT */}
          {activeTab === 'sizing' && (
            <div>
              {/* 1. Full-Width Sizing Table */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-gold)',
                maxWidth: '1000px',
                margin: '0 auto 3.5rem auto'
              }}>
                <div style={{
                  padding: '1.75rem 2.25rem',
                  background: 'linear-gradient(135deg, #fdfaf6 0%, #f7f1e7 100%)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.45rem', margin: '0 0 0.35rem 0' }}>
                      Standard Width Measurements
                    </h3>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Precise millimeter (mm) dimensions measured at the widest point of each natural nail bed
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-gold-dark, #8c6716)' }}>
                    Thumb → Pinky
                  </span>
                </div>

                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.02)' }}>
                        <th style={{ padding: '1.15rem 1.5rem', color: 'var(--accent-gold-dark)', textTransform: 'uppercase', fontSize: '0.85rem', width: '18%' }}>Preset</th>
                        <th style={{ padding: '1.15rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', width: '16.4%' }}>Thumb</th>
                        <th style={{ padding: '1.15rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', width: '16.4%' }}>Index</th>
                        <th style={{ padding: '1.15rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', width: '16.4%' }}>Middle</th>
                        <th style={{ padding: '1.15rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', width: '16.4%' }}>Ring</th>
                        <th style={{ padding: '1.15rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', width: '16.4%' }}>Pinky</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizes.map((row, idx) => (
                        <tr key={idx} style={{
                          borderBottom: idx === sizes.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                          background: row.popular ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                          transition: 'background 0.2s ease'
                        }}>
                          <td style={{ padding: '1.15rem 1.5rem', fontWeight: 800 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold-dark, #8c6716)' }}>
                                {row.size}
                              </span>
                              {row.popular && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold-dark)', fontWeight: 600 }}>
                                  Popular
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '1.15rem 1.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.98rem' }}>{row.thumb}</td>
                          <td style={{ padding: '1.15rem 1.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.98rem' }}>{row.index}</td>
                          <td style={{ padding: '1.15rem 1.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.98rem' }}>{row.middle}</td>
                          <td style={{ padding: '1.15rem 1.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.98rem' }}>{row.ring}</td>
                          <td style={{ padding: '1.15rem 1.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.98rem' }}>{row.pinky}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Official Visual Infographic Guide (Clean, Full Image Without Cropping or Container Background) */}
              <div style={{
                maxWidth: '860px',
                margin: '0 auto 4rem auto',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  color: 'var(--accent-gold-dark)',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}>
                  <Eye size={20} /> Official X-ON Visual Sizing Chart
                </div>
                <img
                  src={customNailBarGuideImg}
                  alt="X-ON Custom Nail Bar Sizing & Measurement Guide"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/0a9ef85d-1399-40c6-927c-a9a7b5858f6d.png';
                  }}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    display: 'block',
                    margin: '0 auto',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                  }}
                />
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
                  Visual reference for measuring widest point across natural nail curvature (#0 through #9).
                </p>
              </div>

              {/* Dedicated Standalone Quick Sizing Matcher Section */}
              <div style={{
                background: 'linear-gradient(135deg, #faf6f0 0%, #f5efe6 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: '20px',
                padding: '2.5rem 2.5rem',
                marginBottom: '4rem',
                boxShadow: 'var(--shadow-gold)',
                maxWidth: '920px',
                margin: '0 auto 4rem auto'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calculator size={22} color="var(--accent-gold-dark)" />
                  </div>
                  <div>
                    <h3 className="font-heading" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>
                      Quick Size Matcher
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Enter your thumb width in millimeters (mm) to instantly check your closest X-ON standard preset size or determine if custom sizing is recommended:
                </p>

                <form onSubmit={handleQuickMatch} style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  {/* Full width input and submit button row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: '0.75rem',
                    width: '100%'
                  }}>
                    <input
                      type="number"
                      step="0.5"
                      min="6"
                      max="25"
                      placeholder="e.g. 15 mm"
                      value={calcThumb}
                      onChange={(e) => setCalcThumb(e.target.value)}
                      className="form-input"
                      style={{
                        flex: 1,
                        width: '100%',
                        background: '#ffffff',
                        fontSize: '1.05rem',
                        padding: '0.8rem 1.25rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-gold)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        padding: '0.8rem 2rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Check Match
                    </button>
                  </div>
                  
                  {/* Quick Select Preset Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginRight: '0.2rem' }}>Quick test:</span>
                    {['13', '14', '15', '16', '17', '18'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setCalcThumb(val);
                          const t = parseFloat(val);
                          if (t >= 17) setMatchedSize('L (Large) — or Custom Sizing');
                          else if (t >= 15.5) setMatchedSize('M (Medium) — Most Popular');
                          else if (t >= 14.5) setMatchedSize('S (Small)');
                          else if (t > 0) setMatchedSize('XS (Extra Small)');
                        }}
                        style={{
                          background: calcThumb === val ? 'var(--accent-gold)' : '#ffffff',
                          color: calcThumb === val ? '#ffffff' : 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                        }}
                      >
                        {val}mm
                      </button>
                    ))}
                  </div>
                </form>

                {matchedSize && (
                  <div style={{
                    marginTop: '1.25rem',
                    padding: '1.15rem 1.5rem',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>🎯</span>
                      <div>
                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block' }}>
                          Recommended Size
                        </span>
                        <strong style={{ color: 'var(--accent-gold-dark)', fontSize: '1.15rem' }}>
                          {matchedSize}
                        </strong>
                      </div>
                    </div>
                    <Link to="/shop" className="btn btn-outline btn-sm" style={{ padding: '0.5rem 1.15rem' }}>
                      Shop This Size <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </Link>
                  </div>
                )}
              </div>

              {/* 3-Step Tape Measurement Walkthrough */}
              <div style={{ marginBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} /> Easy 3-Step Process
                  </span>
                  <h2 className="section-title">How To Measure Your Natural Nails</h2>
                  <p className="section-subtitle">You only need a roll of clear tape, a fine pen, and a millimeter ruler.</p>
                </div>

                <div className="grid-3">
                  <div className="glass-card" style={{ padding: '2.25rem 2rem', position: 'relative', borderRadius: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--accent-gold)',
                      color: '#ffffff',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      marginBottom: '1.25rem',
                      boxShadow: '0 4px 10px rgba(212, 175, 55, 0.4)'
                    }}>
                      1
                    </div>
                    <h4 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.65rem' }}>
                      Apply Clear Tape
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                      Press a piece of clear adhesive tape horizontally across the widest point of your natural bare nail bed, pressing firmly into the sidewalls.
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '2.25rem 2rem', position: 'relative', borderRadius: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--accent-gold)',
                      color: '#ffffff',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      marginBottom: '1.25rem',
                      boxShadow: '0 4px 10px rgba(212, 175, 55, 0.4)'
                    }}>
                      2
                    </div>
                    <h4 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.65rem' }}>
                      Mark The Sidewalls
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                      Using a fine-tip pen, draw a vertical line on both outer edges where your nail plate meets your natural skin groove.
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '2.25rem 2rem', position: 'relative', borderRadius: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--accent-gold)',
                      color: '#ffffff',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      marginBottom: '1.25rem',
                      boxShadow: '0 4px 10px rgba(212, 175, 55, 0.4)'
                    }}>
                      3
                    </div>
                    <h4 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.65rem' }}>
                      Measure In Millimeters
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                      Peel off the tape and measure the distance between the two pen lines against a millimeter ruler. Repeat for all 5 fingers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIGNATURE NAIL SHAPES */}
          {activeTab === 'shapes' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} /> Artisan Silhouettes
                </span>
                <h2 className="section-title">{content?.shapes_heading || 'Signature Nail Shapes & Apex Anatomy'}</h2>
                <p className="section-subtitle">
                  {content?.shapes_description || 'We hand-sculpt our bespoke press-on nails across 6 signature silhouettes, each structured with reinforced apex curves for long-lasting durability.'}
                </p>
              </div>

              {/* Shapes Visual Infographic Banner */}
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#faf7f2',
                border: '1px solid var(--border-gold)',
                marginBottom: '3.5rem',
                boxShadow: 'var(--shadow-gold)'
              }}>
                <img
                  src={nailShapesBannerImg}
                  alt="X-ON Sizing Chart Nail Shapes & Length"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/8ba0b55c-fdc6-441d-9c9e-4af35d3fab65.png';
                  }}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>

              {/* Shape Feature Cards Grid */}
              <div className="grid-3">
                {shapes.map(shape => (
                  <div key={shape.name} className="glass-card" style={{ padding: '2.25rem 2rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 className="font-heading" style={{ color: 'var(--accent-gold-dark)', fontSize: '1.35rem', margin: 0 }}>
                        {shape.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-gold-dark, #8c6716)' }}>{shape.tag}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
                      {shape.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LENGTH DETAILS */}
          {activeTab === 'length' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sliders size={14} /> Lifestyle & Practicality
                </span>
                <h2 className="section-title">Length Recommendations</h2>
                <p className="section-subtitle">
                  Select the length that best complements your daily routine, keyboard typing habits, and personal aesthetic.
                </p>
              </div>

              <div className="grid-2">
                {lengthDetails.map((len, idx) => (
                  <div key={idx} className="glass-card" style={{
                    padding: '2.5rem 2rem',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.4rem', margin: 0 }}>
                          {len.name}
                        </h4>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold-dark, #8c6716)' }}>{len.length}</span>
                      </div>
                      <span style={{ display: 'inline-block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                        {len.tag}
                      </span>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                        {len.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-width Studio Support Section — đồng bộ tone ấm sang trọng với Quick Size Matcher */}
      <section style={{
        width: '100%',
        background: 'linear-gradient(135deg, #faf6f0 0%, #f5efe6 100%)',
        borderTop: '1px solid var(--border-gold, rgba(179, 135, 40, 0.3))',
        borderBottom: '1px solid var(--border-gold, rgba(179, 135, 40, 0.3))',
        padding: '3.2rem 1.5rem 2.6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative glow for soft luxury feel */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '740px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--accent-gold-dark, #8c6716)',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '0.45rem'
          }}>
            <Sparkles size={13} color="var(--accent-gold-dark, #8c6716)" /> Still Unsure About Your Fit?
          </span>

          <h3 className="font-heading" style={{
            fontSize: 'clamp(1.75rem, 3.2vw, 2.2rem)',
            color: 'var(--text-primary, #1c1c21)',
            marginBottom: '0.7rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.25
          }}>
            We Handcraft 100% Custom Sizing
          </h3>

          <p style={{
            color: 'var(--text-secondary, #525260)',
            maxWidth: '620px',
            margin: '0 auto 1.6rem auto',
            fontSize: '0.96rem',
            lineHeight: 1.68
          }}>
            If your measurements fall between standard presets, simply select <strong style={{ color: 'var(--text-primary, #1c1c21)' }}>"Custom"</strong> at checkout and note your thumb-to-pinky millimeter dimensions. Our Kissimmee artisan team will craft your bespoke set to perfection.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/shop"
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #cfa83b 0%, #b38728 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 14px rgba(179, 135, 40, 0.28)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.25s ease'
              }}
            >
              Shop All Nails <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact-us"
              className="btn"
              style={{
                background: '#ffffff',
                color: 'var(--accent-gold-dark, #8c6716)',
                border: '1.5px solid var(--border-gold, rgba(179, 135, 40, 0.45))',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.25s ease'
              }}
            >
              Contact Sizing Support
            </Link>
          </div>
        </div>
      </section>

      {/* Khoảng nền màu trắng bên dưới tạo khoảng cách với footer */}
      <div style={{
        width: '100%',
        height: '3.5rem',
        background: '#ffffff'
      }} />
    </div>
  );
}
