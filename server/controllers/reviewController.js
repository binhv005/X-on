import { db } from '../config/db.js';

export const getReviews = (req, res, next) => {
  try {
    const { product_id } = req.query;
    let reviews = db.getCollection('reviews');
    if (product_id) {
      reviews = reviews.filter(r => r.product_id === product_id);
    }
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

export const createReview = (req, res, next) => {
  try {
    const { product_id, rating, name, email, comment } = req.body;
    if (!product_id || !rating || !name || !email || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required to submit a review' });
    }

    const newReview = db.insert('reviews', {
      product_id,
      rating: parseInt(rating, 10),
      name: name.trim(),
      email: email.trim(),
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    });

    // Recalculate product rating
    const allProdReviews = db.find('reviews', r => r.product_id === product_id);
    const avgRating = allProdReviews.reduce((sum, r) => sum + r.rating, 0) / allProdReviews.length;
    db.update('products', product_id, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviews_count: allProdReviews.length
    });

    res.status(201).json({ success: true, message: 'Thank you for your review!', data: newReview });
  } catch (err) {
    next(err);
  }
};
