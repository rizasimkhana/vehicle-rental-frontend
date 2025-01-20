import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
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

  // Fetch all bookings for the user
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-6o3p.onrender.com/api/bookings/user/`);
        setBookings(response.data.bookings);
      } catch (err) {
        setError('No bookings Found');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center text-lg font-medium text-gray-500">
        Loading bookings...
      </div>
    );
  }

  return (
    <>
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
            <Link to={`/bookings`} className="text-white">Bookings</Link>
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
          <Link to={`/bookings`} className="text-white">Bookings</Link>
          <Link to={`/add-vehicle`} className="text-white">RENT CARS</Link>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto mt-24"> {/* Adjust the margin to account for the fixed navbar */}
        {error ? (
          <div className="text-center text-lg font-medium text-red-500 mt-20">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-lg font-medium text-gray-500">
            No bookings found for this user.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-4"
              >
                {/* Vehicle Information */}
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-700">
                    {booking.vehicleId.make} {booking.vehicleId.model}
                  </h3>
                  <p className="text-lg text-gray-500">Vehicle Make & Model</p>
                </div>

                {/* Booking Dates */}
                <div className="text-center">
                  <p className="text-lg text-gray-700">
                    <strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* User Information */}
                <div className="text-center">
                  <p className="text-lg text-gray-700">
                    <strong>Booked By:</strong> {booking.userId.name}
                  </p>
                </div>

                {/* Status */}
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    <strong>Status:</strong> {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BookingList;
