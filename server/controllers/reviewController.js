import { reviewService } from '../services/reviewService.js';

export const getReviews = (req, res, next) => {
  try {
    const { product_id } = req.query;
    const reviews = reviewService.getReviews(product_id);
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

export const createReview = (req, res, next) => {
  try {
    const newReview = reviewService.createReview(req.body);
    res.status(201).json({ success: true, message: 'Thank you for your review!', data: newReview });
  } catch (err) {
    next(err);
  }
};
