import { categoryService } from '../services/categoryService.js';

export const getCategories = (req, res, next) => {
  try {
    const { type } = req.query;
    const categories = categoryService.getCategories(type);
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = (req, res, next) => {
  try {
    const newCat = categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    next(err);
  }
};
