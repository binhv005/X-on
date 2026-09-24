import { productRepository } from '../repositories/productRepository.js';
import { reviewRepository } from '../repositories/reviewRepository.js';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

class ProductService {
  getProducts(filters = {}) {
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
      all
    } = filters;

    let products = productRepository.getAll();

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
      const shapeSlug = slugify(shape);
      products = products.filter(p => p.shape && (slugify(p.shape) === shapeSlug || p.shape.toLowerCase() === shape.trim().toLowerCase()));
    }

    // Filter by Product Type
    if (product_type && product_type.trim()) {
      const ptSlug = slugify(product_type);
      if (ptSlug === 'best-sellers' || ptSlug === 'best-seller') {
        products = products.filter(p => p.is_best_seller === true || (p.categories && p.categories.some(c => slugify(c) === 'best-sellers')));
      } else {
        products = products.filter(p =>
          (p.product_type && (slugify(p.product_type) === ptSlug || p.product_type.toLowerCase() === product_type.trim().toLowerCase())) ||
          (p.categories && p.categories.some(c => slugify(c) === ptSlug || c.toLowerCase() === product_type.trim().toLowerCase()))
        );
      }
    }

    // Filter by Theme
    if (theme && theme.trim()) {
      const thSlug = slugify(theme);
      products = products.filter(p => p.themes && p.themes.some(t => slugify(t) === thSlug || t.toLowerCase() === theme.trim().toLowerCase()));
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

    // Filter by Status (Draft products are hidden from public store by default)
    if (filters.status && filters.status.trim()) {
      products = products.filter(p => p.status === filters.status.trim());
    } else if (filters.admin !== 'true' && filters.include_draft !== 'true') {
      products = products.filter(p => p.status !== 'draft');
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
      return { products, total };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    return {
      products: paginatedProducts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  }

  getProductBySlug(slug, filters = {}) {
    const product = productRepository.findBySlug(slug);
    if (!product) return null;
    if (product.status === 'draft' && filters.admin !== 'true' && filters.include_draft !== 'true') {
      return null;
    }

    const reviews = reviewRepository.findByProductId(product.id);
    const allProducts = productRepository.getAll();
    const related = allProducts
      .filter(p => p.id !== product.id && p.status !== 'draft' && (p.shape === product.shape || p.product_type === product.product_type))
      .slice(0, 4);

    let normalizedProduct = { ...product };
    if ((!normalizedProduct.size_stock || typeof normalizedProduct.size_stock !== 'object' || Object.keys(normalizedProduct.size_stock).length === 0) && Array.isArray(normalizedProduct.sizes) && normalizedProduct.sizes.length > 0) {
      const totalStock = typeof normalizedProduct.stock === 'number' ? normalizedProduct.stock : (parseInt(normalizedProduct.stock, 10) || 0);
      const perSize = Math.max(0, Math.floor(totalStock / normalizedProduct.sizes.length));
      const gen = {};
      normalizedProduct.sizes.forEach(s => { gen[s] = perSize; });
      normalizedProduct.size_stock = gen;
    }

    return {
      ...normalizedProduct,
      reviews,
      related
    };
  }

  getProductById(id) {
    const product = productRepository.findById(id);
    if (!product) return null;
    let normalizedProduct = { ...product };
    if ((!normalizedProduct.size_stock || typeof normalizedProduct.size_stock !== 'object' || Object.keys(normalizedProduct.size_stock).length === 0) && Array.isArray(normalizedProduct.sizes) && normalizedProduct.sizes.length > 0) {
      const totalStock = typeof normalizedProduct.stock === 'number' ? normalizedProduct.stock : (parseInt(normalizedProduct.stock, 10) || 0);
      const perSize = Math.max(0, Math.floor(totalStock / normalizedProduct.sizes.length));
      const gen = {};
      normalizedProduct.sizes.forEach(s => { gen[s] = perSize; });
      normalizedProduct.size_stock = gen;
    }
    return normalizedProduct;
  }

  createProduct(data) {
    const {
      name,
      SKU,
      price,
      sale_price,
      images,
      sizes,
      size_stock,
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
    } = data;

    if (!name || !SKU || price === undefined) {
      throw new Error('Name, SKU, and Price are required.');
    }

    const existingSKU = productRepository.findBySKU(SKU);
    if (existingSKU) {
      throw new Error(`SKU '${SKU}' is already in use.`);
    }

    const baseSlug = slugify(name);
    let uniqueSlug = baseSlug;
    let count = 1;
    while (productRepository.findBySlug(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const parsedSizes = Array.isArray(sizes) ? sizes : ['XS', 'S', 'M', 'L', 'Custom'];
    const totalStock = parseInt(stock, 10) || 0;
    let finalSizeStock = (typeof size_stock === 'object' && size_stock !== null) ? { ...size_stock } : {};
    if (Object.keys(finalSizeStock).length === 0 && parsedSizes.length > 0 && totalStock > 0) {
      const perSize = Math.max(0, Math.floor(totalStock / parsedSizes.length));
      parsedSizes.forEach(s => {
        finalSizeStock[s] = perSize;
      });
    }

    const rawImages = Array.isArray(images) ? images : (images ? [images] : []);
    const sanitizedImages = rawImages
      .filter(img => typeof img === 'string' && img.trim())
      .map(img => img.trim())
      .filter(img => !img.startsWith('blob:') && !img.startsWith('data:image'));

    return productRepository.create({
      name: name.trim(),
      slug: uniqueSlug,
      SKU: SKU.trim().toUpperCase(),
      images: sanitizedImages.length > 0 ? sanitizedImages : ['https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237942/x-on/products/IMG_7098.webp'],
      price: parseFloat(price),
      sale_price: sale_price !== undefined && sale_price !== '' && sale_price !== null ? parseFloat(sale_price) : null,
      sizes: parsedSizes,
      variants: Array.isArray(variants) ? variants : [],
      stock: totalStock,
      status: status || 'active',
      product_type: product_type || 'Handmade Press-On Nails',
      categories: Array.isArray(categories) ? categories : [product_type || 'Handmade Press-On Nails'],
      shape: shape || null,
      themes: Array.isArray(themes) ? themes : [],
      size_stock: finalSizeStock,
      is_best_seller: Boolean(is_best_seller),
      is_bundle: Boolean(is_bundle),
      discount_percentage: discount_percentage ? parseInt(discount_percentage, 10) : null,
      description: description || '',
      additional_info: additional_info || {},
      rating: 5.0,
      reviews_count: 0
    });
  }

  updateProduct(id, updates) {
    const product = productRepository.findById(id);
    if (!product) return null;

    if (updates.SKU && updates.SKU !== product.SKU) {
      const existingSKU = productRepository.findBySKU(updates.SKU);
      if (existingSKU && existingSKU.id !== id) {
        throw new Error(`SKU '${updates.SKU}' is already in use.`);
      }
      updates.SKU = updates.SKU.trim().toUpperCase();
    }

    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.sale_price !== undefined) {
      updates.sale_price = updates.sale_price === '' || updates.sale_price === null ? null : parseFloat(updates.sale_price);
    }
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock, 10);
    if (updates.size_stock !== undefined) updates.size_stock = updates.size_stock;
    if (updates.is_best_seller !== undefined) updates.is_best_seller = Boolean(updates.is_best_seller);
    if (updates.is_bundle !== undefined) updates.is_bundle = Boolean(updates.is_bundle);
    if (updates.images !== undefined) {
      const rawImgs = Array.isArray(updates.images) ? updates.images : (updates.images ? [updates.images] : []);
      const sanitized = rawImgs
        .filter(img => typeof img === 'string' && img.trim())
        .map(img => img.trim())
        .filter(img => !img.startsWith('blob:') && !img.startsWith('data:image'));
      updates.images = sanitized.length > 0 ? sanitized : product.images || ['https://res.cloudinary.com/ai1z2oaj/image/upload/v1790237942/x-on/products/IMG_7098.webp'];
    }

    return productRepository.update(id, updates);
  }

  deleteProduct(id) {
    return productRepository.delete(id);
  }
}

export const productService = new ProductService();
