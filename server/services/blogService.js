import { blogRepository } from '../repositories/blogRepository.js';

class BlogService {
  getBlogPosts(filters = {}) {
    const { status, all } = filters;
    let posts = blogRepository.getAll();

    if (status) {
      posts = posts.filter(p => p.status === status);
    } else if (all !== 'true') {
      posts = posts.filter(p => p.status === 'published');
    }

    return [...posts].sort((a, b) => new Date(b.publish_date || b.createdAt) - new Date(a.publish_date || a.createdAt));
  }

  getBlogPostBySlug(slug) {
    return blogRepository.findBySlug(slug);
  }

  createBlogPost(data) {
    const { title, slug, cover, publish_date, author, excerpt, content_blocks, status } = data;
    if (!title) {
      throw new Error('Title is required');
    }

    const calculatedSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

    return blogRepository.create({
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
  }

  updateBlogPost(id, data) {
    return blogRepository.update(id, data);
  }

  deleteBlogPost(id) {
    return blogRepository.delete(id);
  }

  addComment(slug, commentData) {
    const { name, email, comment } = commentData;
    if (!name || !comment) {
      throw new Error('Name and comment are required');
    }

    const post = blogRepository.findBySlug(slug);
    if (!post) {
      return null;
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
    blogRepository.save();
    return newComment;
  }
}

export const blogService = new BlogService();
