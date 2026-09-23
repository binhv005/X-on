import { db } from '../config/db.js';

class WholesaleRepository {
  getAll() {
    return db.getCollection('wholesaleApplications');
  }

  findById(id) {
    return db.findById('wholesaleApplications', id);
  }

  create(data) {
    return db.insert('wholesaleApplications', data);
  }

  update(id, updates) {
    return db.update('wholesaleApplications', id, updates);
  }
}

export const wholesaleRepository = new WholesaleRepository();
