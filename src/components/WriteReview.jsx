// WriteReview.js (new component)

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createReview } from '../services/api';

const WriteReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicle } = location.state || {}; // Vehicle passed from previous page

  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return;
    setIsSubmitting(true);
    try {
      await createReview(vehicle._id, rating, reviewText);
      navigate('/user-dashboard'); // Navigate back to user-dashboard after submission
    } catch (error) {
      console.error("Error submitting review:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4">Write a Review for {vehicle?.make} {vehicle?.model}</h2>
      
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">Rating (1 to 5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">Your Review</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Write your review here..."
        ></textarea>
      </div>

      <div className="text-right">
        <button
          onClick={handleReviewSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 text-white rounded-lg ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default WriteReview;
