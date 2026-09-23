import { db } from '../config/db.js';

export const getBlogPosts = (req, res, next) => {
  try {
    const { status, all } = req.query;
    let posts = db.getCollection('blogPosts');
    if (status) {
      posts = posts.filter(p => p.status === status);
    } else if (all !== 'true') {
      posts = posts.filter(p => p.status === 'published');
    }
    posts.sort((a, b) => new Date(b.publish_date || b.createdAt) - new Date(a.publish_date || a.createdAt));
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

export const getBlogPostBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = db.findOne('blogPosts', p => p.slug === slug || p.id === slug);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const createBlogPost = (req, res, next) => {
  try {
    const { title, slug, cover, publish_date, author, excerpt, content_blocks, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const calculatedSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

    const newPost = db.insert('blogPosts', {
      title,
      slug: calculatedSlug,
      cover: cover || 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
      publish_date: publish_date || new Date().toISOString().split('T')[0],
      author: author || 'X-ON Team',
      excerpt: excerpt || '',
      content_blocks: Array.isArray(content_blocks) ? content_blocks : [],
      status: status || 'published',
      comments: []
    });

    res.status(201).json({ success: true, message: 'Blog post created successfully', data: newPost });
  } catch (err) {
    next(err);
  }
};

export const updateBlogPost = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = db.update('blogPosts', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, message: 'Blog post updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteBlogPost = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('blogPosts', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const addComment = (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, email, comment } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Name and comment are required' });
    }
    const post = db.findOne('blogPosts', p => p.slug === slug || p.id === slug);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    if (!Array.isArray(post.comments)) post.comments = [];
    const newComment = {
      id: `comm_${Date.now()}`,
      name: name.trim(),
      email: email ? email.trim() : '',
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    post.comments.push(newComment);
    db.save();
    res.status(201).json({ success: true, message: 'Comment submitted successfully', data: newComment });
  } catch (err) {
    next(err);
  }
};
