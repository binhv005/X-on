import { db } from '../config/db.js';

class ProductRepository {
  getAll() {
    return db.getCollection('products');
  }

  findById(id) {
    return db.findById('products', id);
  }

  findBySlug(slug) {
    return db.findOne('products', p => p.slug === slug || p.id === slug);
  }

  findBySKU(sku) {
    return db.findOne('products', p => p.SKU.toLowerCase() === sku.trim().toLowerCase());
  }

  create(data) {
    return db.insert('products', data);
  }

  update(id, updates) {
    return db.update('products', id, updates);
  }

  delete(id) {
    return db.delete('products', id);
  }
}

export const productRepository = new ProductRepository();
