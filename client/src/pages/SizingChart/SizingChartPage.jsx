import React, { useState, useEffect } from 'react';
import { Sparkles, Ruler, Check, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SizingChartPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('size'); // size | shapes | lengths

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
    { size: 'XS', thumb: '14mm', index: '10mm', middle: '11mm', ring: '10mm', pinky: '7mm' },
    { size: 'S', thumb: '15mm', index: '11mm', middle: '12mm', ring: '11mm', pinky: '8mm' },
    { size: 'M', thumb: '16mm', index: '12mm', middle: '13mm', ring: '12mm', pinky: '9mm' },
    { size: 'L', thumb: '18mm', index: '13mm', middle: '14mm', ring: '13mm', pinky: '10mm' },
    { size: 'Custom', thumb: 'Your custom mm', index: 'Your custom mm', middle: 'Your custom mm', ring: 'Your custom mm', pinky: 'Your custom mm' }
  ];

  const lengthDetails = content?.length_details || [
    { name: 'Short', length: '14mm - 16mm', recommendation: 'Everyday typing, active lifestyle & effortless natural look.' },
    { name: 'Medium', length: '18mm - 22mm', recommendation: 'Our most popular balance of elegant length and practical day-to-day comfort.' },
    { name: 'Long', length: '24mm - 28mm', recommendation: 'Dramatic, statement-making length for glamour events & photoshoots.' },
    { name: 'Extra Long', length: '30mm+', recommendation: 'High-fashion editorial couture finish.' }
  ];

  const shapes = [
    { name: 'Almond', desc: 'Tapered sides rounding softly to a peak. Universally flattering and elongating for all finger shapes.' },
    { name: 'Coffin', desc: 'Tapered inwards with a sharp, straight horizontal square tip for dramatic modern luxury.' },
    { name: 'Oval', desc: 'Curved gently along the natural cuticle arch. Classic, understated, and durable.' },
    { name: 'Round', desc: 'Soft circular contours ideal for shorter active nail lengths with zero corner snagging.' },
    { name: 'Square', desc: 'Crisp 90-degree parallel sidewalls with straight edges. Clean, modern, and striking.' },
    { name: 'Stiletto', desc: 'Ultra-dramatic sculpted razor point. Statement-making runway couture.' }
  ];

  return (
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Header Hero */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Ruler size={16} /> Fit & Measurement Guide
          </span>
          <h1 className="section-title">Sizing Chart & Fit Guide</h1>
          <p className="section-subtitle">
            {content?.intro_body || 'Achieving a bespoke salon fit with X-ON press-on nails starts with precise measurement. Use our standard sizing mapping below or order a custom sizing set tailored to your exact natural nail beds.'}
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('size')}
            className={`btn ${activeTab === 'size' ? 'btn-primary' : 'btn-secondary'}`}
          >
            1. Size Mapping Table
          </button>
          <button
            onClick={() => setActiveTab('shapes')}
            className={`btn ${activeTab === 'shapes' ? 'btn-primary' : 'btn-secondary'}`}
          >
            2. Nail Shapes Guide
          </button>
          <button
            onClick={() => setActiveTab('lengths')}
            className={`btn ${activeTab === 'lengths' ? 'btn-primary' : 'btn-secondary'}`}
          >
            3. Length Details
          </button>
        </div>

        {/* Tab 1: Size Mapping Table */}
        {activeTab === 'size' && (
          <div>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '3rem'
            }}>
              <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 className="font-heading" style={{ color: '#fff', fontSize: '1.25rem' }}>
                  Standard Nail Width Measurements (Millimeters)
                </h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '1.25rem 1.5rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Size</th>
                      <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Thumb</th>
                      <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Index</th>
                      <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Middle</th>
                      <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Ring</th>
                      <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Pinky</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizes.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>
                          <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>{row.size}</span>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)' }}>{row.thumb}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)' }}>{row.index}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)' }}>{row.middle}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)' }}>{row.ring}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)' }}>{row.pinky}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to measure instruction cards */}
            <div className="grid-3">
              <div className="glass-card" style={{ padding: '2rem' }}>
                <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Step 1</span>
                <h4 className="font-heading" style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Apply Clear Tape
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Place a piece of clear adhesive tape horizontally across the widest point of your natural bare nail bed.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '2rem' }}>
                <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Step 2</span>
                <h4 className="font-heading" style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Mark the Sidewalls
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Using a fine-tip pen, mark lines directly on the tape where your nail bed meets your skin sidewalls on both edges.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '2rem' }}>
                <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Step 3</span>
                <h4 className="font-heading" style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Measure in Millimeters
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Remove tape and measure the distance between marks against a millimeter ruler. Match with XS, S, M, L or note your custom sizing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Nail Shapes Guide */}
        {activeTab === 'shapes' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h3 className="font-heading" style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                {content?.shapes_heading || 'Nail Shapes & Length Guide'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
                {content?.shapes_description || 'We craft our press-on nails across 6 signature silhouettes, each engineered with reinforced apex curves for natural durability.'}
              </p>
            </div>

            <div className="grid-3">
              {shapes.map(shape => (
                <div key={shape.name} className="glass-card" style={{ padding: '2rem' }}>
                  <h4 className="font-heading" style={{ color: 'var(--accent-gold-light)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                    {shape.name}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {shape.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Length Details */}
        {activeTab === 'lengths' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h3 className="font-heading" style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                Length & Lifestyle Recommendations
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Select the length that best complements your daily routine and aesthetic preference.
              </p>
            </div>

            <div className="grid-2">
              {lengthDetails.map((len, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 className="font-heading" style={{ color: '#fff', fontSize: '1.3rem' }}>{len.name}</h4>
                      <span className="badge badge-gold">{len.length}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
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
  );
}
