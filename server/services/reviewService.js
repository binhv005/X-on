import { reviewRepository } from '../repositories/reviewRepository.js';
import { productRepository } from '../repositories/productRepository.js';

class ReviewService {
  getReviews(productId) {
    if (productId) {
      return reviewRepository.findByProductId(productId);
    }
    return reviewRepository.getAll();
  }

  createReview(data) {
    const { product_id, rating, name, email, comment } = data;
    if (!product_id || !rating || !name || !email || !comment) {
      throw new Error('All fields are required to submit a review');
    }

    const newReview = reviewRepository.create({
      product_id,
      rating: parseInt(rating, 10),
      name: name.trim(),
      email: email.trim(),
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    });

    // Recalculate product rating
    const allProdReviews = reviewRepository.findByProductId(product_id);
    const avgRating = allProdReviews.reduce((sum, r) => sum + r.rating, 0) / allProdReviews.length;
    productRepository.update(product_id, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviews_count: allProdReviews.length
    });

    return newReview;
  }
}

export const reviewService = new ReviewService();
