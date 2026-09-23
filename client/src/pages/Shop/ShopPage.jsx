import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import FilterSidebar from '../../components/product/FilterSidebar';
import Pagination from '../../components/pagination/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedShape, setSelectedShape] = useState(searchParams.get('shape') || '');
  const [selectedProductType, setSelectedProductType] = useState(searchParams.get('product_type') || '');
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get('theme') || '');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL query params with state
  useEffect(() => {
    const qProductType = searchParams.get('product_type');
    const qTheme = searchParams.get('theme');
    const qShape = searchParams.get('shape');
    const qSearch = searchParams.get('search');
    
    if (qProductType !== null) setSelectedProductType(qProductType);
    if (qTheme !== null) setSelectedTheme(qTheme);
    if (qShape !== null) setSelectedShape(qShape);
    if (qSearch !== null) setSearch(qSearch);
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12
        };
        if (search) params.search = search;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (selectedShape) params.shape = selectedShape;
        if (selectedProductType) params.product_type = selectedProductType;
        if (selectedTheme) params.theme = selectedTheme;
        if (sort && sort !== 'featured') params.sort = sort;

        const res = await api.getProducts(params);
        if (res.success) {
          setProducts(res.data);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProducts();
    }, 150);

    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, selectedShape, selectedProductType, selectedTheme, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedShape('');
    setSelectedProductType('');
    setSelectedTheme('');
    setSort('featured');
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="section-py" style={{ paddingTop: '3rem' }}>
      <div className="container">
        {/* Page Title & Breadcrumb */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={15} /> X-ON Artisan Collection
          </span>
          <h1 className="section-title">
            {selectedProductType ? (selectedProductType === 'best-sellers' || selectedProductType === 'Best Sellers' ? 'Best Sellers' : selectedProductType) : 'Shop All Handcrafted Nails & Essentials'}
          </h1>
          <p className="section-subtitle">
            Explore salon-grade handmade press-on nails, shape silhouettes, and professional application essentials.
          </p>
        </div>

        {/* Toolbar (Search, Filter toggle, Sorting) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem 1.5rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem'
        }}>
          {/* Live Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search by name, SKU, shape..."
              className="form-input"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Filter Button */}
            <button
              className="btn btn-secondary btn-sm mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sort By:</span>
              <select
                className="form-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="featured">Featured / Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetical: A-Z</option>
                <option value="rating_desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar + Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }} className="shop-layout">
          {/* Desktop Filter Sidebar */}
          <aside className="shop-sidebar">
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
              selectedProductType={selectedProductType}
              setSelectedProductType={setSelectedProductType}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Products Column */}
          <div>
            {loading ? (
              <LoadingSpinner text="Loading products..." />
            ) : products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Sparkles size={36} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
                <h3 className="font-heading" style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  No Products Found
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Try adjusting your price range or clearing active shape/theme filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Showing {products.length} of {pagination.total} products
                </div>

                <div className="grid-3">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setMobileFilterOpen(false)}>
          <div style={{
            width: '100%',
            maxWidth: '340px',
            height: '100%',
            background: 'var(--bg-secondary)',
            padding: '1.5rem',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-heading" style={{ color: '#fff', fontSize: '1.2rem' }}>Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="btn btn-secondary btn-sm">Close</button>
            </div>
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
              selectedProductType={selectedProductType}
              setSelectedProductType={setSelectedProductType}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              onReset={handleResetFilters}
            />
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 960px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .shop-sidebar {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
