import { db } from '../config/db.js';

class GalleryRepository {
  // Gallery items
  getAllItems() {
    return db.getCollection('galleryItems');
  }

  findItemById(id) {
    return db.findById('galleryItems', id);
  }

  createItem(data) {
    return db.insert('galleryItems', data);
  }

  updateItem(id, updates) {
    return db.update('galleryItems', id, updates);
  }

  deleteItem(id) {
    return db.delete('galleryItems', id);
  }

  // Coming Soon collections
  getAllCollections() {
    return db.getCollection('comingSoonCollections');
  }

  findCollectionById(id) {
    return db.findById('comingSoonCollections', id);
  }

  createCollection(data) {
    return db.insert('comingSoonCollections', data);
  }

  updateCollection(id, updates) {
    return db.update('comingSoonCollections', id, updates);
  }

  deleteCollection(id) {
    return db.delete('comingSoonCollections', id);
  }
}

export const galleryRepository = new GalleryRepository();
