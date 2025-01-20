import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getReviews } from '../services/api'; // Assuming you have this API call to fetch reviews
import { ClipLoader } from 'react-spinners';

const VehicleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle } = location.state || {}; // Vehicle data passed via navigate
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : '';

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');  // Redirect to login page
  };

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
    // Handle booking click, e.g., set the price per day, and navigate to booking page
    navigate(`/booking/${vehicle._id}`, { state: { vehicle } });
  };

  if (loading) return <ClipLoader size={50} color="#3498db" loading={loading} />;

  return (
    <div className="container mx-auto p-4">
      {/* Navigation Bar */}
      <nav className="bg-blue-500 p-4 shadow-lg fixed w-full top-0 left-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-transparent text-3xl font-bold bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
            Dash Cars
          </Link>
          {/* Desktop Navbar */}
          <div className="hidden md:flex space-x-6">
            <Link to="/user-dashboard" className="text-white">Home</Link>
            <Link to="/rental-history" className="text-white">Rental History</Link>
            <Link to="/payment-history" className="text-white">Payment History</Link>
            <Link to={`/bookings/${user._id || user.userId}`} className="text-white">Bookings</Link>
            <Link to={`/add-vehicle`} className="text-white">RENT CARS</Link>
          </div>
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path d="M2 2h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 4h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 4h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/>
              </svg>
            </button>
          </div>
          {/* First Letter Circle and Username */}
          {firstLetter && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center rounded-full">
                {firstLetter}
              </div>
              <p className="text-white font-semibold">{user.name}</p>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 ml-4"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-500 p-4 space-y-4">
          <Link to="/" className="text-white block">Home</Link>
          <Link to="/rental-history" className="text-white block">Rental History</Link>
          <Link to="/payment-history" className="text-white block">Payment History</Link>
          <Link to={`/bookings/${user._id || user.userId}`} className="text-white">Bookings</Link>
          <Link to={`/add-vehicle`} className="text-white">RENT CARS</Link>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <img 
              src={`https://vehicle-rental-6o3p.onrender.com/${vehicle.image.replace(/\\/g, '/')}`} 
              alt={`${vehicle.make} ${vehicle.model}`} 
              className="w-full h-64 object-cover rounded-lg" 
            />
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
                  <div className="flex items-center mb-3">
                    <span className="font-semibold text-lg text-gray-900">
                      {review.user && review.user.name ? review.user.name : 'Unknown User'}
                    </span>
                  </div>

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

        <div className="mt-6 space-y-4">
          <button 
            onClick={handleBookNow} 
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            Rent Car
          </button>
          <button 
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
