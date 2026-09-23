import { db } from '../config/db.js';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export const getProducts = (req, res, next) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      shape,
      product_type,
      theme,
      is_bundle,
      is_best_seller,
      sort,
      page = 1,
      limit = 12,
      all // For admin table without pagination limit
    } = req.query;

    let products = db.getCollection('products');

    // Filter by search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.SKU && p.SKU.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.shape && p.shape.toLowerCase().includes(q))
      );
    }

    // Filter by Price range
    if (minPrice !== undefined && minPrice !== '') {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        products = products.filter(p => {
          const effectivePrice = p.sale_price !== null && p.sale_price !== undefined ? p.sale_price : p.price;
          return effectivePrice >= min;
        });
      }
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        products = products.filter(p => {
          const effectivePrice = p.sale_price !== null && p.sale_price !== undefined ? p.sale_price : p.price;
          return effectivePrice <= max;
        });
      }
    }

    // Filter by Shape
    if (shape && shape.trim()) {
      const shapeVal = shape.trim().toLowerCase();
      products = products.filter(p => p.shape && p.shape.toLowerCase() === shapeVal);
    }

    // Filter by Product Type
    if (product_type && product_type.trim()) {
      const pt = product_type.trim().toLowerCase();
      if (pt === 'best sellers' || pt === 'best-sellers') {
        products = products.filter(p => p.is_best_seller === true || (p.categories && p.categories.includes('Best Sellers')));
      } else {
        products = products.filter(p => 
          (p.product_type && p.product_type.toLowerCase() === pt) ||
          (p.categories && p.categories.some(c => c.toLowerCase() === pt))
        );
      }
    }

    // Filter by Theme
    if (theme && theme.trim()) {
      const th = theme.trim().toLowerCase();
      products = products.filter(p => p.themes && p.themes.some(t => t.toLowerCase() === th));
    }

    // Filter by bundle
    if (is_bundle !== undefined) {
      const isB = is_bundle === 'true' || is_bundle === true;
      products = products.filter(p => Boolean(p.is_bundle) === isB);
    }

    // Filter by Best Seller
    if (is_best_seller !== undefined) {
      const isBS = is_best_seller === 'true' || is_best_seller === true;
      products = products.filter(p => Boolean(p.is_best_seller) === isBS);
    }

    // Sorting
    if (sort === 'price_asc') {
      products.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sort === 'price_desc') {
      products.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (sort === 'name_asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'rating_desc') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const total = products.length;

    if (all === 'true') {
      return res.json({
        success: true,
        data: products,
        total
      });
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = db.findOne('products', p => p.slug === slug || p.id === slug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch attached reviews
    const reviews = db.find('reviews', r => r.product_id === product.id);

    // Fetch related products (same category or shape, excluding current)
    const allProducts = db.getCollection('products');
    const related = allProducts
      .filter(p => p.id !== product.id && (p.shape === product.shape || p.product_type === product.product_type))
      .slice(0, 4);

    res.json({
      success: true,
      data: {
        ...product,
        reviews,
        related
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = (req, res, next) => {
  try {
    const { id } = req.params;
    const product = db.findById('products', id);

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
    const {
      name,
      SKU,
      price,
      sale_price,
      images,
      sizes,
      variants,
      stock,
      status,
      product_type,
      categories,
      shape,
      themes,
      is_best_seller,
      is_bundle,
      discount_percentage,
      description,
      additional_info
    } = req.body;

    if (!name || !SKU || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, SKU, and Price are required.' });
    }

    // Check SKU uniqueness
    const existingSKU = db.findOne('products', p => p.SKU.toLowerCase() === SKU.trim().toLowerCase());
    if (existingSKU) {
      return res.status(400).json({ success: false, message: `SKU '${SKU}' is already in use.` });
    }

    const baseSlug = slugify(name);
    let uniqueSlug = baseSlug;
    let count = 1;
    while (db.findOne('products', p => p.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const newProduct = db.insert('products', {
      name: name.trim(),
      slug: uniqueSlug,
      SKU: SKU.trim().toUpperCase(),
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'],
      price: parseFloat(price),
      sale_price: sale_price !== undefined && sale_price !== '' && sale_price !== null ? parseFloat(sale_price) : null,
      sizes: Array.isArray(sizes) ? sizes : ['XS', 'S', 'M', 'L', 'Custom'],
      variants: Array.isArray(variants) ? variants : [],
      stock: parseInt(stock, 10) || 0,
      status: status || 'active',
      product_type: product_type || 'Handmade Press-On Nails',
      categories: Array.isArray(categories) ? categories : [product_type || 'Handmade Press-On Nails'],
      shape: shape || null,
      themes: Array.isArray(themes) ? themes : [],
      is_best_seller: Boolean(is_best_seller),
      is_bundle: Boolean(is_bundle),
      discount_percentage: discount_percentage ? parseInt(discount_percentage, 10) : null,
      description: description || '',
      additional_info: additional_info || {},
      rating: 5.0,
      reviews_count: 0
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const product = db.findById('products', id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };

    // Check SKU if changing
    if (updates.SKU && updates.SKU !== product.SKU) {
      const existingSKU = db.findOne('products', p => p.id !== id && p.SKU.toLowerCase() === updates.SKU.trim().toLowerCase());
      if (existingSKU) {
        return res.status(400).json({ success: false, message: `SKU '${updates.SKU}' is already in use.` });
      }
      updates.SKU = updates.SKU.trim().toUpperCase();
    }

    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.sale_price !== undefined) {
      updates.sale_price = updates.sale_price === '' || updates.sale_price === null ? null : parseFloat(updates.sale_price);
    }
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock, 10);

    const updated = db.update('products', id, updates);

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('products', id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
