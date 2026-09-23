import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { api } from '../../../services/api';
import Drawer from '../../../components/common/Drawer';
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
  const [filterStatus, setFilterStatus] = useState('');

  // Drawer / Modal Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    images: ['https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'],
    description: '',
    additional_info: {
      included: '10 Handcrafted Nails, Professional Salon Glue, Adhesive Tabs, Prep Kit',
      finish: 'High-Gloss Salon Gel',
      wear_time: 'Up to 3 weeks'
    },
    is_best_seller: false,
    is_bundle: false
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts({ all: 'true' });
      if (res.success && res.data) {
        setProducts(res.data);
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
      openAddDrawer();
    }
  }, [searchParams]);

  const openAddDrawer = () => {
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
      images: ['https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'],
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
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      SKU: product.SKU || '',
      price: product.price !== undefined ? product.price : '',
      sale_price: product.sale_price !== null && product.sale_price !== undefined ? product.sale_price : '',
      stock: product.stock !== undefined ? product.stock : 0,
      status: product.status || 'active',
      product_type: product.product_type || 'Handmade Press-On Nails',
      shape: product.shape || '',
      categories: Array.isArray(product.categories) ? product.categories : [product.product_type],
      themes: Array.isArray(product.themes) ? product.themes : [],
      sizes: Array.isArray(product.sizes) ? product.sizes : ['XS', 'S', 'M', 'L'],
      images: Array.isArray(product.images) ? product.images : [],
      description: product.description || '',
      additional_info: product.additional_info || {},
      is_best_seller: Boolean(product.is_best_seller),
      is_bundle: Boolean(product.is_bundle)
    });
    setFormError('');
    setIsDrawerOpen(true);
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
          setIsDrawerOpen(false);
          loadProducts();
        }
      } else {
        // Create product
        const res = await api.createProduct(formData);
        if (res.success) {
          addToast(`Product "${formData.name}" created successfully!`, 'success');
          setIsDrawerOpen(false);
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

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.SKU.toLowerCase().includes(search.toLowerCase()) ||
      (p.shape && p.shape.toLowerCase().includes(search.toLowerCase()));

    const matchesType = !filterType || p.product_type === filterType;
    const matchesStatus = !filterStatus || p.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="brand-line">Inventory & Catalog</span>
          <h1 className="font-heading" style={{ fontSize: '1.8rem', color: '#fff', margin: '0.25rem 0' }}>
            Product Management
          </h1>
        </div>

        <button onClick={openAddDrawer} className="btn btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="Search by name, SKU, shape..."
            className="form-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="">All Product Types</option>
            <option value="Handmade Press-On Nails">Handmade Press-On Nails</option>
            <option value="Nail Essentials">Nail Essentials</option>
          </select>

          <select
            className="form-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
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
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Thumbnail</th>
                  <th style={{ padding: '1rem' }}>Name / SKU</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Type / Shape</th>
                  <th style={{ padding: '1rem' }}>Stock</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
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
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', fontFamily: 'monospace' }}>{product.SKU}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {product.sale_price ? (
                            <div>
                              <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>${product.sale_price.toFixed(2)}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600, color: '#fff' }}>${(product.price || 0).toFixed(2)}</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ color: 'var(--text-primary)' }}>{product.product_type}</div>
                          {product.shape && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shape: {product.shape}</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ color: product.stock > 10 ? '#34d399' : product.stock > 0 ? '#fbbf24' : '#ef4444', fontWeight: 600 }}>
                            {product.stock} units
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className={`badge ${product.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => openEditDrawer(product)}
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

      {/* Add / Edit Sliding Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
        width="650px"
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
                <option value="Handmade Press-On Nails">Handmade Press-On Nails</option>
                <option value="Nail Essentials">Nail Essentials</option>
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
                <option value="Almond">Almond</option>
                <option value="Coffin">Coffin</option>
                <option value="Oval">Oval</option>
                <option value="Round">Round</option>
                <option value="Square">Square</option>
                <option value="Stiletto">Stiletto</option>
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

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label">Primary Image URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.images[0] || ''}
              onChange={e => {
                const newImages = [...formData.images];
                newImages[0] = e.target.value;
                setFormData({ ...formData, images: newImages });
              }}
              placeholder="https://images.unsplash.com/..."
            />
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

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Drawer>

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
