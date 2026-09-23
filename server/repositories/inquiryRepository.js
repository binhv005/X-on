import { db } from '../config/db.js';

class InquiryRepository {
  getAll() {
    return db.getCollection('inquiries');
  }

  findById(id) {
    return db.findById('inquiries', id);
  }

  create(data) {
    return db.insert('inquiries', data);
  }

  update(id, updates) {
    return db.update('inquiries', id, updates);
  }
}

export const inquiryRepository = new InquiryRepository();
