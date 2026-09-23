import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Eye,
  Heart,
  Camera,
  Gem,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Crown,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/pagination/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './GalleryProductPage.css';

export default function GalleryProductPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const res = await api.getGalleryItems({ page, limit: 12 });
        if (res.success && res.data) {
          setItems(res.data);
          if (res.pagination) setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Error fetching product gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [page]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.collection?.toLowerCase().includes(q)
      );
    }
    if (selectedCollection !== 'all') result = result.filter((item) => item.collection === selectedCollection);

    return result;
  }, [items, searchQuery, selectedCollection]);

  // Collection options lấy từ dữ liệu thật, không fix cứng
  const collectionOptions = useMemo(() => {
    const set = new Set(items.map((i) => i.collection).filter(Boolean));
    return ['all', ...set];
  }, [items]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 420, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner text="Loading X-ON Product Gallery..." />;
  }

  return (
    <div className="gp">
      {/* ===== 1. HERO — nền gallery.png ===== */}
      <section className="gp-hero">
        <div className="gp-container gp-hero-grid">
          <div>
            <span className="gp-eyebrow">
              <Sparkles size={14} /> Visual Showcase
            </span>
            <h1 className="gp-title">
              Now Selling —<br />
              Product Gallery
            </h1>
            <p className="gp-desc">
              Immerse yourself in our handcrafted wearable art gallery. Discover real studio lighting
              captures and high-definition details of current active collections.
            </p>
            <div style={{ marginBottom: '0.4rem' }}>
              <Link to="/shop" className="gp-btn-gold">
                Shop Now <ArrowRight size={15} />
              </Link>
            </div>
            <div className="gp-hero-feats">
              <div className="gp-feat">
                <Heart size={20} strokeWidth={1.75} />
                <span className="gp-feat-text">
                  Handmade
                  <br />
                  With Love
                </span>
              </div>
              <div className="gp-feat">
                <Camera size={20} strokeWidth={1.75} />
                <span className="gp-feat-text">
                  Studio Lighting
                  <br />
                  Photos
                </span>
              </div>
              <div className="gp-feat">
                <Gem size={20} strokeWidth={1.75} />
                <span className="gp-feat-text">
                  Real Designs,
                  <br />
                  Real Details
                </span>
              </div>
            </div>
          </div>

          {/* Cụm overlay đè lên hộp nail trong ảnh nền */}
          <div className="gp-hero-visual" aria-hidden="true">
            <div className="gp-stamp">
              <small>HANDCRAFTED</small>
              <strong>X-ON</strong>
              <small>COLLECTION</small>
            </div>
            <div className="gp-script">
              Nail Art
              <br />
              Beyond Beauty
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. BODY ===== */}
      <div className="gp-container gp-body">
        <div className="gp-crumb">
          <Link to="/">Home</Link>
          <span className="sep">›</span>
          <span className="cur">Gallery</span>
        </div>

        {/* Toolbar filter đúng mẫu */}
        <div className="gp-toolbar">
          <div className="gp-search">
            <Search size={16} color="#8c857b" />
            <input
              type="text"
              placeholder="Search designs, styles, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="gp-select-wrap">
            <select value={selectedCollection} onChange={(e) => setSelectedCollection(e.target.value)}>
              <option value="all">All Collections</option>
              {collectionOptions.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={15} color="#8a847c" />
          </div>

          <div className="gp-view-toggle">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`gp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`gp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* ===== 3. GRID 4 CỘT ===== */}
        {filteredItems.length === 0 ? (
          <div className="gp-empty">
            No designs found matching your filter criteria. Try clearing search filters.
          </div>
        ) : (
          <>
            <div className="gp-count">
              Showing {filteredItems.length} of {pagination.total || items.length} designs
            </div>
            <div className={`gp-grid ${viewMode === 'list' ? 'list' : ''}`}>
              {filteredItems.map((item) => {
                const productSlug =
                  item.linked_product_details?.slug || 'cf-35-0961-luxury-chrome-velvet';
                const isFav = Boolean(favorites[item.id]);

                return (
                  <article key={item.id} className="gp-card">
                    <div className="gp-media">
                      <img src={item.media} alt={item.title} loading="lazy" />
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        className="gp-fav"
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart
                          size={15}
                          color={isFav ? '#e63946' : '#524e47'}
                          fill={isFav ? '#e63946' : 'transparent'}
                        />
                      </button>
                    </div>

                    <div className="gp-info">
                      <div>
                        <h3 className="gp-name">{item.title}</h3>
                        {Array.isArray(item.size_labels) && item.size_labels.length > 0 && (
                          <div className="gp-sizes" aria-label="Available sizes">
                            <span className="gp-sizes-label">Sizes:</span>
                            {item.size_labels.map((s) => (
                              <span key={s} className="gp-size">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Link to={`/product/${productSlug}`} className="gp-view">
                        <Eye size={14} /> View Design
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <Pagination
              currentPage={pagination.page || page}
              totalPages={pagination.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* ===== 4. TRUST STRIP ===== */}
        <div className="gp-trust">
          <div className="gp-trust-item">
            <span className="gp-trust-ico">
              <Crown size={22} strokeWidth={1.8} />
            </span>
            <div>
              <strong>Curated Collections</strong>
              <span>Fresh designs added regularly</span>
            </div>
          </div>
          <div className="gp-trust-item">
            <span className="gp-trust-ico">
              <Truck size={22} strokeWidth={1.8} />
            </span>
            <div>
              <strong>Global Shipping</strong>
              <span>Beauty delivered worldwide</span>
            </div>
          </div>
          <div className="gp-trust-item">
            <span className="gp-trust-ico">
              <ShieldCheck size={22} strokeWidth={1.8} />
            </span>
            <div>
              <strong>Trusted by Professionals</strong>
              <span>Salon-grade quality you can trust</span>
            </div>
          </div>
        </div>

        {/* ===== 5. QUOTE BANNER ===== */}
        <div className="gp-quote">
          <p>&ldquo; More Nails, More Possibilities &rdquo;</p>
          <span>— &nbsp;X - O N&nbsp; —</span>
        </div>
      </div>
    </div>
  );
}
