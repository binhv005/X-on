import { db } from '../config/db.js';

// Product Gallery
export const getGalleryItems = (req, res, next) => {
  try {
    const { collection, page = 1, limit = 12, all } = req.query;
    let items = db.getCollection('galleryItems');

    if (collection) {
      items = items.filter(i => i.collection === collection);
    }
    items.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Populate linked product if available
    const products = db.getCollection('products');
    const populated = items.map(item => {
      const linked = item.linked_product ? products.find(p => p.id === item.linked_product) : null;
      return {
        ...item,
        linked_product_details: linked ? { name: linked.name, slug: linked.slug, price: linked.price, sale_price: linked.sale_price } : null
      };
    });

    if (all === 'true') {
      return res.json({ success: true, data: populated });
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = populated.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total: populated.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(populated.length / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createGalleryItem = (req, res, next) => {
  try {
    const { title, collection, media, linked_product, size_labels, status, sort_order } = req.body;
    if (!title || !media) {
      return res.status(400).json({ success: false, message: 'Title and media URL are required' });
    }
    const newItem = db.insert('galleryItems', {
      title,
      collection: collection || 'Now Selling',
      media,
      linked_product: linked_product || null,
      size_labels: Array.isArray(size_labels) ? size_labels : ['S', 'M', 'L'],
      status: status || 'published',
      sort_order: parseInt(sort_order, 10) || 0
    });
    res.status(201).json({ success: true, message: 'Gallery item created successfully', data: newItem });
  } catch (err) {
    next(err);
  }
};

export const updateGalleryItem = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = db.update('galleryItems', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({ success: true, message: 'Gallery item updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteGalleryItem = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('galleryItems', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Coming Soon Collections
export const getComingSoonCollections = (req, res, next) => {
  try {
    const collections = db.getCollection('comingSoonCollections');
    collections.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    res.json({ success: true, data: collections });
  } catch (err) {
    next(err);
  }
};

export const createComingSoonCollection = (req, res, next) => {
  try {
    const { title, collection_name, subtitle, media, status, display_order, expected_launch } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const newCollection = db.insert('comingSoonCollections', {
      title,
      collection_name: collection_name || title,
      subtitle: subtitle || '',
      media: media || 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1000&q=80',
      status: status || 'active',
      display_order: parseInt(display_order, 10) || 0,
      expected_launch: expected_launch || 'Coming Soon'
    });
    res.status(201).json({ success: true, message: 'Collection created successfully', data: newCollection });
  } catch (err) {
    next(err);
  }
};

export const updateComingSoonCollection = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = db.update('comingSoonCollections', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, message: 'Collection updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteComingSoonCollection = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('comingSoonCollections', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (err) {
    next(err);
  }
};
