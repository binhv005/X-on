import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, MessageSquare, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { addToast } = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comment state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const res = await api.getBlogPostBySlug(slug);
        if (res.success && res.data) {
          setPost(res.data);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName || !commentText) {
      addToast('Please provide your name and comment.', 'error');
      return;
    }

    try {
      setCommentSubmitting(true);
      const res = await api.addBlogComment(slug, {
        name: commentName,
        email: commentEmail,
        comment: commentText
      });

      if (res.success) {
        addToast('Your comment has been posted!', 'success');
        setPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), res.data]
        }));
        setCommentName('');
        setCommentEmail('');
        setCommentText('');
      }
    } catch (err) {
      addToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading article..." />;
  }

  if (!post) {
    return (
      <div className="section-py container" style={{ textAlign: 'center' }}>
        <h2 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Article Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The requested article does not exist or has been removed.</p>
        <Link to="/blog" className="btn btn-primary">Back to Journal</Link>
      </div>
    );
  }

  return (
    <div className="section-py" style={{ paddingTop: '2.5rem' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Back Link */}
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-light)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to All Articles
        </Link>

        {/* Article Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> {post.publish_date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} /> {post.author || 'X-ON Master Artist'}
            </span>
          </div>

          <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '1.5rem' }}>
            {post.title}
          </h1>

          {/* Featured Cover Image */}
          <div style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-medium)',
            position: 'relative',
            paddingTop: '55%',
            marginBottom: '2.5rem'
          }}>
            <img
              src={post.cover}
              alt={post.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </header>

        {/* Article Body - Dynamic Content Blocks */}
        <div style={{
          color: 'var(--text-primary)',
          fontSize: '1.05rem',
          lineHeight: 1.85,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          marginBottom: '4rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '3rem'
        }}>
          {post.content_blocks && Array.isArray(post.content_blocks) ? (
            post.content_blocks.map((block, idx) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={idx} className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.6rem', marginTop: '1rem' }}>
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'paragraph') {
                return <p key={idx} style={{ color: 'var(--text-secondary)' }}>{block.text}</p>;
              }
              if (block.type === 'image') {
                return (
                  <div key={idx} style={{ margin: '1rem 0' }}>
                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img src={block.url} alt={block.caption || ''} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
                    </div>
                    {block.caption && (
                      <span style={{ display: 'block', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        {block.caption}
                      </span>
                    )}
                  </div>
                );
              }
              if (block.type === 'list') {
                return (
                  <ul key={idx} style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: '0.5rem' }}>
                    {block.items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                        <Sparkles size={15} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>{post.excerpt || 'Article content'}</p>
          )}
        </div>

        {/* Comments Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <MessageSquare size={22} color="var(--accent-gold)" />
            <h3 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.4rem' }}>
              Discussion ({post.comments?.length || 0})
            </h3>
          </div>

          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
              {post.comments.map(c => (
                <div key={c.id} style={{
                  padding: '1.5rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--accent-gold-light)' }}>{c.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.date}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{c.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>No comments yet. Share your thoughts below!</p>
          )}

          {/* Add Comment Form */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem'
          }}>
            <h4 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>
              Leave a Reply
            </h4>
            <form onSubmit={handleCommentSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email (optional)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={commentEmail}
                    onChange={e => setCommentEmail(e.target.value)}
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Comment *</label>
                <textarea
                  rows="4"
                  className="form-textarea"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Join the discussion..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={commentSubmitting}
              >
                {commentSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
