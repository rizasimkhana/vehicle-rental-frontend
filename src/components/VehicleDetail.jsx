import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getReviews } from '../services/api'; // Assuming you have this API call to fetch reviews
import { ClipLoader } from 'react-spinners';

const VehicleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle } = location.state || {}; // Vehicle data passed via navigate
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleBookNow = () => {
    // Handle booking click, e.g., set the price per day, and navigate to booking page
    // Assuming `setPricePerDay` is provided via context
    navigate(`/booking/${vehicle._id}`, { state: { vehicle } });
  };

  if (loading) return <ClipLoader size={50} color="#3498db" loading={loading} />;

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={handleBack} 
        className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Back to Vehicles
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <img src={`https://vehicle-rental-6o3p.onrender.com/${vehicle.image.replace(/\\/g, '/')}`} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-64 object-cover rounded-lg" />
          </div>
          <div className="w-full md:w-2/3 md:pl-6">
            <h2 className="text-3xl font-semibold">{vehicle.make} {vehicle.model}</h2>
            <p className="text-gray-600 mt-2">{vehicle.description}</p>
            <p className="text-xl font-medium mt-4">
              <strong>Price per day:</strong> ${vehicle.pricePerDay}
            </p>
            <p className="mt-2">
              <strong>Location:</strong> {vehicle.location}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  {/* Safely checking if review.user is defined */}
                  {review.user ? (
                    <div className="flex items-center mb-3">
                      {/* Displaying User's Image */}
                      {review.user.image ? (
                        <img 
                          src={`https://vehicle-rental-6o3p.onrender.com/${vehicle.image.replace(/\\/g, '/')}`} 
                          alt={vehicle.make} 
                          className="w-12 h-12 rounded-full object-cover mr-4" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-400 mr-4" />
                      )}
                      <p className="font-semibold text-lg text-gray-900">{review.user.name}</p>
                    </div>
                  ) : (
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-400 mr-4" />
                      <p className="font-semibold text-lg text-gray-900">Unknown User</p>
                    </div>
                  )}

                  {/* Rating Section */}
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                    <span className="text-gray-500 ml-2">({review.rating} / 5)</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700">{review.reviewText}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        <button 
          onClick={handleBookNow} 
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
        >
          Rent Car
        </button>
      </div>
    </div>
  );
};

export default VehicleDetails;
