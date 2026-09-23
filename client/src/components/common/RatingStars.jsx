import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, max = 5, size = 16, interactive = false, onChange }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);
        return (
          <Star
            key={index}
            size={size}
            fill={isFilled ? '#d4af37' : 'none'}
            color={isFilled ? '#d4af37' : '#555'}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              transition: 'transform 0.15s ease'
            }}
            onClick={() => interactive && onChange && onChange(starValue)}
          />
        );
      })}
    </div>
  );
}
