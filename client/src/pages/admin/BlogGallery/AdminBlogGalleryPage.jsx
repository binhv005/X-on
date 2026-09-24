import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import ImageInput from '../../../components/common/ImageInput';
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
                e.currentTarget.src = '/assets/images/IMG_7098.webp';
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listSearch, setListSearch] = useState('');
  const [listStatus, setListStatus] = useState('all');

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
  // File ảnh chọn từ máy, giữ lại và upload ẩn ở lúc nhấn Save (không toast riêng)
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFile, setGalleryFile] = useState(null);
  const [comingSoonFile, setComingSoonFile] = useState(null);
  const clearPendingFiles = () => {
    setCoverFile(null);
    setGalleryFile(null);
    setComingSoonFile(null);
  };

  // Form Fields
  const emptyBlock = () => ({ key: `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, type: 'paragraph', text: '', url: '', caption: '', itemsText: '', file: null, preview: '' });
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    cover: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
    publish_date: new Date().toISOString().split('T')[0],
    author: 'X-ON Team',
    excerpt: '',
    status: 'published',
    blocks: [{ key: 'b_init', type: 'paragraph', text: '', url: '', caption: '', itemsText: '' }]
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

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [blogsRes, galleryRes, comingSoonRes, productsRes] = await Promise.all([
        api.getBlogPosts({ all: 'true' }),
        api.getGalleryItems({ all: 'true' }),
        api.getComingSoonCollections(),
        api.getProducts({ limit: 100 }).catch(() => ({ success: false, data: [] }))
      ]);

      if (blogsRes.success) setBlogPosts(blogsRes.data);
      if (galleryRes.success) setGalleryItems(galleryRes.data);
      if (comingSoonRes.success) setComingSoon(comingSoonRes.data);
      if (productsRes?.success && Array.isArray(productsRes.data)) setProducts(productsRes.data);
      else if (Array.isArray(productsRes?.data?.items)) setProducts(productsRes.data.items);
    } catch (err) {
      if (!silent) addToast('Failed to load blog and gallery datasets', 'error');
    } finally {
      if (!silent) setLoading(false);
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

  useEffect(() => {
    setListSearch('');
    setListStatus('all');
  }, [activeTab]);

  const matchSearch = (hay, q) => hay.toLowerCase().includes(q);
  const filteredBlogs = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    return blogPosts.filter((p) => {
      if (listStatus !== 'all' && (p.status || 'published') !== listStatus) return false;
      if (!q) return true;
      return matchSearch(`${p.title || ''} ${p.slug || ''} ${p.author || ''}`, q);
    });
  }, [blogPosts, listSearch, listStatus]);
  const filteredGallery = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    return galleryItems.filter((g) => {
      if (listStatus !== 'all' && (g.status || 'published') !== listStatus) return false;
      if (!q) return true;
      return matchSearch(`${g.title || ''} ${g.collection || ''}`, q);
    });
  }, [galleryItems, listSearch, listStatus]);
  const filteredComingSoon = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    return comingSoon.filter((c) => {
      if (listStatus !== 'all' && (c.status || 'active') !== listStatus) return false;
      if (!q) return true;
      return matchSearch(`${c.title || ''} ${c.collection_name || ''}`, q);
    });
  }, [comingSoon, listSearch, listStatus]);

  const slugify = (s = '') => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').slice(0, 80);
  const toEditableBlocks = (content_blocks, fallbackText = '') => {
    if (Array.isArray(content_blocks) && content_blocks.length > 0) {
      return content_blocks.map((b, i) => ({
        key: `b_${Date.now()}_${i}`,
        type: ['heading', 'paragraph', 'image', 'list'].includes(b?.type) ? b.type : 'paragraph',
        text: b?.text || '',
        url: b?.url || '',
        caption: b?.caption || '',
        itemsText: Array.isArray(b?.items) ? b.items.join('\n') : '',
        file: null,
        preview: ''
      }));
    }
    return [{ key: `b_${Date.now()}`, type: 'paragraph', text: fallbackText || '', url: '', caption: '', itemsText: '', file: null, preview: '' }];
  };
  const blocksToPayload = (blocks) => (blocks || [])
    .map((b) => {
      if (b.type === 'heading' || b.type === 'paragraph') {
        return b.text?.trim() ? { type: b.type, text: b.text.trim() } : null;
      }
      if (b.type === 'image') {
        return b.url?.trim() ? { type: 'image', url: b.url.trim(), caption: b.caption?.trim() || '' } : null;
      }
      if (b.type === 'list') {
        const items = (b.itemsText || '').split('\n').map((s) => s.trim()).filter(Boolean);
        return items.length > 0 ? { type: 'list', items } : null;
      }
      return null;
    })
    .filter(Boolean);
  const openAdd = (type) => {
    setDrawerMode(type);
    setEditingItem(null);
    clearPendingFiles();
    if (type === 'blog') {
      setBlogForm({
        title: '',
        slug: '',
        cover: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
        publish_date: new Date().toISOString().split('T')[0],
        author: 'X-ON Master Artist',
        excerpt: '',
        status: 'published',
        blocks: [{ key: `b_${Date.now()}`, type: 'paragraph', text: '', url: '', caption: '', itemsText: '', file: null, preview: '' }]
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
    clearPendingFiles();
    if (type === 'blog') {
      const fallbackText = item.content_blocks?.map(b => b.text).filter(Boolean).join('\n\n') || item.excerpt || '';
      setBlogForm({
        title: item.title || '',
        slug: item.slug || '',
        cover: item.cover || '',
        publish_date: item.publish_date || '',
        author: item.author || 'X-ON Team',
        excerpt: item.excerpt || '',
        status: item.status || 'published',
        blocks: toEditableBlocks(item.content_blocks, fallbackText)
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

  // Upload ẩn lúc Save, không toast riêng để khỏi làm phiền người dùng
  const uploadSilent = async (file, folder) => {
    const res = await api.uploadImage(file, folder);
    const url = res?.data?.url;
    if (!url) throw new Error('Image upload failed. Please try again.');
    return url;
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const snapshot = { blogPosts, galleryItems, comingSoon };
    const wasEditing = Boolean(editingItem);
    const mode = drawerMode;
    // Build payload trước để đóng modal ngay cho mượt
    let payload = null;
    // File chờ upload (nếu có) được giữ ở state, upload ẩn ở đây
    let pendingCoverFile = null;
    let pendingGalleryFile = null;
    let pendingComingSoonFile = null;
    if (mode === 'blog') {
      if (!blogForm.title?.trim()) {
        addToast('Please enter the article title.', 'error');
        return;
      }
      const blocks = (blogForm.blocks || []).map((b) => ({ ...b }));
      const hasContent = blocksToPayload(blocks).length > 0 || blocks.some((b) => b.type === 'image' && b.file);
      if (!hasContent) {
        addToast('Please add at least one content block with text, image or list.', 'error');
        return;
      }
      if (!blogForm.cover && !coverFile) {
        addToast('Please provide a cover image (upload or paste link).', 'error');
        return;
      }
      pendingCoverFile = coverFile;
      payload = {
        title: blogForm.title.trim(),
        slug: blogForm.slug?.trim() ? slugify(blogForm.slug) : slugify(blogForm.title),
        cover: blogForm.cover,
        publish_date: blogForm.publish_date,
        author: blogForm.author,
        excerpt: blogForm.excerpt,
        status: blogForm.status,
        _blocks: blocks
      };
    } else if (mode === 'gallery') {
      payload = {
        ...galleryForm,
        size_labels: galleryForm.size_labels.split(',').map(s => s.trim()).filter(Boolean)
      };
      if (!payload.media && !galleryFile) {
        addToast('Please provide a gallery image (upload or paste link).', 'error');
        return;
      }
      pendingGalleryFile = galleryFile;
    } else if (mode === 'coming_soon') {
      payload = { ...comingSoonForm };
      if (!payload.media && !comingSoonFile) {
        addToast('Please provide a collection image (upload or paste link).', 'error');
        return;
      }
      pendingComingSoonFile = comingSoonFile;
    }

    // Optimistic: đóng modal ngay, toast saving, upload + lưu nền (ẩn, không toast riêng)
    const editingId = editingItem?.id;
    setIsDrawerOpen(false);
    setFormLoading(true);
    const savingToast = `Saving ${mode === 'blog' ? 'blog post' : mode === 'gallery' ? 'gallery item' : 'collection'}...`;
    addToast(savingToast, 'info');

    try {
      if (mode === 'blog') {
        let coverUrl = payload.cover;
        if (pendingCoverFile) coverUrl = await uploadSilent(pendingCoverFile, 'blog');
        const blocks = (payload._blocks || []).map((b) => ({ ...b }));
        for (const b of blocks) {
          if (b.type === 'image' && b.file) {
            b.url = await uploadSilent(b.file, 'blog');
            b.file = null;
          }
          if (b.preview) {
            try { URL.revokeObjectURL(b.preview); } catch { /* ignore */ }
            b.preview = '';
          }
        }
        const finalPayload = {
          title: payload.title,
          slug: payload.slug,
          cover: coverUrl,
          publish_date: payload.publish_date,
          author: payload.author,
          excerpt: payload.excerpt,
          status: payload.status,
          content_blocks: blocksToPayload(blocks)
        };
        clearPendingFiles();
        if (wasEditing) {
          const res = await api.updateBlogPost(editingId, finalPayload);
          setBlogPosts((prev) => prev.map((p) => (p.id === editingId ? res.data || { ...p, ...finalPayload } : p)));
          addToast('Blog post updated!', 'success');
        } else {
          const res = await api.createBlogPost(finalPayload);
          if (res.data) setBlogPosts((prev) => [res.data, ...prev]);
          addToast('Blog post created!', 'success');
        }
      } else if (mode === 'gallery') {
        let mediaUrl = payload.media;
        if (pendingGalleryFile) mediaUrl = await uploadSilent(pendingGalleryFile, 'gallery');
        const finalPayload = { ...payload, media: mediaUrl };
        clearPendingFiles();
        if (wasEditing) {
          const res = await api.updateGalleryItem(editingId, finalPayload);
          setGalleryItems((prev) => prev.map((p) => (p.id === editingId ? res.data || { ...p, ...finalPayload } : p)));
          addToast('Gallery item updated!', 'success');
        } else {
          const res = await api.createGalleryItem(finalPayload);
          if (res.data) setGalleryItems((prev) => [res.data, ...prev]);
          addToast('Gallery item created!', 'success');
        }
      } else if (mode === 'coming_soon') {
        let mediaUrl = payload.media;
        if (pendingComingSoonFile) mediaUrl = await uploadSilent(pendingComingSoonFile, 'coming-soon');
        const finalPayload = { ...payload, media: mediaUrl };
        clearPendingFiles();
        if (wasEditing) {
          const res = await api.updateComingSoonCollection(editingId, finalPayload);
          setComingSoon((prev) => prev.map((p) => (p.id === editingId ? res.data || { ...p, ...finalPayload } : p)));
          addToast('Coming soon collection updated!', 'success');
        } else {
          const res = await api.createComingSoonCollection(finalPayload);
          if (res.data) setComingSoon((prev) => [...prev, res.data]);
          addToast('Coming soon collection created!', 'success');
        }
      }
      setEditingItem(null);
      // Sync nền lặng lẽ để khớp server (không flicker loading toàn trang)
      loadData(true);
    } catch (err) {
      // Rollback snapshot khi lỗi
      setBlogPosts(snapshot.blogPosts);
      setGalleryItems(snapshot.galleryItems);
      setComingSoon(snapshot.comingSoon);
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
          className="btn btn-primary btn-sm"
        >
          <Plus size={14} /> Add {activeTab === 'blog' ? 'Blog Post' : activeTab === 'gallery' ? 'Gallery Item' : 'Coming Soon Collection'}
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

      {/* Search / Filter toolbar (giữ query khi edit xong/quay lại list) */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', minWidth: '220px', maxWidth: '340px', width: '100%' }}>
          <input
            type="text"
            placeholder={activeTab === 'blog' ? 'Search title, slug, author...' : activeTab === 'gallery' ? 'Search design, collection...' : 'Search collection, title...'}
            className="form-input"
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
          />
          <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>⌕</span>
        </div>
        <select
          className="form-input"
          value={listStatus}
          onChange={(e) => setListStatus(e.target.value)}
          style={{ width: 'auto', fontSize: '0.85rem' }}
        >
          <option value="all">All statuses</option>
          {activeTab === 'coming_soon' ? (
            <>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </>
          ) : (
            <>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </>
          )}
        </select>
        {(listSearch || listStatus !== 'all') && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setListSearch(''); setListStatus('all'); }}>
            Clear
          </button>
        )}
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
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No blog posts match your search/filter.
                  </td>
                </tr>
              ) : filteredBlogs.map(post => (
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
              {filteredGallery.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No gallery items match your search/filter.
                  </td>
                </tr>
              ) : filteredGallery.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', background: '#f5f5f5' }}>
                      <img
                        src={item.media}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/IMG_7098.webp';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
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
              {filteredComingSoon.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No collections match your search/filter.
                  </td>
                </tr>
              ) : filteredComingSoon.map(col => (
                <tr key={col.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: '#f5f5f5' }}>
                      <img
                        src={col.media}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/IMG_7098.webp';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
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

      {/* Centered Popup Form Modal */}
      <Modal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? `Edit ${drawerMode}` : `Add New ${drawerMode}`}
        maxWidth="720px"
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

              <ImageInput
                key={`blog-cover-${editingItem?.id || 'new'}`}
                label="Cover Image"
                value={blogForm.cover}
                onChange={(url) => setBlogForm({ ...blogForm, cover: url })}
                onFileChange={setCoverFile}
                required
              />
                <div style={{ marginTop: '-0.25rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Quick Select Studio Photoshoot Asset:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {[
                      '/assets/images/IMG_7098.webp',
                      '/assets/images/IMG_7099.webp',
                      '/assets/images/IMG_7100.webp',
                      '/assets/images/IMG_7101.webp',
                      '/assets/images/IMG_7102.webp',
                      '/assets/images/IMG_7103.webp',
                      '/assets/images/IMG_7104.webp',
                      '/assets/images/IMG_7105.webp',
                      '/assets/images/IMG_7106.webp',
                      '/assets/images/IMG_7107.webp',
                      '/assets/images/IMG_7110.webp'
                    ].map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setBlogForm({ ...blogForm, cover: img }); setCoverFile(null); }}
                        style={{
                          width: '42px',
                          height: '42px',
                          padding: 0,
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: blogForm.cover === img ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Slug (auto from title if empty)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={blogForm.slug}
                    onChange={e => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="e.g. extra-long-handmade-nail-luxury"
                  />
                  {!blogForm.slug?.trim() && blogForm.title?.trim() && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto: /{slugify(blogForm.title)}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={blogForm.status}
                    onChange={e => setBlogForm({ ...blogForm, status: e.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Content Blocks (heading / paragraph / image / list)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(blogForm.blocks || []).map((b, idx) => (
                    <div key={b.key} style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.75rem', background: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>#{idx + 1}</span>
                        <select
                          className="form-input"
                          value={b.type}
                          onChange={e => setBlogForm({ ...blogForm, blocks: blogForm.blocks.map(x => x.key === b.key ? { ...x, type: e.target.value } : x) })}
                          style={{ width: 'auto', fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                        >
                          <option value="heading">Heading</option>
                          <option value="paragraph">Paragraph</option>
                          <option value="image">Image</option>
                          <option value="list">List</option>
                        </select>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
                          <button type="button" className="btn btn-secondary btn-sm" disabled={idx === 0} onClick={() => setBlogForm({ ...blogForm, blocks: [...blogForm.blocks.slice(0, idx - 1), blogForm.blocks[idx], blogForm.blocks[idx - 1], ...blogForm.blocks.slice(idx + 1)] })} style={{ padding: '0.25rem 0.5rem' }}>↑</button>
                          <button type="button" className="btn btn-secondary btn-sm" disabled={idx === blogForm.blocks.length - 1} onClick={() => setBlogForm({ ...blogForm, blocks: [...blogForm.blocks.slice(0, idx), blogForm.blocks[idx + 1], blogForm.blocks[idx], ...blogForm.blocks.slice(idx + 2)] })} style={{ padding: '0.25rem 0.5rem' }}>↓</button>
                          <button type="button" className="btn btn-danger btn-sm" disabled={blogForm.blocks.length === 1} onClick={() => setBlogForm({ ...blogForm, blocks: blogForm.blocks.filter(x => x.key !== b.key) })} style={{ padding: '0.25rem 0.5rem' }}>✕</button>
                        </div>
                      </div>
                      {(b.type === 'heading' || b.type === 'paragraph') && (
                        <textarea
                          rows={b.type === 'heading' ? 1 : 3}
                          className="form-textarea"
                          value={b.text}
                          onChange={e => setBlogForm({ ...blogForm, blocks: blogForm.blocks.map(x => x.key === b.key ? { ...x, text: e.target.value } : x) })}
                          placeholder={b.type === 'heading' ? 'Section heading...' : 'Paragraph text...'}
                        />
                      )}
                      {b.type === 'image' && (
                        <>
                          {(b.preview || b.url) && (
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                              <div style={{ width: '110px', height: '72px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', flexShrink: 0, background: '#111' }}>
                                <img src={b.preview || b.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.opacity = '0.3'; }} />
                              </div>
                              {b.preview && (
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold-dark)', background: 'rgba(179,135,40,0.12)', border: '1px solid var(--border-gold)', borderRadius: '999px', padding: '0.15rem 0.6rem' }}>
                                  New
                                </span>
                              )}
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              if (!f.type.startsWith('image/')) {
                                addToast('Only image files are allowed (jpg, png, webp).', 'error');
                                e.target.value = '';
                                return;
                              }
                              if (f.size > 5 * 1024 * 1024) {
                                addToast('Image must be under 5MB.', 'error');
                                e.target.value = '';
                                return;
                              }
                              setBlogForm({
                                ...blogForm,
                                blocks: blogForm.blocks.map((x) => {
                                  if (x.key !== b.key) return x;
                                  if (x.preview) { try { URL.revokeObjectURL(x.preview); } catch { /* ignore */ } }
                                  return { ...x, file: f, preview: URL.createObjectURL(f) };
                                })
                              });
                              e.target.value = '';
                            }}
                            style={{ marginBottom: '0.5rem', fontSize: '0.82rem' }}
                          />
                          <input
                            type="text"
                            className="form-input"
                            value={b.url}
                            onChange={e => setBlogForm({ ...blogForm, blocks: blogForm.blocks.map(x => {
                              if (x.key !== b.key) return x;
                              if (x.preview) { try { URL.revokeObjectURL(x.preview); } catch { /* ignore */ } }
                              return { ...x, url: e.target.value, file: null, preview: '' };
                            }) })}
                            placeholder="...or paste image link"
                            style={{ marginBottom: '0.5rem' }}
                          />
                          <input
                            type="text"
                            className="form-input"
                            value={b.caption}
                            onChange={e => setBlogForm({ ...blogForm, blocks: blogForm.blocks.map(x => x.key === b.key ? { ...x, caption: e.target.value } : x) })}
                            placeholder="Caption (optional)"
                          />
                        </>
                      )}
                      {b.type === 'list' && (
                        <textarea
                          rows={3}
                          className="form-textarea"
                          value={b.itemsText}
                          onChange={e => setBlogForm({ ...blogForm, blocks: blogForm.blocks.map(x => x.key === b.key ? { ...x, itemsText: e.target.value } : x) })}
                          placeholder="One item per line..."
                        />
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setBlogForm({ ...blogForm, blocks: [...(blogForm.blocks || []), emptyBlock()] })} style={{ alignSelf: 'flex-start' }}>
                    <Plus size={13} /> Add block
                  </button>
                </div>
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

              <ImageInput
                key={`gallery-media-${editingItem?.id || 'new'}`}
                label="Media Image"
                value={galleryForm.media}
                onChange={(url) => setGalleryForm({ ...galleryForm, media: url })}
                onFileChange={setGalleryFile}
                required
              />
                <div style={{ marginTop: '-0.25rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Quick Select Studio Photoshoot Asset:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {[
                      '/assets/images/IMG_7098.webp',
                      '/assets/images/IMG_7099.webp',
                      '/assets/images/IMG_7100.webp',
                      '/assets/images/IMG_7101.webp',
                      '/assets/images/IMG_7102.webp',
                      '/assets/images/IMG_7103.webp',
                      '/assets/images/IMG_7104.webp',
                      '/assets/images/IMG_7105.webp',
                      '/assets/images/IMG_7106.webp',
                      '/assets/images/IMG_7107.webp',
                      '/assets/images/IMG_7110.webp'
                    ].map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setGalleryForm({ ...galleryForm, media: img }); setGalleryFile(null); }}
                        style={{
                          width: '42px',
                          height: '42px',
                          padding: 0,
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: galleryForm.media === img ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Collection</label>
                  <input
                    type="text"
                    className="form-input"
                    value={galleryForm.collection}
                    onChange={e => setGalleryForm({ ...galleryForm, collection: e.target.value })}
                    placeholder="Now Selling"
                    list="gallery-collections"
                  />
                  <datalist id="gallery-collections">
                    <option value="Now Selling" />
                    <option value="Spring Whisper" />
                    <option value="Luxe Romance" />
                  </datalist>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={galleryForm.status}
                    onChange={e => setGalleryForm({ ...galleryForm, status: e.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Linked Product (optional)</label>
                  <select
                    className="form-input"
                    value={galleryForm.linked_product || ''}
                    onChange={e => setGalleryForm({ ...galleryForm, linked_product: e.target.value })}
                  >
                    <option value="">— No linked product —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name || p.title || p.id} {!p.slug ? '' : `(/product/${p.slug})`}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={galleryForm.sort_order}
                    onChange={e => setGalleryForm({ ...galleryForm, sort_order: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                    min="0"
                  />
                </div>
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

              <ImageInput
                key={`comingsoon-media-${editingItem?.id || 'new'}`}
                label="Media Image / Video Poster"
                value={comingSoonForm.media}
                onChange={(url) => setComingSoonForm({ ...comingSoonForm, media: url })}
                onFileChange={setComingSoonFile}
              />
                <div style={{ marginTop: '-0.25rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Quick Select Seasonal Media:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {[
                      '/assets/images/IMG_7107.webp',
                      '/assets/images/IMG_7110.webp',
                      '/assets/images/IMG_7111.webp',
                      '/assets/images/IMG_7098.webp'
                    ].map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setComingSoonForm({ ...comingSoonForm, media: img }); setComingSoonFile(null); }}
                        style={{
                          width: '42px',
                          height: '42px',
                          padding: 0,
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: comingSoonForm.media === img ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Description</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  value={comingSoonForm.subtitle}
                  onChange={e => setComingSoonForm({ ...comingSoonForm, subtitle: e.target.value })}
                  placeholder="Short description shown on the Coming Soon card..."
                />
              </div>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={comingSoonForm.status}
                    onChange={e => setComingSoonForm({ ...comingSoonForm, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={comingSoonForm.display_order}
                    onChange={e => setComingSoonForm({ ...comingSoonForm, display_order: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                    min="0"
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={formLoading}>
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
