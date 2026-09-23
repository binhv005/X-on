import { galleryRepository } from '../repositories/galleryRepository.js';
import { productRepository } from '../repositories/productRepository.js';

class GalleryService {
  getGalleryItems(filters = {}) {
    const { collection, page = 1, limit = 12, all } = filters;
    let items = galleryRepository.getAllItems();

    if (collection) {
      items = items.filter(i => i.collection === collection);
    }
    items.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Populate linked product
    const products = productRepository.getAll();
    const populated = items.map(item => {
      const linked = item.linked_product ? products.find(p => p.id === item.linked_product) : null;
      return {
        ...item,
        linked_product_details: linked ? { name: linked.name, slug: linked.slug, price: linked.price, sale_price: linked.sale_price } : null
      };
    });

    if (all === 'true') {
      return { items: populated, total: populated.length };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = populated.slice(startIndex, startIndex + limitNum);

    return {
      items: paginated,
      pagination: {
        total: populated.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(populated.length / limitNum) || 1
      }
    };
  }

  createGalleryItem(data) {
    const { title, collection, media, linked_product, size_labels, status, sort_order } = data;
    if (!title || !media) {
      throw new Error('Title and media URL are required');
    }
    return galleryRepository.createItem({
      title,
      collection: collection || 'Now Selling',
      media,
      linked_product: linked_product || null,
      size_labels: Array.isArray(size_labels) ? size_labels : ['S', 'M', 'L'],
      status: status || 'published',
      sort_order: parseInt(sort_order, 10) || 0
    });
  }

  updateGalleryItem(id, updates) {
    return galleryRepository.updateItem(id, updates);
  }

  deleteGalleryItem(id) {
    return galleryRepository.deleteItem(id);
  }

  getComingSoonCollections() {
    const collections = galleryRepository.getAllCollections();
    return [...collections].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  createComingSoonCollection(data) {
    const { title, collection_name, subtitle, media, status, display_order, expected_launch } = data;
    if (!title) {
      throw new Error('Title is required');
    }
    return galleryRepository.createCollection({
      title,
      collection_name: collection_name || title,
      subtitle: subtitle || '',
      media: media || '/assets/images/IMG_7098.JPG',
      status: status || 'active',
      display_order: parseInt(display_order, 10) || 0,
      expected_launch: expected_launch || 'Coming Soon'
    });
  }

  updateComingSoonCollection(id, updates) {
    return galleryRepository.updateCollection(id, updates);
  }

  deleteComingSoonCollection(id) {
    return galleryRepository.deleteCollection(id);
  }
}

export const galleryService = new GalleryService();
