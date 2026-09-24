import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, ArrowRight, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './BlogPage.css';

const PAGE_SIZE = 6;

function estimateReadTime(post) {
  let words = 0;
  const count = (t) => (t ? t.trim().split(/\s+/).length : 0);
  words += count(post?.excerpt);
  words += count(post?.title);
  if (Array.isArray(post?.content_blocks)) {
    post.content_blocks.forEach((b) => {
      words += count(b?.text);
      words += count(b?.caption);
      if (Array.isArray(b?.items)) words += b.items.reduce((s, it) => s + count(it), 0);
    });
  }
  return Math.max(2, Math.round(words / 180) || 4);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr).toUpperCase();
  return d
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    .toUpperCase()
    .replace(',', '');
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadBlog() {
      try {
        setLoading(true);
        const res = await api.getBlogPosts();
        if (res.success && res.data) setPosts(res.data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, []);

  const enriched = useMemo(
    () => posts.map((p) => ({ ...p, _read: estimateReadTime(p) })),
    [posts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return enriched;
    return enriched.filter((p) =>
      p.title?.toLowerCase().includes(q) ||
      p.excerpt?.toLowerCase().includes(q) ||
      p.author?.toLowerCase().includes(q)
    );
  }, [enriched, search]);

  // reset page khi đổi search
  useEffect(() => {
    setPage(1);
  }, [search]);

  const isDefaultView = !search.trim() && page === 1;
  const featured = isDefaultView ? filtered[0] : null;
  const gridSource = featured ? filtered.slice(1) : filtered;

  const totalPages = Math.max(1, Math.ceil(gridSource.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = gridSource.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return <LoadingSpinner text="Loading X-ON beauty & nail articles..." />;
  }

  return (
    <div className="blog-page">
      {/* ===== HERO — nền blog_hero.webp ===== */}
      <section className="blog-hero">
        <div className="blog-hero-inner">
          <span className="blog-eyebrow">
            <Sparkles size={14} /> News & Editorial
          </span>
          <h1 className="blog-hero-title">
            The X-ON Nail &<br /> Artistry Journal
          </h1>
          <p className="blog-hero-sub">
            Masterclasses, styling forecasts, nail care guides, and insider
            artisan craftsmanship updates from our Kissimmee studio.
          </p>
          <div className="blog-hero-tag">
            <span>Press on. More possibilities.</span>
          </div>
        </div>
      </section>

      <div className="blog-body">
        {/* ===== SEARCH ===== */}
        <div className="blog-toolbar">
          <div className="blog-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
            />
          </div>
        </div>

        {/* ===== FEATURED ===== */}
        {featured && (
          <article className="blog-featured">
            <Link to={`/blog/${featured.slug}`} className="blog-featured-media">
              <span className="blog-badge-featured">FEATURED</span>
              <img src={featured.cover} alt={featured.title} />
            </Link>
            <div className="blog-featured-content">
              <Link to={`/blog/${featured.slug}`}>
                <h2 className="blog-featured-title">{featured.title}</h2>
              </Link>
              <p className="blog-featured-excerpt">
                {featured.excerpt || 'Explore the latest press-on nail artistry, styling forecasts and studio stories.'}
              </p>
              <div className="blog-featured-foot">
                <Link to={`/blog/${featured.slug}`} className="blog-btn-outline">
                  Read Full Story <ArrowRight size={14} />
                </Link>
                <span className="blog-meta">
                  {formatDate(featured.publish_date)} &nbsp;|&nbsp; {featured._read} min read
                </span>
              </div>
            </div>
          </article>
        )}

        {/* ===== GRID ===== */}
        {paged.length > 0 ? (
          <div className="blog-grid">
            {paged.map((post) => (
              <article key={post.id} className="blog-card">
                <Link to={`/blog/${post.slug}`} className="blog-card-media">
                  <img src={post.cover} alt={post.title} loading="lazy" />
                </Link>
                <div className="blog-card-body">
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="blog-card-title">{post.title}</h3>
                  </Link>
                  <p className="blog-card-excerpt">
                    {post.excerpt || 'Read the full story from our Kissimmee studio...'}
                  </p>
                  <div className="blog-card-foot">
                    <span className="blog-meta">
                      {formatDate(post.publish_date)} &nbsp;|&nbsp; {post._read} min read
                    </span>
                    <Link to={`/blog/${post.slug}`} className="blog-circle-btn" aria-label="Read article">
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>No articles found</p>
            <p style={{ fontSize: '0.88rem' }}>Try a different keyword.</p>
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="blog-pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`blog-page-btn ${safePage === i + 1 ? 'active' : ''}`}
                onClick={() => { setPage(i + 1); window.scrollTo({ top: 380, behavior: 'smooth' }); }}
              >
                {i + 1}
              </button>
            ))}
            {safePage < totalPages && (
              <button
                className="blog-page-btn"
                onClick={() => { setPage(safePage + 1); window.scrollTo({ top: 380, behavior: 'smooth' }); }}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
        {/* luôn hiển thị cụm pagination kiểu mẫu khi chỉ có 1 trang (cho đẹp như design) */}
        {totalPages === 1 && filtered.length > 0 && (
          <div className="blog-pagination">
            <button className="blog-page-btn active">1</button>
            <button className="blog-page-btn" onClick={() => {}} aria-hidden>2</button>
            <button className="blog-page-btn" onClick={() => {}} aria-hidden>3</button>
            <button className="blog-page-btn" aria-label="Next">
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
