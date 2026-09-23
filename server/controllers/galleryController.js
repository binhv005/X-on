import { galleryService } from '../services/galleryService.js';

// Product Gallery
export const getGalleryItems = (req, res, next) => {
  try {
    const result = galleryService.getGalleryItems(req.query);
    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      total: result.total
    });
  } catch (err) {
    next(err);
  }
};

export const createGalleryItem = (req, res, next) => {
  try {
    const newItem = galleryService.createGalleryItem(req.body);
    res.status(201).json({ success: true, message: 'Gallery item created successfully', data: newItem });
  } catch (err) {
    next(err);
  }
};

export const updateGalleryItem = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = galleryService.updateGalleryItem(id, req.body);
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
    const deleted = galleryService.deleteGalleryItem(id);
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
    const collections = galleryService.getComingSoonCollections();
    res.json({ success: true, data: collections });
  } catch (err) {
    next(err);
  }
};

export const createComingSoonCollection = (req, res, next) => {
  try {
    const newCollection = galleryService.createComingSoonCollection(req.body);
    res.status(201).json({ success: true, message: 'Collection created successfully', data: newCollection });
  } catch (err) {
    next(err);
  }
};

export const updateComingSoonCollection = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = galleryService.updateComingSoonCollection(id, req.body);
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
    const deleted = galleryService.deleteComingSoonCollection(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (err) {
    next(err);
  }
};
