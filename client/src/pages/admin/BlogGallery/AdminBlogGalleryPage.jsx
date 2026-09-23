import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  FileText,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  X,
  Link2
} from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
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
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
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
            <X size={13} /> Remove
          </button>
        )}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: value ? '120px 1fr' : '1fr', gap: '1rem', alignItems: 'flex-start' }}>
        {value && (
          <div style={{
            position: 'relative',
            width: '120px',
            height: '95px',
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

export default function AdminBlogGalleryPage() {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'blog'); // blog | gallery | coming_soon
  const [blogPosts, setBlogPosts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer form states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('blog'); // blog | gallery | coming_soon
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete Confirm State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('blog');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form Fields
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    cover: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
    publish_date: new Date().toISOString().split('T')[0],
    author: 'X-ON Team',
    excerpt: '',
    content_text: '',
    status: 'published'
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    collection: 'Now Selling',
    media: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    linked_product: '',
    size_labels: 'S, M, L',
    status: 'published',
    sort_order: 1
  });

  const [comingSoonForm, setComingSoonForm] = useState({
    title: '',
    collection_name: 'Upcoming / Seasonal Collection 01',
    subtitle: '',
    media: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1000&q=80',
    status: 'active',
    display_order: 1,
    expected_launch: 'Winter 2026'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [blogsRes, galleryRes, comingSoonRes] = await Promise.all([
        api.getBlogPosts({ all: 'true' }),
        api.getGalleryItems({ all: 'true' }),
        api.getComingSoonCollections()
      ]);

      if (blogsRes.success) setBlogPosts(blogsRes.data);
      if (galleryRes.success) setGalleryItems(galleryRes.data);
      if (comingSoonRes.success) setComingSoon(comingSoonRes.data);
    } catch (err) {
      addToast('Failed to load blog and gallery datasets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const action = searchParams.get('action');
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
    if (action === 'add') {
      openAdd(tab || 'blog');
    }
  }, [searchParams]);

  const openAdd = (type) => {
    setDrawerMode(type);
    setEditingItem(null);
    if (type === 'blog') {
      setBlogForm({
        title: '',
        slug: '',
        cover: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
        publish_date: new Date().toISOString().split('T')[0],
        author: 'X-ON Master Artist',
        excerpt: '',
        content_text: '',
        status: 'published'
      });
    } else if (type === 'gallery') {
      setGalleryForm({
        title: '',
        collection: 'Now Selling',
        media: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        linked_product: '',
        size_labels: 'S, M, L',
        status: 'published',
        sort_order: (galleryItems.length + 1)
      });
    } else if (type === 'coming_soon') {
      setComingSoonForm({
        title: '',
        collection_name: `Upcoming / Seasonal Collection 0${comingSoon.length + 1}`,
        subtitle: '',
        media: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1000&q=80',
        status: 'active',
        display_order: comingSoon.length + 1,
        expected_launch: 'Coming Soon'
      });
    }
    setIsDrawerOpen(true);
  };

  const openEdit = (type, item) => {
    setDrawerMode(type);
    setEditingItem(item);
    if (type === 'blog') {
      const textContent = item.content_blocks?.map(b => b.text).filter(Boolean).join('\n\n') || item.excerpt || '';
      setBlogForm({
        title: item.title || '',
        slug: item.slug || '',
        cover: item.cover || '',
        publish_date: item.publish_date || '',
        author: item.author || 'X-ON Team',
        excerpt: item.excerpt || '',
        content_text: textContent,
        status: item.status || 'published'
      });
    } else if (type === 'gallery') {
      setGalleryForm({
        title: item.title || '',
        collection: item.collection || 'Now Selling',
        media: item.media || '',
        linked_product: item.linked_product || '',
        size_labels: Array.isArray(item.size_labels) ? item.size_labels.join(', ') : 'S, M, L',
        status: item.status || 'published',
        sort_order: item.sort_order || 1
      });
    } else if (type === 'coming_soon') {
      setComingSoonForm({
        title: item.title || '',
        collection_name: item.collection_name || '',
        subtitle: item.subtitle || '',
        media: item.media || '',
        status: item.status || 'active',
        display_order: item.display_order || 1,
        expected_launch: item.expected_launch || ''
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);

      if (drawerMode === 'blog') {
        const payload = {
          ...blogForm,
          content_blocks: [
            { type: 'paragraph', text: blogForm.content_text || blogForm.excerpt }
          ]
        };
        if (editingItem) {
          await api.updateBlogPost(editingItem.id, payload);
          addToast('Blog post updated!', 'success');
        } else {
          await api.createBlogPost(payload);
          addToast('Blog post created!', 'success');
        }
      } else if (drawerMode === 'gallery') {
        const payload = {
          ...galleryForm,
          size_labels: galleryForm.size_labels.split(',').map(s => s.trim()).filter(Boolean)
        };
        if (editingItem) {
          await api.updateGalleryItem(editingItem.id, payload);
          addToast('Gallery item updated!', 'success');
        } else {
          await api.createGalleryItem(payload);
          addToast('Gallery item created!', 'success');
        }
      } else if (drawerMode === 'coming_soon') {
        if (editingItem) {
          await api.updateComingSoonCollection(editingItem.id, comingSoonForm);
          addToast('Coming soon collection updated!', 'success');
        } else {
          await api.createComingSoonCollection(comingSoonForm);
          addToast('Coming soon collection created!', 'success');
        }
      }

      setIsDrawerOpen(false);
      loadData();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const promptDelete = (type, item) => {
    setDeleteType(type);
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleteLoading(true);
      if (deleteType === 'blog') {
        await api.deleteBlogPost(itemToDelete.id);
      } else if (deleteType === 'gallery') {
        await api.deleteGalleryItem(itemToDelete.id);
      } else if (deleteType === 'coming_soon') {
        await api.deleteComingSoonCollection(itemToDelete.id);
      }
      addToast('Record deleted successfully.', 'success');
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to delete record', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading media datasets..." />;
  }

  return (
    <div>
      {/* Header & Add Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="brand-line">Media & Visual Content</span>
          <h1 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            Blog & Gallery Management
          </h1>
        </div>

        <button
          onClick={() => openAdd(activeTab)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Add {activeTab === 'blog' ? 'Blog Post' : activeTab === 'gallery' ? 'Gallery Item' : 'Coming Soon Collection'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem'
      }}>
        <button
          onClick={() => setActiveTab('blog')}
          className={`btn btn-sm ${activeTab === 'blog' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <FileText size={15} /> Blog Posts ({blogPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`btn btn-sm ${activeTab === 'gallery' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <ImageIcon size={15} /> Product Gallery ({galleryItems.length})
        </button>
        <button
          onClick={() => setActiveTab('coming_soon')}
          className={`btn btn-sm ${activeTab === 'coming_soon' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Sparkles size={15} /> Coming Soon Collections ({comingSoon.length})
        </button>
      </div>

      {/* Tab 1: Blog Table */}
      {activeTab === 'blog' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Cover</th>
                <th style={{ padding: '1rem' }}>Title / Slug</th>
                <th style={{ padding: '1rem' }}>Author</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ width: '56px', height: '40px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={post.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{post.slug}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{post.author}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{post.publish_date}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="badge badge-success">{post.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button onClick={() => openEdit('blog', post)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.55rem' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => promptDelete('blog', post)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem 0.55rem' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Gallery Table */}
      {activeTab === 'gallery' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Media</th>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Collection</th>
                <th style={{ padding: '1rem' }}>Sizes</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {galleryItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={item.media} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-gold-dark)' }}>{item.collection}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {Array.isArray(item.size_labels) ? item.size_labels.join(', ') : 'S, M, L'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="badge badge-success">{item.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button onClick={() => openEdit('gallery', item)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.55rem' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => promptDelete('gallery', item)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem 0.55rem' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Coming Soon Table */}
      {activeTab === 'coming_soon' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Media Preview</th>
                <th style={{ padding: '1rem' }}>Collection / Title</th>
                <th style={{ padding: '1rem' }}>Launch Target</th>
                <th style={{ padding: '1rem' }}>Order</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comingSoon.map(col => (
                <tr key={col.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={col.media} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{col.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-dark)' }}>{col.collection_name}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{col.expected_launch}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{col.display_order}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="badge badge-success">{col.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button onClick={() => openEdit('coming_soon', col)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.55rem' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => promptDelete('coming_soon', col)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem 0.55rem' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Centered Modal Form */}
      <Modal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? `Edit ${drawerMode}` : `Add New ${drawerMode}`}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveItem}>
          {drawerMode === 'blog' && (
            <>
              <div className="form-group">
                <label className="form-label">Article Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={blogForm.title}
                  onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Extra Long Handmade Nail Luxury"
                  required
                />
              </div>

              <ImageUploadField
                label="Article Cover Image"
                value={blogForm.cover}
                onChange={val => setBlogForm({ ...blogForm, cover: val })}
                placeholder="https://... or upload from device"
                helpText="High-resolution landscape or square cover image."
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Publish Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={blogForm.publish_date}
                    onChange={e => setBlogForm({ ...blogForm, publish_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    className="form-input"
                    value={blogForm.author}
                    onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Excerpt Summary</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  value={blogForm.excerpt}
                  onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Article Content (Rich Text / Markdown)</label>
                <textarea
                  rows="6"
                  className="form-textarea"
                  value={blogForm.content_text}
                  onChange={e => setBlogForm({ ...blogForm, content_text: e.target.value })}
                  placeholder="Type the full article content here..."
                ></textarea>
              </div>
            </>
          )}

          {drawerMode === 'gallery' && (
            <>
              <div className="form-group">
                <label className="form-label">Design Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={galleryForm.title}
                  onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Ethereal Velvet Chrome Cat-Eye"
                  required
                />
              </div>

              <ImageUploadField
                label="Gallery Showcase Image *"
                value={galleryForm.media}
                onChange={val => setGalleryForm({ ...galleryForm, media: val })}
                placeholder="https://... or upload from device"
                helpText="Square 1:1 or 4:5 vertical photo of nail design."
              />

              <div className="form-group">
                <label className="form-label">Available Size Labels (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={galleryForm.size_labels}
                  onChange={e => setGalleryForm({ ...galleryForm, size_labels: e.target.value })}
                  placeholder="S, M, L"
                />
              </div>
            </>
          )}

          {drawerMode === 'coming_soon' && (
            <>
              <div className="form-group">
                <label className="form-label">Collection Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={comingSoonForm.title}
                  onChange={e => setComingSoonForm({ ...comingSoonForm, title: e.target.value })}
                  placeholder="e.g. Celestial Twilight Limited Release"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Collection Series Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={comingSoonForm.collection_name}
                  onChange={e => setComingSoonForm({ ...comingSoonForm, collection_name: e.target.value })}
                  placeholder="Upcoming / Seasonal Collection 01"
                />
              </div>

              <ImageUploadField
                label="Collection Preview Media Image"
                value={comingSoonForm.media}
                onChange={val => setComingSoonForm({ ...comingSoonForm, media: val })}
                placeholder="https://... or upload from device"
                helpText="Featured teaser photo for seasonal collection drop."
              />

              <div className="form-group">
                <label className="form-label">Expected Launch</label>
                <input
                  type="text"
                  className="form-input"
                  value={comingSoonForm.expected_launch}
                  onChange={e => setComingSoonForm({ ...comingSoonForm, expected_launch: e.target.value })}
                  placeholder="e.g. Winter 2026"
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Popup */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteType}`}
        message={`Are you sure you want to delete this ${deleteType} record?`}
        itemName={itemToDelete?.title}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
}
