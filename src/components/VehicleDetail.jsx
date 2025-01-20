// VehicleDetails.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getReviews } from '../services/api'; 
import { ClipLoader } from 'react-spinners';

const VehicleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle } = location.state || {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : '';

  useEffect(() => {
    const fetchReviews = async () => {
      if (vehicle) {
        try {
          const reviewsData = await getReviews(vehicle._id);
          setReviews(reviewsData);
        } catch (err) {
          setError('Error fetching reviews');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReviews();
  }, [vehicle]);

  const handleBookNow = () => {
    navigate(`/booking/${vehicle._id}`, { state: { vehicle } });
  };

  if (loading) return <ClipLoader size={50} color="#3498db" loading={loading} />;

  return (
    <div className="container mx-auto p-4">
      {/* Other content here */}

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center mb-3">
                  <span className="font-semibold text-lg text-gray-900">
                    {review.user && review.user.name ? review.user.name : 'User'}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                  <span className="text-gray-500 ml-2">({review.rating} / 5)</span>
                </div>
                <p className="text-gray-700">{review.reviewText}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="mt-6 space-y-4">
        <button 
          onClick={() => navigate('/write-review', { state: { vehicle } })} // Navigate to WriteReview page
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600"
        >
          Write a Review
        </button>
        <button 
          onClick={handleBookNow} 
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
        >
          Rent Car
        </button>
      </div>
    </div>
  );
};

export default VehicleDetails;
