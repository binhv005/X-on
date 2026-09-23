import { categoryRepository } from '../repositories/categoryRepository.js';

class CategoryService {
  getCategories(type) {
    return categoryRepository.getAll(type);
  }

  createCategory(data) {
    const { name, slug, type, sort_order, status } = data;
    if (!name || !type) {
      throw new Error('Name and type are required');
    }
    return categoryRepository.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      type,
      sort_order: parseInt(sort_order, 10) || 0,
      status: status || 'active'
    });
  }
}

export const categoryService = new CategoryService();
