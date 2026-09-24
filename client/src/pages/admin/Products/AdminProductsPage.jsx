import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
  Eye,
  Sparkles,
  Upload,
  UploadCloud,
  X,
  Link2,
  Star,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Layers,
  Tag,
  Sliders
} from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';

export default function AdminProductsPage() {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterShape, setFilterShape] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dynamic Product Types & Nail Shapes
  const [productTypes, setProductTypes] = useState([
    'Handmade Press-On Nails',
    'Nail Essentials'
  ]);
  const [nailShapes, setNailShapes] = useState([
    'Almond',
    'Coffin',
    'Oval',
    'Square',
    'Stiletto',
    'Round',
    'Squoval'
  ]);

  // Add Type / Shape Modal State
  const [isTypeShapeModalOpen, setIsTypeShapeModalOpen] = useState(false);
  const [taxType, setTaxType] = useState('shape'); // 'shape' | 'product_type'
  const [taxName, setTaxName] = useState('');
  const [taxSubmitting, setTaxSubmitting] = useState(false);

  // Centered Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // File Upload State
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        addToast('Please select valid image files (PNG, JPG, JPEG, WEBP, GIF).', 'error');
        return;
      }
    }

    try {
      setUploadingImage(true);
      const uploadedUrls = [];

      for (const file of files) {
        try {
          const res = await api.uploadImage(file);
          if (res.success && res.url) {
            uploadedUrls.push(res.url);
            continue;
          }
        } catch (uploadErr) {
          console.warn('Backend upload fallback to base64 DataURL:', uploadErr);
        }

        // Fallback to base64 for instant preview
        const base64Url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        });
        uploadedUrls.push(base64Url);
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []).filter(Boolean), ...uploadedUrls]
      }));
      addToast(`${uploadedUrls.length} image(s) uploaded successfully!`, 'success');
    } catch (err) {
      addToast('Failed to read image files.', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const url = newImageUrl.trim();
    if (!url) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []).filter(Boolean), url]
    }));
    setNewImageUrl('');
    addToast('Image URL added to gallery', 'success');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary) => {
    if (indexToPrimary === 0) return;
    setFormData(prev => {
      const copy = [...(prev.images || [])];
      const [item] = copy.splice(indexToPrimary, 1);
      return {
        ...prev,
        images: [item, ...copy]
      };
    });
    addToast('Set as main cover image', 'info');
  };

  const handleMoveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= (formData.images || []).length) return;
    setFormData(prev => {
      const copy = [...(prev.images || [])];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return {
        ...prev,
        images: copy
      };
    });
  };

  const handleAddTaxonomy = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanName = taxName.trim();
    if (!cleanName) {
      addToast('Please enter a name for the Type or Shape.', 'error');
      return;
    }

    try {
      setTaxSubmitting(true);
      try {
        await api.createCategory({
          name: cleanName,
          type: taxType,
          status: 'active'
        });
      } catch (apiErr) {
        console.warn('API category creation fallback:', apiErr);
      }

      if (taxType === 'shape') {
        if (!nailShapes.includes(cleanName)) {
          setNailShapes(prev => [...prev, cleanName]);
        }
        addToast(`New Nail Shape "${cleanName}" added successfully!`, 'success');
      } else {
        if (!productTypes.includes(cleanName)) {
          setProductTypes(prev => [...prev, cleanName]);
        }
        addToast(`New Product Type "${cleanName}" added successfully!`, 'success');
      }

      setTaxName('');
      setIsTypeShapeModalOpen(false);
    } catch (err) {
      addToast('Failed to add Type / Shape.', 'error');
    } finally {
      setTaxSubmitting(false);
    }
  };

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    SKU: '',
    price: '',
    sale_price: '',
    stock: 20,
    status: 'active',
    product_type: 'Handmade Press-On Nails',
    shape: 'Coffin',
    categories: ['Handmade Press-On Nails'],
    themes: ['Cat Eye & Chrome'],
    sizes: ['XS', 'S', 'M', 'L', 'Custom'],
    size_stock: { 'XS': 5, 'S': 5, 'M': 5, 'L': 5, 'Custom': 5 },
    images: [],
    description: '',
    additional_info: {
      included: '10 Handcrafted Nails, Professional Salon Glue, Adhesive Tabs, Prep Kit',
      finish: 'High-Gloss Salon Gel',
      wear_time: 'Up to 3 weeks'
    },
    is_best_seller: false,
    is_bundle: false
  });

  const handleSizeStockChange = (sizeName, value) => {
    const qty = Math.max(0, parseInt(value, 10) || 0);
    const updatedSizeStock = {
      ...(formData.size_stock || {}),
      [sizeName]: qty
    };
    const newTotal = Object.values(updatedSizeStock).reduce((a, b) => a + (Number(b) || 0), 0);
    setFormData(prev => ({
      ...prev,
      size_stock: updatedSizeStock,
      stock: newTotal,
      status: newTotal === 0 ? 'out_of_stock' : (prev.status === 'out_of_stock' ? 'active' : prev.status)
    }));
  };

  const handleAddCustomSize = () => {
    const customName = prompt('Enter new size name (e.g. XL, Custom, Long):');
    if (!customName || !customName.trim()) return;
    const clean = customName.trim();
    if ((formData.sizes || []).includes(clean)) {
      addToast(`Size ${clean} already exists.`, 'info');
      return;
    }
    const newSizes = [...(formData.sizes || []), clean];
    const newSizeStock = { ...(formData.size_stock || {}), [clean]: 5 };
    const newTotal = Object.values(newSizeStock).reduce((a, b) => a + (Number(b) || 0), 0);
    setFormData(prev => ({
      ...prev,
      sizes: newSizes,
      size_stock: newSizeStock,
      stock: newTotal,
      status: newTotal === 0 ? 'out_of_stock' : (prev.status === 'out_of_stock' ? 'active' : prev.status)
    }));
  };

  const handleRemoveSize = (sizeName) => {
    const newSizes = (formData.sizes || []).filter(s => s !== sizeName);
    const newSizeStock = { ...(formData.size_stock || {}) };
    delete newSizeStock[sizeName];
    const newTotal = Object.values(newSizeStock).reduce((a, b) => a + (Number(b) || 0), 0);
    setFormData(prev => ({
      ...prev,
      sizes: newSizes,
      size_stock: newSizeStock,
      stock: newTotal,
      status: newTotal === 0 ? 'out_of_stock' : prev.status
    }));
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.allSettled([
        api.getProducts({ all: 'true', admin: 'true' }),
        api.getCategories()
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value?.success && prodRes.value.data) {
        const prodList = prodRes.value.data;
        setProducts(prodList);

        const dynamicTypes = new Set(['Handmade Press-On Nails', 'Nail Essentials']);
        const dynamicShapes = new Set(['Almond', 'Coffin', 'Oval', 'Square', 'Stiletto', 'Round', 'Squoval']);

        prodList.forEach(p => {
          if (p.product_type) dynamicTypes.add(p.product_type);
          if (p.shape) dynamicShapes.add(p.shape);
        });

        if (catRes.status === 'fulfilled' && catRes.value?.success && Array.isArray(catRes.value.data)) {
          catRes.value.data.forEach(c => {
            if (c.type === 'shape' || c.type === 'shapes') dynamicShapes.add(c.name);
            else if (c.type === 'product_type') dynamicTypes.add(c.name);
          });
        }

        setProductTypes(Array.from(dynamicTypes));
        setNailShapes(Array.from(dynamicShapes));
      }
    } catch (err) {
      addToast(err.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    if (searchParams.get('action') === 'add') {
      openAddModal();
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      SKU: `XON-${Math.floor(100 + Math.random() * 900)}`,
      price: '',
      sale_price: '',
      stock: 25,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      shape: 'Coffin',
      categories: ['Handmade Press-On Nails'],
      themes: ['Cat Eye & Chrome'],
      sizes: ['XS', 'S', 'M', 'L', 'Custom'],
      size_stock: { 'XS': 5, 'S': 5, 'M': 5, 'L': 5, 'Custom': 5 },
      images: [],
      description: 'Handcrafted with salon-grade builder gel and high-clarity topcoat.',
      additional_info: {
        included: '10 Nails + Complete Application Kit',
        finish: 'Glossy Gel',
        wear_time: 'Up to 3 weeks'
      },
      is_best_seller: false,
      is_bundle: false
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const editSizes = Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ['XS', 'S', 'M', 'L', 'Custom'];

    let editSizeStock = {};
    if (product.size_stock && typeof product.size_stock === 'object' && Object.keys(product.size_stock).length > 0) {
      editSizeStock = { ...product.size_stock };
      editSizes.forEach(s => {
        if (editSizeStock[s] === undefined) {
          editSizeStock[s] = Math.max(0, Math.floor((Number(product.stock) || 0) / editSizes.length));
        }
      });
    } else {
      const perSize = Math.max(0, Math.floor((Number(product.stock) || 0) / editSizes.length));
      editSizes.forEach(s => {
        editSizeStock[s] = perSize;
      });
    }

    const currentTotal = Object.values(editSizeStock).reduce((a, b) => a + (Number(b) || 0), 0) || (product.stock !== undefined ? product.stock : 0);

    setFormData({
      name: product.name || '',
      SKU: product.SKU || '',
      price: product.price !== undefined ? product.price : '',
      sale_price: product.sale_price !== null && product.sale_price !== undefined ? product.sale_price : '',
      stock: currentTotal,
      status: product.status || (currentTotal === 0 ? 'out_of_stock' : 'active'),
      product_type: product.product_type || 'Handmade Press-On Nails',
      shape: product.shape || '',
      categories: Array.isArray(product.categories) ? product.categories : [product.product_type],
      themes: Array.isArray(product.themes) ? product.themes : [],
      sizes: editSizes,
      size_stock: editSizeStock,
      images: Array.isArray(product.images) ? product.images : [],
      description: product.description || '',
      additional_info: product.additional_info || {},
      is_best_seller: Boolean(product.is_best_seller),
      is_bundle: Boolean(product.is_bundle)
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.SKU || formData.price === '') {
      setFormError('Name, SKU, and Regular Price are required.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      if (editingProduct) {
        // Update product
        const res = await api.updateProduct(editingProduct.id, formData);
        if (res.success) {
          addToast(`Product "${formData.name}" updated successfully!`, 'success');
          setIsModalOpen(false);
          loadProducts();
        }
      } else {
        // Create product
        const res = await api.createProduct(formData);
        if (res.success) {
          addToast(`Product "${formData.name}" created successfully!`, 'success');
          setIsModalOpen(false);
          loadProducts();
        }
      }
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await api.deleteProduct(productToDelete.id);
      if (res.success) {
        addToast(`Product "${productToDelete.name}" deleted.`, 'success');
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
        loadProducts();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
      const res = await api.updateProduct(productId, { status: newStatus });
      if (res.success) {
        addToast(`Product status updated to "${newStatus.replace('_', ' ')}"`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
      loadProducts();
    }
  };

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.SKU.toLowerCase().includes(search.toLowerCase()) ||
      (p.shape && p.shape.toLowerCase().includes(search.toLowerCase()));

    const matchesType = !filterType || p.product_type === filterType;
    const matchesShape = !filterShape || p.shape === filterShape;
    const matchesStatus = !filterStatus || p.status === filterStatus;

    return matchesSearch && matchesType && matchesShape && matchesStatus;
  });

  return (
    <div>
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="brand-line">Inventory & Catalog</span>
          <h1 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            Product Management
          </h1>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '0.75rem',
        alignItems: 'center',
        padding: '0.85rem 1.25rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
          <input
            type="text"
            placeholder="Search by name, SKU, shape..."
            className="form-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', fontSize: '0.85rem', width: '100%' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Filters & Add Type/Shape Action */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'nowrap', alignItems: 'center', flexShrink: 0 }}>
          <select
            className="form-select"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto', flexShrink: 0 }}
          >
            <option value="">All Product Types</option>
            {productTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={filterShape}
            onChange={e => setFilterShape(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto', flexShrink: 0 }}
          >
            <option value="">All Shapes</option>
            {nailShapes.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto', flexShrink: 0 }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Add Type / Shape Button */}
          <button
            type="button"
            onClick={() => setIsTypeShapeModalOpen(true)}
            className="btn btn-outline btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              background: 'rgba(212, 175, 55, 0.08)',
              borderColor: 'var(--border-gold)',
              color: 'var(--accent-gold-dark)',
              flexShrink: 0
            }}
          >
            <Plus size={14} /> Add Type / Shape
          </button>
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <LoadingSpinner text="Loading products..." />
      ) : (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Thumbnail</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Name / SKU</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Price</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Type / Shape</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Stock</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No products match your search/filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => {
                    const img = product.images?.[0] || 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=150&q=80';
                    return (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease', whiteSpace: 'nowrap' }}>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap' }}>{product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{product.SKU}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                          {product.sale_price ? (
                            <div style={{ whiteSpace: 'nowrap' }}>
                              <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>${product.sale_price.toFixed(2)}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>${(product.price || 0).toFixed(2)}</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                          <div style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{product.product_type}</div>
                          {product.shape && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', display: 'block' }}>Shape: {product.shape}</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ color: product.stock > 10 ? '#34d399' : product.stock > 0 ? '#fbbf24' : '#ef4444', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {product.stock} units
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                          <select
                            value={product.status || 'active'}
                            onChange={(e) => handleStatusChange(product.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              outline: 'none',
                              border: '1px solid',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s ease',
                              ...(product.status === 'active' ? {
                                background: '#ecfdf5',
                                color: '#059669',
                                borderColor: '#a7f3d0'
                              } : product.status === 'draft' ? {
                                background: '#fffbeb',
                                color: '#d97706',
                                borderColor: '#fde68a'
                              } : {
                                background: '#fef2f2',
                                color: '#dc2626',
                                borderColor: '#fecaca'
                              })
                            }}
                          >
                            <option value="active" style={{ background: '#fff', color: '#059669', fontWeight: 600 }}>Active</option>
                            <option value="draft" style={{ background: '#fff', color: '#d97706', fontWeight: 600 }}>Draft</option>
                            <option value="out_of_stock" style={{ background: '#fff', color: '#dc2626', fontWeight: 600 }}>Out of Stock</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => openEditModal(product)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Product"
                              style={{ padding: '0.4rem 0.6rem' }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="btn btn-danger btn-sm"
                              title="Delete Product"
                              style={{ padding: '0.4rem 0.6rem' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Centered Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
        maxWidth="780px"
      >
        <form onSubmit={handleFormSubmit}>
          {formError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              color: '#ef4444',
              fontSize: '0.88rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. CF-35-0961 Luxury Chrome Velvet"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">SKU (Unique) *</label>
              <input
                type="text"
                className="form-input"
                value={formData.SKU}
                onChange={e => setFormData({ ...formData, SKU: e.target.value })}
                placeholder="XON-CF-0961"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Regular Price ($) *</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="48.00"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sale Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.sale_price}
                onChange={e => setFormData({ ...formData, sale_price: e.target.value })}
                placeholder="39.00"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Product Type</label>
              <select
                className="form-select"
                value={formData.product_type}
                onChange={e => setFormData({ ...formData, product_type: e.target.value })}
              >
                {productTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Shape</label>
              <select
                className="form-select"
                value={formData.shape || ''}
                onChange={e => setFormData({ ...formData, shape: e.target.value || null })}
              >
                <option value="">None / Not Applicable</option>
                {nailShapes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                className="form-input"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          {/* Size-Specific Stock Inventory (Tồn kho từng size) */}
          <div className="form-group" style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <label className="form-label" style={{ marginBottom: '2px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Layers size={15} color="var(--accent-gold)" /> Size-Specific Stock Inventory
                </label>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Set available units for each nail size. Total stock auto-calculates ({formData.stock || 0} units total).
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Plus size={13} /> Add Size
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
              gap: '0.75rem'
            }}>
              {(formData.sizes || ['XS', 'S', 'M', 'L', 'Custom']).map((sz) => {
                const currentQty = formData.size_stock?.[sz] !== undefined ? formData.size_stock[sz] : 0;
                return (
                  <div
                    key={sz}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '6px',
                      padding: '0.5rem 0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                        Size {sz}
                      </span>
                      {['XS', 'S', 'M', 'L', 'Custom'].indexOf(sz) === -1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(sz)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                          title="Remove size"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={currentQty}
                        onChange={(e) => handleSizeStockChange(sz, e.target.value)}
                        style={{
                          padding: '0.3rem 0.45rem',
                          fontSize: '0.85rem',
                          textAlign: 'center',
                          fontWeight: 600,
                          borderColor: currentQty === 0 ? '#ef4444' : 'var(--border-subtle)'
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>pcs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Gallery: Multi-Image Upload from Computer + Live Preview + URL */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ImageIcon size={16} color="var(--accent-gold)" /> Product Image Gallery ({formData.images?.length || 0}) *
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                Upload multiple pictures (1st image is the main cover)
              </span>
            </label>

            {/* Hidden multi-file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageFileChange}
            />

            {/* Multi-Image Gallery Grid */}
            {formData.images && formData.images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.85rem',
                marginBottom: '1rem',
                padding: '0.85rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px'
              }}>
                {formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: idx === 0 ? '2px solid var(--accent-gold)' : '1px solid var(--border-medium)',
                      background: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Thumbnail Image */}
                    <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5' }}>
                      <img
                        src={imgUrl}
                        alt={`Product img ${idx + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/IMG_7098.webp';
                        }}
                      />

                      {/* Main Cover Badge */}
                      {idx === 0 ? (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          background: 'rgba(179, 135, 40, 0.95)',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          zIndex: 2
                        }}>
                          <Star size={10} fill="#ffffff" /> Cover
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          title="Set as Main Cover Image"
                          style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            background: 'rgba(0, 0, 0, 0.65)',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            zIndex: 2,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-gold)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)'}
                        >
                          <Star size={10} /> Set Cover
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove image"
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Reorder Buttons */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 6px',
                      background: '#f9f9f9',
                      borderTop: '1px solid #eeeeee',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span>#{idx + 1}</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, idx - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            opacity: idx === 0 ? 0.3 : 1,
                            padding: '2px'
                          }}
                          title="Move Left"
                        >
                          <ArrowLeft size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.images.length - 1}
                          onClick={() => handleMoveImage(idx, idx + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: idx === formData.images.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: idx === formData.images.length - 1 ? 0.3 : 1,
                            padding: '2px'
                          }}
                          title="Move Right"
                        >
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone Upload Trigger for Multiple Images */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-medium)',
                borderRadius: '8px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                background: 'var(--bg-secondary)',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(179, 135, 40, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem auto',
                color: 'var(--accent-gold-dark)'
              }}>
                <UploadCloud size={20} />
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                {uploadingImage ? 'Uploading files...' : '+ Click or drop multiple images to upload from computer'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Select one or multiple PNG, JPG, JPEG, WEBP, GIF files (supports batch selection)
              </div>
            </div>

            {/* Direct URL Input Option with Add Button */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  className="form-input"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  placeholder="Or paste an image URL directly (e.g. https://...)"
                  style={{ fontSize: '0.85rem', paddingLeft: '2.4rem' }}
                />
                <Link2 size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!newImageUrl.trim()}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0 1rem', whiteSpace: 'nowrap' }}
              >
                + Add Image
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Craftsmanship details, gel formulation..."
            ></textarea>
          </div>

          {/* Flags */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={formData.is_best_seller}
                onChange={e => setFormData({ ...formData, is_best_seller: e.target.checked })}
                style={{ accentColor: 'var(--accent-gold)' }}
              />
              <span>Mark as Best Seller</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={formData.is_bundle}
                onChange={e => setFormData({ ...formData, is_bundle: e.target.checked })}
                style={{ accentColor: 'var(--accent-gold)' }}
              />
              <span>Mark as Bundle & Save Item</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={formLoading}
            >
              {formLoading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
      {/* Add Type / Shape Modal */}
      <Modal
        isOpen={isTypeShapeModalOpen}
        onClose={() => setIsTypeShapeModalOpen(false)}
        title="Add Product Type / Nail Shape"
        maxWidth="480px"
      >
        <form onSubmit={handleAddTaxonomy} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Classification Type
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setTaxType('shape')}
                className={`btn btn-sm ${taxType === 'shape' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.6rem 1rem' }}
              >
                Nail Shape
              </button>
              <button
                type="button"
                onClick={() => setTaxType('product_type')}
                className={`btn btn-sm ${taxType === 'product_type' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.6rem 1rem' }}
              >
                Product Type
              </button>
            </div>
          </div>

          <div>
            <label className="form-label">
              {taxType === 'shape' ? 'Nail Shape Name' : 'Product Type Name'} *
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder={taxType === 'shape' ? 'e.g. Duck Nails, Tapered Square, Lipstick' : 'e.g. Luxury Press-On Sets, Nail Care Kits'}
              value={taxName}
              onChange={e => setTaxName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Current existing items preview */}
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Existing {taxType === 'shape' ? 'Nail Shapes' : 'Product Types'}:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '110px', overflowY: 'auto', padding: '0.25rem 0' }}>
              {(taxType === 'shape' ? nailShapes : productTypes).map(item => (
                <span
                  key={item}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsTypeShapeModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={taxSubmitting || !taxName.trim()}
            >
              {taxSubmitting ? 'Adding...' : `Add ${taxType === 'shape' ? 'Shape' : 'Type'}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Popup */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemName={productToDelete?.name}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
}
