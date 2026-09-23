import express from 'express';
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getComingSoonCollections,
  createComingSoonCollection,
  updateComingSoonCollection,
  deleteComingSoonCollection
} from '../controllers/galleryController.js';

const router = express.Router();

// Gallery Items
router.get('/', getGalleryItems);
router.post('/', createGalleryItem);
router.put('/:id', updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

// Coming Soon Collections
router.get('/coming-soon/all', getComingSoonCollections);
router.post('/coming-soon', createComingSoonCollection);
router.put('/coming-soon/:id', updateComingSoonCollection);
router.delete('/coming-soon/:id', deleteComingSoonCollection);

export default router;
