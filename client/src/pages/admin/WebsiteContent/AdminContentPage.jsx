import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Upload,
  UploadCloud,
  X,
  Link2,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../../../services/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';

function ImageUploadField({ label, value, onChange, placeholder = 'https://...', helpText }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, JPEG, WEBP).', 'error');
      return;
    }

    try {
      setUploading(true);
      try {
        const res = await api.uploadImage(file);
        if (res.success && res.url) {
          onChange(res.url);
          addToast('Image uploaded successfully from device!', 'success');
          return;
        }
      } catch (uploadErr) {
        console.warn('Server upload fallback to base64 DataURL:', uploadErr);
      }

      // Fallback to base64 DataURL
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target.result);
        addToast('Image loaded from device successfully!', 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      addToast('Failed to read image file.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: 0
            }}
          >
            <X size={13} /> Remove Image
          </button>
        )}
      </label>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: value ? '140px 1fr' : '1fr', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Image Preview Box */}
        {value && (
          <div style={{
            position: 'relative',
            width: '140px',
            height: '110px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1.5px solid var(--border-medium)',
            background: 'var(--bg-secondary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <img
              src={value}
              alt="Preview"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/images/IMG_7098.JPG';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#fff',
                border: 'none',
                padding: '4px 0',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                backdropFilter: 'blur(2px)'
              }}
            >
              Change
            </button>
          </div>
        )}

        {/* Input & Upload Button Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  paddingLeft: '2.2rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-surface)',
                  fontSize: '0.85rem'
                }}
              />
              <Link2 size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn btn-secondary"
              style={{
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              <UploadCloud size={16} />
              {uploading ? 'Uploading...' : 'Choose from Device'}
            </button>
          </div>

          {helpText && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helpText}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('home'); // home | about | bundle | sizing | contact | legal
  const [allContents, setAllContents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeForm, setActiveForm] = useState({});

  const loadAllContents = async () => {
    try {
      setLoading(true);
      const res = await api.getAllPageContents();
      if (res.success && res.data) {
        setAllContents(res.data);
        setActiveForm(res.data[activeTab] || {});
      }
    } catch (err) {
      addToast('Failed to load page contents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllContents();
  }, []);

  useEffect(() => {
    if (allContents && allContents[activeTab]) {
      setActiveForm(allContents[activeTab]);
    }
  }, [activeTab, allContents]);

  const handleFieldChange = (key, value) => {
    setActiveForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updatePageContent(activeTab, activeForm);
      if (res.success) {
        addToast(`Content for "${activeTab.toUpperCase()}" published successfully!`, 'success');
        setAllContents(prev => ({
          ...prev,
          [activeTab]: res.data
        }));
      }
    } catch (err) {
      addToast(err.message || 'Failed to save content', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading CMS content templates..." />;
  }

  const tabs = [
    { key: 'home', label: 'Home Page' },
    { key: 'about', label: 'About Page' },
    { key: 'bundle', label: 'Bundle & Save' },
    { key: 'sizing', label: 'Sizing & Guide' },
    { key: 'contact', label: 'Contact Us' },
    { key: 'legal', label: 'Legal & Terms' }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="brand-line">Dynamic CMS Management</span>
        <h1 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0.25rem 0' }}>
          Website Content Editor
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Modify headings, descriptions, banner CTAs, images, and contact information dynamically without touching source code.
        </p>
      </div>

      {/* Main CMS Container */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        {/* Page Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          overflowX: 'auto'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '1rem 1.75rem',
                background: activeTab === tab.key ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid var(--accent-gold)' : '2px solid transparent',
                color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Form */}
        <form onSubmit={handleSave} style={{ padding: '2.5rem' }}>
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Hero Brand Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.hero_heading || ''}
                  onChange={e => handleFieldChange('hero_heading', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Brand Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.hero_tagline || ''}
                  onChange={e => handleFieldChange('hero_tagline', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Description</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={activeForm.hero_description || ''}
                  onChange={e => handleFieldChange('hero_description', e.target.value)}
                ></textarea>
              </div>

              {/* Hero Image Uploader */}
              <ImageUploadField
                label="Hero Background Image"
                value={activeForm.hero_image || ''}
                onChange={val => handleFieldChange('hero_image', val)}
                placeholder="https://images.unsplash.com/... or upload from device"
                helpText="Recommended: 1920x1080px JPG or WEBP high-resolution banner."
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Studio Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={activeForm.find_us_address || ''}
                    onChange={e => handleFieldChange('find_us_address', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Studio Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={activeForm.find_us_phone || ''}
                    onChange={e => handleFieldChange('find_us_phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Page Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.page_title || ''}
                  onChange={e => handleFieldChange('page_title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand Line</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.brand_line || ''}
                  onChange={e => handleFieldChange('brand_line', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.tagline || ''}
                  onChange={e => handleFieldChange('tagline', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Brand Story Narrative</label>
                <textarea
                  rows="6"
                  className="form-textarea"
                  value={activeForm.brand_description || ''}
                  onChange={e => handleFieldChange('brand_description', e.target.value)}
                ></textarea>
              </div>

              {/* Studio Showcase Image Uploader */}
              <ImageUploadField
                label="Studio Showcase & Atelier Image"
                value={activeForm.image || ''}
                onChange={val => handleFieldChange('image', val)}
                placeholder="https://images.unsplash.com/... or upload from device"
                helpText="Featured atelier or founder portrait photo."
              />
            </div>
          )}

          {activeTab === 'bundle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.heading || ''}
                  onChange={e => handleFieldChange('heading', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subheading</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  value={activeForm.subheading || ''}
                  onChange={e => handleFieldChange('subheading', e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Banner Highlight Discount Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.banner_discount || ''}
                  onChange={e => handleFieldChange('banner_discount', e.target.value)}
                />
              </div>

              {/* Bundle Hero Image Uploader */}
              <ImageUploadField
                label="Bundle & Save Banner Feature Image"
                value={activeForm.banner_image || activeForm.image || ''}
                onChange={val => {
                  handleFieldChange('banner_image', val);
                  handleFieldChange('image', val);
                }}
                placeholder="https://images.unsplash.com/... or upload from device"
                helpText="Image showcased on the Bundle & Save collection banner."
              />
            </div>
          )}

          {activeTab === 'sizing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Intro Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.intro_heading || ''}
                  onChange={e => handleFieldChange('intro_heading', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Intro Body</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={activeForm.intro_body || ''}
                  onChange={e => handleFieldChange('intro_body', e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Shapes Guide Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.shapes_heading || ''}
                  onChange={e => handleFieldChange('shapes_heading', e.target.value)}
                />
              </div>

              {/* Sizing Guide Image Uploader */}
              <ImageUploadField
                label="Sizing Chart & Measuring Diagram Image"
                value={activeForm.sizing_image || activeForm.image || ''}
                onChange={val => {
                  handleFieldChange('sizing_image', val);
                  handleFieldChange('image', val);
                }}
                placeholder="https://images.unsplash.com/... or upload from device"
                helpText="Visual sizing chart and diagram for nail measurements."
              />
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Brand Headline</label>
                <input
                  type="text"
                  className="form-input"
                  value={activeForm.brand_headline || ''}
                  onChange={e => handleFieldChange('brand_headline', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={activeForm.address || ''}
                    onChange={e => handleFieldChange('address', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={activeForm.phone || ''}
                    onChange={e => handleFieldChange('phone', e.target.value)}
                  />
                </div>
              </div>

              {/* Contact Page Image Uploader */}
              <ImageUploadField
                label="Contact & Salon Location Image"
                value={activeForm.image || ''}
                onChange={val => handleFieldChange('image', val)}
                placeholder="https://images.unsplash.com/... or upload from device"
                helpText="Studio storefront or customer support atelier picture."
              />
            </div>
          )}

          {activeTab === 'legal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Terms of Service Content (Markdown)</label>
                <textarea
                  rows="6"
                  className="form-textarea"
                  value={activeForm.terms?.body || ''}
                  onChange={e => handleFieldChange('terms', { ...activeForm.terms, body: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Privacy Policy Content (Markdown)</label>
                <textarea
                  rows="6"
                  className="form-textarea"
                  value={activeForm.privacy?.body || ''}
                  onChange={e => handleFieldChange('privacy', { ...activeForm.privacy, body: e.target.value })}
                ></textarea>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={saving}
            >
              {saving ? 'Publishing Content...' : (
                <>
                  <Save size={18} /> Save & Publish Live
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
