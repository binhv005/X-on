import { db } from '../config/db.js';

class BlogRepository {
  getAll() {
    return db.getCollection('blogPosts');
  }

  findBySlug(slug) {
    return db.findOne('blogPosts', p => p.slug === slug || p.id === slug);
  }

  findById(id) {
    return db.findById('blogPosts', id);
  }

  create(data) {
    return db.insert('blogPosts', data);
  }

  update(id, updates) {
    return db.update('blogPosts', id, updates);
  }

  delete(id) {
    return db.delete('blogPosts', id);
  }

  save() {
    db.save();
  }
}

export const blogRepository = new BlogRepository();
