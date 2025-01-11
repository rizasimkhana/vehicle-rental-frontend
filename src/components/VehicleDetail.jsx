import React, { useState, useEffect } from 'react';
import { getReviews, createReview, getVehicleDetails, markReviewHelpful, markReviewUnhelpful } from '../services/api'; 
import { useParams, useNavigate } from 'react-router-dom';

const VehicleDetails = () => {
  const [reviews, setReviews] = useState([]); 
  const [vehicle, setVehicle] = useState(null); 
  const [rating, setRating] = useState(1);  
  const [reviewText, setReviewText] = useState('');  
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [reviewsUpdated, setReviewsUpdated] = useState(false); 
  const { vehicleId } = useParams();  
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const vehicleResponse = await getVehicleDetails(vehicleId);
        setVehicle(vehicleResponse.vehicle);
      } catch (error) {
        console.error("Failed to fetch vehicle details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewResponse = await getReviews(vehicleId);
        if (Array.isArray(reviewResponse)) {
          setReviews(reviewResponse);
        } else {
          console.warn("Received invalid reviews data:", reviewResponse);
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      }
    };

    fetchVehicleData();
    fetchReviews();
  }, [vehicleId]);

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return;
    setIsSubmitting(true);
    try {
      await createReview(vehicleId, rating, reviewText);
      setReviewText('');
      setRating(1);
      setIsSubmitting(false);
      const response = await getReviews(vehicleId);
      setReviews(response?.data || []);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    // Optimistic update for helpful count
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === reviewId ? { ...review, helpfulCount: review.helpfulCount + 1 } : review
      )
    );

    try {
      await markReviewHelpful(reviewId); // Call backend API
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      // Optionally revert optimistic update if API fails
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? { ...review, helpfulCount: review.helpfulCount - 1 } : review
        )
      );
    }
  };

  const handleUnhelpful = async (reviewId) => {
    // Optimistic update for unhelpful count
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === reviewId ? { ...review, unhelpfulCount: review.unhelpfulCount + 1 } : review
      )
    );

    try {
      await markReviewUnhelpful(reviewId); // Call backend API
    } catch (error) {
      console.error('Error marking review as unhelpful:', error);
      // Optionally revert optimistic update if API fails
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? { ...review, unhelpfulCount: review.unhelpfulCount - 1 } : review
        )
      );
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page or you can provide a specific route, like '/vehicles'
  };

  if (!vehicle) return <p>Loading vehicle details...</p>;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Back to Previous Page
      </button>

      {/* Vehicle Details */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          {vehicle.make} {vehicle.model}
        </h2>
        <div className="flex items-center mb-4">
          <span className="text-xl text-gray-600">Year: {vehicle.year}</span>
          <span className="ml-4 text-xl font-bold text-blue-600">${vehicle.pricePerDay} / day</span>
        </div>
        <div className="text-gray-700 mb-6">
          <p className="text-lg">{vehicle.description}</p>
        </div>
        <img src={`https://vehicle-rental-6o3p.onrender.com/${vehicle.image.replace(/\\/g, '/')}`} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-64 object-cover rounded-lg" />
      </div>

      {/* Reviews Section */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reviews for this Vehicle</h3>
        <div className="space-y-6 mb-6">
          {reviews && reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review this vehicle!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="p-4 border rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-lg text-gray-900">{review.user.name}</span>
                  <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                  <span className="text-gray-500 ml-2">({review.rating} / 5)</span>
                </div>
                <p className="text-gray-700">{review.reviewText}</p>
                <div className="flex mt-4 space-x-4">
                  <button className="text-blue-600 hover:underline" onClick={() => handleHelpful(review._id)}>
                    Helpful ({review.helpfulCount})
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => handleUnhelpful(review._id)}>
                    Unhelpful ({review.unhelpfulCount})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Review Submission Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-2xl font-semibold text-gray-800 mb-4">Submit Your Review</h4>
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
      </div>
    </div>
  );
};

export default VehicleDetails;
