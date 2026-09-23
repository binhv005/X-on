import { db } from '../config/db.js';

class ReviewRepository {
  getAll() {
    return db.getCollection('reviews');
  }

  findByProductId(productId) {
    return db.find('reviews', r => r.product_id === productId);
  }

  create(data) {
    return db.insert('reviews', data);
  }
}

export const reviewRepository = new ReviewRepository();
