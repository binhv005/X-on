import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, User, ArrowLeft, ArrowRight, MessageSquare,
  Clock, Check, Link2,
  Mail, ShoppingBag
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import './BlogDetailPage.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function estimateReadTime(post) {
  let words = 0;
  const count = (t) => (t ? String(t).trim().split(/\s+/).length : 0);
  words += count(post?.excerpt) + count(post?.title);
  if (Array.isArray(post?.content_blocks)) {
    post.content_blocks.forEach((b) => {
      words += count(b?.text) + count(b?.caption);
      if (Array.isArray(b?.items)) words += b.items.reduce((s, it) => s + count(it), 0);
    });
  }
  return Math.max(2, Math.round(words / 180) || 6);
}

function relativeTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  return formatDate(dateStr);
}

const AVATAR_COLORS = ['#a87b28', '#7c5cbf', '#2e7d6f', '#b84c32', '#38618c'];

function avatarColor(name = '', i = 0) {
  let h = i;
  for (let k = 0; k < name.length; k++) h = (h * 31 + name.charCodeAt(k)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function avatarInitial(name = '') {
  const t = name.trim();
  return t ? t[0].toUpperCase() : '?';
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { addToast } = useToast();

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getBlogPostBySlug(slug);
        if (res.success && res.data) setPost(res.data);
        // Related: lấy 3 bài khác slug hiện tại
        try {
          const list = await api.getBlogPosts();
          if (list.success && Array.isArray(list.data)) {
            setRelated(list.data.filter((p) => p.slug !== slug).slice(0, 3));
          }
        } catch { /* bỏ qua, vẫn hiện fallback */ }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const readTime = useMemo(() => (post ? estimateReadTime(post) : 6), [post]);

  const images = useMemo(() => {
    if (!post) return [];
    const imgs = [];
    if (post.cover) imgs.push({ url: post.cover, caption: '' });
    if (Array.isArray(post.content_blocks)) {
      post.content_blocks.forEach((b) => {
        if (b?.type === 'image' && b?.url) imgs.push({ url: b.url, caption: b.caption || '' });
      });
    }
    return imgs;
  }, [post]);

  const mainImage = images[0];
  // Chỉ dùng ảnh thật của bài viết (cover + ảnh trong content), không chèn ảnh mẫu
  const galleryImages = useMemo(() => images.map((i) => i.url), [images]);

  const tags = Array.isArray(post?.tags) ? post.tags : [];

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName || !commentText) {
      addToast('Please provide your name and comment.', 'error');
      return;
    }
    try {
      setCommentSubmitting(true);
      const res = await api.addBlogComment(slug, { name: commentName, email: commentEmail, comment: commentText });
      if (res.success) {
        addToast('Your comment has been posted!', 'success');
        setPost((prev) => ({ ...prev, comments: [...(prev.comments || []), res.data] }));
        setCommentName(''); setCommentEmail(''); setCommentText('');
      }
    } catch (err) {
      addToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast('Article link copied to clipboard!', 'success');
    } catch {
      addToast('Unable to copy link', 'error');
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Welcome to the X-ON Community!', 'success');
  };

  if (loading) return <LoadingSpinner text="Loading article..." />;

  if (!post) {
    return (
      <div className="section-py container" style={{ textAlign: 'center' }}>
        <h2 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Article Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The requested article does not exist or has been removed.</p>
        <Link to="/blog" className="btn btn-primary">Back to Journal</Link>
      </div>
    );
  }

  const comments = post.comments || [];

  return (
    <div className="bd-page">
      {/* ================= HERO — nền hero_blogdetail.png ================= */}
      <section className="bd-hero">
        <div className="bd-hero-inner">
          <Link to="/blog" className="bd-back">
            <ArrowLeft size={15} /> Back to All Articles
          </Link>
          <div className="bd-eyebrow">News & Editorial</div>
          <h1 className="bd-title">{post.title}</h1>
          <p className="bd-excerpt">
            {post.excerpt || 'From statement-making nail sets to everyday professional supplies, every X-ON product is chosen to make beautiful nails easier, faster, and more accessible — without compromising on a polished, luxury finish.'}
          </p>
          <div className="bd-meta">
            <span className="bd-meta-item"><Calendar size={14} /> {formatDate(post.publish_date)}</span>
            <span className="bd-meta-item"><User size={14} /> {post.author || 'X-ON Master Artist'}</span>
            <span className="bd-meta-item"><Clock size={14} /> {readTime} min read</span>
          </div>
        </div>
      </section>

      {/* ================= BODY 2 CỘT ================= */}
      <div className="bd-body">
        <div className="bd-layout">
          {/* ----- MAIN ----- */}
          <article className="bd-article">
            {Array.isArray(post.content_blocks) ? (
              post.content_blocks.map((block, idx) => {
                if (block.type === 'heading') {
                  // Heading đầu tiên dùng style mặc định, các heading sau cách đều
                  return <h2 key={idx}>{block.text}</h2>;
                }
                if (block.type === 'paragraph') {
                  return <p key={idx}>{block.text}</p>;
                }
                if (block.type === 'image') {
                  // Ảnh đầu tiên trong content sẽ ẩn ở đây vì đã dùng làm cover lớn bên dưới?
                  // -> Vẫn render large, nhưng nếu trùng cover thì bỏ qua để tránh lặp
                  if (idx > 0 && block.url === post.cover) return null;
                  return (
                    <div key={idx}>
                      <div className="bd-cover">
                        <img src={block.url} alt={block.caption || post.title} loading="lazy" />
                      </div>
                      {block.caption && <span className="bd-caption">{block.caption}</span>}
                    </div>
                  );
                }
                if (block.type === 'list') {
                  // List CMS: render gọn dạng checklist, không dùng dải nền kem
                  return (
                    <ul key={idx} className="bd-list">
                      {block.items.map((item, i) => (
                        <li key={i}>
                          <Check size={15} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === 'quote') {
                  return null;
                }
                return null;
              })
            ) : (
              <p>{post.excerpt}</p>
            )}

            {/* Cover lớn nếu content chưa có ảnh nào */}
            {images.length === 0 && mainImage && (
              <div className="bd-cover">
                <img src={mainImage.url} alt={post.title} />
              </div>
            )}

            {/* Gallery "A Closer Look" — chỉ ảnh thật của bài viết */}
            {galleryImages.length > 0 && (
              <>
                <h2>A Closer Look at the Design</h2>
                {post.excerpt && <p>{post.excerpt}</p>}
                <div className="bd-gallery">
                  {galleryImages.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={`${post.title} detail ${i + 1}`} loading="lazy" />
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* Tags — chỉ hiện khi bài viết có tags thật */}
            {tags.length > 0 && (
              <div className="bd-tags">
                <span className="bd-tags-label">Tags:</span>
                {tags.map((t) => (
                  <Link key={t} to="/blog" className="bd-tag">{t}</Link>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="bd-share">
              <span className="bd-share-label">Share:</span>
              <a className="bd-share-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook" style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                f
              </a>
              <a className="bd-share-btn" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Share on Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a className="bd-share-btn" href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" aria-label="Share on Pinterest" style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                P
              </a>
              <button className="bd-share-btn" onClick={handleShare} aria-label="Copy link">
                <Link2 size={15} />
              </button>
            </div>
          </article>

          {/* ----- SIDEBAR ----- */}
          <aside className="bd-sidebar">
            <div className="bd-card">
              <h3 className="bd-card-title">About the Author</h3>
              <div className="bd-author-top">
                {post.cover ? (
                  <img src={post.cover} alt={post.author} />
                ) : (
                  <span
                    aria-hidden="true"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      color: '#fff',
                      background: avatarColor(post.author)
                    }}
                  >
                    {avatarInitial(post.author)}
                  </span>
                )}
                <div>
                  <div className="bd-author-name">{post.author || 'X-ON Master Artist'}</div>
                </div>
              </div>
              <p className="bd-author-desc">
                With years of experience in nail artistry, our studio shares expert tips, design inspiration,
                and behind-the-scenes looks at our handmade collections.
              </p>
              <Link to="/blog" className="bd-btn-outline">
                View More Articles <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bd-card">
              <h3 className="bd-card-title">Related Articles</h3>
              {related.length > 0 ? related.map((r) => (
                <Link key={r.id || r.slug} to={`/blog/${r.slug}`} className="bd-related-item">
                  <span className="bd-related-thumb">
                    {r.cover ? (
                      <img src={r.cover} alt={r.title} loading="lazy" />
                    ) : (
                      <span className="bd-related-thumb-empty" aria-hidden="true" />
                    )}
                  </span>
                  <span>
                    <span className="bd-related-title">{r.title}</span>
                    <span className="bd-related-meta">{formatDate(r.publish_date)} &nbsp;|&nbsp; {estimateReadTime(r)} min read</span>
                  </span>
                </Link>
              )) : (
                <p style={{ fontSize: '0.84rem', color: '#7a756e' }}>More stories from our studio are on the way.</p>
              )}
            </div>

            <div className="bd-shop">
              <span className="bd-shop-eyebrow">SHOP</span>
              <h4 className="bd-shop-title">HANDMADE NAIL SETS</h4>
              <p className="bd-shop-desc">Discover more designs crafted with love.</p>
              <div className="bd-shop-row">
                <Link to="/shop" className="bd-btn-gold">
                  SHOP NOW <ArrowRight size={14} />
                </Link>
                <span className="bd-shop-script">Pressed<br />to Impress ♡</span>
              </div>
            </div>

            <div className="bd-news">
              <div className="bd-news-title">
                <ShoppingBag size={18} /> Join the X-ON Community
              </div>
              <p>Get the latest nail trends, new collections, and exclusive tips straight to your inbox.</p>
              {subscribed ? (
                <div className="bd-news-success">Welcome to the community! Please check your inbox.</div>
              ) : (
                <form className="bd-news-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                  />
                  <button type="submit" className="bd-btn-gold">
                    SUBSCRIBE <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ================= COMMENTS ================= */}
      <div className="bd-comments">
        <div className="bd-comments-inner">
          <h3 className="bd-comments-title">
            <MessageSquare size={18} /> Comments ({comments.length})
          </h3>

          {comments.length > 0 ? comments.map((c, i) => (
            <div key={c.id || i} className="bd-comment">
              <span
                aria-hidden="true"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: '#fff',
                  background: avatarColor(c.name, i)
                }}
              >
                {avatarInitial(c.name)}
              </span>
              <div>
                <span className="bd-comment-name">{c.name}</span>
                <span className="bd-comment-time">{relativeTime(c.date)}</span>
                <p className="bd-comment-text">{c.comment}</p>
                <button className="bd-comment-reply" onClick={() => document.getElementById('bd-reply')?.focus()}>
                  Reply
                </button>
              </div>
            </div>
          )) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              No comments yet. Share your thoughts below!
            </p>
          )}

          <div className="bd-comment-form-card">
            <h4>Leave a Reply</h4>
            <form onSubmit={handleCommentSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input type="text" className="form-input" value={commentName} onChange={(e) => setCommentName(e.target.value)} placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email (optional)</label>
                  <input type="email" className="form-input" value={commentEmail} onChange={(e) => setCommentEmail(e.target.value)} placeholder="Your email address" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Comment *</label>
                <textarea id="bd-reply" rows="4" className="form-textarea" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Join the discussion..." required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={commentSubmitting}>
                {commentSubmitting ? 'Posting...' : (<><Mail size={14} /> Post Comment</>)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
