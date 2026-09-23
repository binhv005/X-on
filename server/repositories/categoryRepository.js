import { db } from '../config/db.js';

class CategoryRepository {
  getAll(filterType) {
    let categories = db.getCollection('categories');
    if (filterType) {
      categories = categories.filter(c => c.type === filterType);
    }
    return [...categories].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  create(data) {
    return db.insert('categories', data);
  }
}

export const categoryRepository = new CategoryRepository();
