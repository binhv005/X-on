import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, User, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        setLoading(true);
        const res = await api.getBlogPosts();
        if (res.success && res.data) {
          setPosts(res.data);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading X-ON beauty & nail articles..." />;
  }

  return (
    <div className="section-py" style={{ paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Header Hero */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="brand-line" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> News & Editorial
          </span>
          <h1 className="section-title">The X-ON Nail & Artistry Journal</h1>
          <p className="section-subtitle">
            Masterclasses, styling forecasts, nail care guides, and insider artisan craftsmanship updates from our Kissimmee studio.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid-3">
          {posts.map(post => (
            <article key={post.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Cover Image */}
              <Link to={`/blog/${post.slug}`} style={{ display: 'block', position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                <img
                  src={post.cover}
                  alt={post.title}
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
              </Link>

              {/* Meta & Excerpt */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {post.publish_date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={13} /> {post.author || 'X-ON Team'}
                    </span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                      marginBottom: '0.75rem'
                    }}>
                      {post.title}
                    </h3>
                  </Link>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.excerpt || (post.content_blocks && post.content_blocks[1]?.text) || 'Read the full story...'}
                  </p>
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="btn btn-outline btn-sm"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
