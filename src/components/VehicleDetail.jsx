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
    <div>
      <button onClick={handleBack}>Back to Vehicles</button>
      <div className="vehicle-details">
        <h2>{vehicle.make} {vehicle.model}</h2>
        <p>{vehicle.description}</p>
        <p><strong>Price per day:</strong> ${vehicle.pricePerDay}</p>
        <p><strong>Location:</strong> {vehicle.location}</p>
        
        <div>
          <h3>Reviews</h3>
          {error && <p>{error}</p>}
          <div>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id}>
                  <p><strong>{review.userName}</strong> - {review.rating} stars</p>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
        
        <button onClick={handleBookNow}>Rent Car</button>
      </div>
    </div>
  );
};

export default VehicleDetails;
