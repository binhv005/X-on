import { blogService } from '../services/blogService.js';

export const getBlogPosts = (req, res, next) => {
  try {
    const posts = blogService.getBlogPosts(req.query);
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

export const getBlogPostBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = blogService.getBlogPostBySlug(slug);
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
    const newPost = blogService.createBlogPost(req.body);
    res.status(201).json({ success: true, message: 'Blog post created successfully', data: newPost });
  } catch (err) {
    next(err);
  }
};

export const updateBlogPost = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = blogService.updateBlogPost(id, req.body);
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
    const deleted = blogService.deleteBlogPost(id);
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
    const newComment = blogService.addComment(slug, req.body);
    if (!newComment) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.status(201).json({ success: true, message: 'Comment submitted successfully', data: newComment });
  } catch (err) {
    next(err);
  }
};
