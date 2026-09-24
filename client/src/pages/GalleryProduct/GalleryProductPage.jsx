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

  const smoothScrollTo = (targetPosition, duration = 1000) => {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    // Ease-in-out cubic: chuyển động nhẹ nhàng từ tốn lúc bắt đầu, êm ái khi dừng
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      } else {
        document.documentElement.style.scrollBehavior = prevScrollBehavior;
      }
    };

    requestAnimationFrame(step);
  };

  const scrollToGallery = () => {
    const el = document.getElementById('gallery-showcase');
    if (el) {
      const headerOffset = 72; // Chiều cao Header cố định
      const elementPosition = el.getBoundingClientRect().top;
      const targetY = elementPosition + (window.pageYOffset || document.documentElement.scrollTop) - headerOffset;
      smoothScrollTo(targetY, 1000);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    scrollToGallery();
  };

  if (loading) {
    return <LoadingSpinner text="Loading X-ON Product Gallery..." />;
  }

  return (
    <div className="gp">
      {/* ===== 1. HERO — nền gallery.webp (chiếm vừa 1 màn hình) ===== */}
      <section className="gp-hero">
        <div className="gp-container gp-hero-grid">
          <div className="gp-hero-content">
            <span className="gp-eyebrow">
              <Sparkles size={13} /> Visual Showcase
            </span>
            <h1 className="gp-title">
              Product Gallery
            </h1>
            <p className="gp-desc">
              Discover our handcrafted wearable nail art, captured in authentic studio light and fine detail.
            </p>
            <div className="gp-hero-actions">
              <Link to="/shop" className="gp-btn-gold">
                Shop Now <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                onClick={scrollToGallery}
                className="gp-btn-ghost"
              >
                Explore Gallery
              </button>
            </div>
            <div className="gp-hero-pills">
              <span className="gp-pill">100% Handcrafted</span>
              <span className="gp-pill-dot">•</span>
              <span className="gp-pill">Studio Lighting</span>
              <span className="gp-pill-dot">•</span>
              <span className="gp-pill">True-to-Life Details</span>
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

        {/* Nút chỉ dẫn cuộn xuống gallery */}
        <button
          type="button"
          onClick={scrollToGallery}
          className="gp-scroll-indicator"
          aria-label="Scroll to gallery"
        >
          <span>Scroll to explore</span>
          <ChevronDown size={14} className="gp-bounce" />
        </button>
      </section>

      {/* ===== 2. BODY ===== */}
      <div className="gp-container gp-body" id="gallery-showcase" style={{ scrollMarginTop: '84px' }}>
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
                      <img
                        src={item.media || '/assets/images/IMG_7098.webp'}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/IMG_7098.webp';
                        }}
                      />
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
      </div>

      {/* ===== 4. QUOTE BANNER — Tràn 100% full-width không có khoảng trống 2 bên ===== */}
      <div className="gp-quote">
        <p>&ldquo; More Nails, More Possibilities &rdquo;</p>
        <span>— &nbsp;X - O N&nbsp; —</span>
      </div>

      {/* ===== 5. TRUST STRIP ===== */}
      <div className="gp-container" style={{ marginTop: '2.5rem' }}>
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
      </div>
    </div>
  );
}
