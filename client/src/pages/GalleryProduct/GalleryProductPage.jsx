import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/pagination/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function GalleryProductPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 9 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const res = await api.getGalleryItems({
          collection: 'Now Selling',
          page,
          limit: 9
        });
        if (res.success) {
          setItems(res.data);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        console.error('Error fetching product gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [page]);

  if (loading) {
    return <LoadingSpinner text="Loading X-ON Product Gallery..." />;
  }

  return (
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Header Hero */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> Visual Showcase
          </span>
          <h1 className="section-title">Now Selling — Product Gallery</h1>
          <p className="section-subtitle">
            Immerse yourself in our handcrafted wearable art gallery. Discover real studio lighting captures and high-definition details of current active collections.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/shop" className="btn btn-primary">
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Gallery Visual Grid */}
        <div className="grid-3">
          {items.map(item => {
            const productLink = item.linked_product_details?.slug
              ? `/product/${item.linked_product_details.slug}`
              : `/product/${item.linked_product || 'cf-35-0961-luxury-chrome-velvet'}`;

            return (
              <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Visual Media */}
                <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                  <img
                    src={item.media}
                    alt={item.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Size labels overlay */}
                  {item.size_labels && item.size_labels.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      left: '0.75rem',
                      display: 'flex',
                      gap: '0.35rem',
                      zIndex: 2
                    }}>
                      {item.size_labels.map(size => (
                        <span
                          key={size}
                          style={{
                            padding: '2px 8px',
                            background: 'rgba(10, 10, 12, 0.85)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'var(--accent-gold-light)'
                          }}
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {item.collection || 'Now Selling'}
                    </span>
                    <h3 className="font-heading" style={{ fontSize: '1.1rem', color: '#fff', margin: '0.4rem 0 0.75rem 0' }}>
                      {item.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                    {item.linked_product_details ? (
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        ${(item.linked_product_details.sale_price || item.linked_product_details.price).toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Handmade Edition</span>
                    )}

                    <Link to={productLink} className="btn btn-outline btn-sm">
                      <Eye size={13} /> View Design
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => { setPage(p); window.scrollTo({ top: 150, behavior: 'smooth' }); }}
        />
      </div>
    </div>
  );
}
