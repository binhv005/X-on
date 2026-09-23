import { productService } from '../services/productService.js';

export const getProducts = (req, res, next) => {
  try {
    const result = productService.getProducts(req.query);
    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
      total: result.total
    });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = productService.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const getProductById = (req, res, next) => {
  try {
    const { id } = req.params;
    const product = productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = (req, res, next) => {
  try {
    const newProduct = productService.createProduct(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = productService.updateProduct(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = productService.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
