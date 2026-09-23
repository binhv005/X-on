import { db } from '../config/db.js';

class OrderRepository {
  getAll() {
    return db.getCollection('orders');
  }

  findById(id) {
    return db.findById('orders', id);
  }

  create(data) {
    return db.insert('orders', data);
  }

  update(id, updates) {
    return db.update('orders', id, updates);
  }
}

export const orderRepository = new OrderRepository();
