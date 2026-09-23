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
    if (!sku) return null;
    return db.findOne('products', p => p.SKU && p.SKU.toLowerCase() === sku.toString().trim().toLowerCase());
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
