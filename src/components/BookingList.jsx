import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { userId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch all bookings for the user
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-6o3p.onrender.com/api/bookings/user/${userId}`);
        setBookings(response.data.bookings);
      } catch (err) {
        setError('No bookings Found');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  // Function to handle back navigation
  const handleBack = () => {
    navigate('/user-dashboard');  // Navigate to the desired route, e.g., '/user-dashboard'
  };

  if (loading) {
    return (
      <div className="text-center text-lg font-medium text-gray-500">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg font-medium text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Back to Dashboard
      </button>

      {bookings.length === 0 ? (
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
  );
};

export default BookingList;
