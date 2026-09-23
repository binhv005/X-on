import { db } from '../config/db.js';

export const getCategories = (req, res, next) => {
  try {
    const { type } = req.query;
    let categories = db.getCollection('categories');
    if (type) {
      categories = categories.filter(c => c.type === type);
    }
    categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = (req, res, next) => {
  try {
    const { name, slug, type, sort_order, status } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type are required' });
    }
    const newCat = db.insert('categories', {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      type,
      sort_order: parseInt(sort_order, 10) || 0,
      status: status || 'active'
    });
    res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    next(err);
  }
};
