import { db } from '../config/db.js';

class UserRepository {
  getAll() {
    return db.getCollection('users');
  }

  findById(id) {
    return db.findById('users', id);
  }

  findByEmailOrUsername(query) {
    const q = query.trim().toLowerCase();
    return db.findOne('users', u => u.email.toLowerCase() === q || (u.username && u.username.toLowerCase() === q));
  }

  findByEmail(email) {
    return db.findOne('users', u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  create(data) {
    return db.insert('users', data);
  }

  update(id, updates) {
    return db.update('users', id, updates);
  }
}

export const userRepository = new UserRepository();
