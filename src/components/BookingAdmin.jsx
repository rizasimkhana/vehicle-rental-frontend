import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState({});

  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-6o3p.onrender.com/api/bookings/user/`);
        setBookings(response.data.bookings);
      } catch (err) {
        setError('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const handleBack = () => {
    navigate('/user-dashboard');
  };

  const handleEditToggle = (id, booking) => {
    setEditMode(editMode === id ? null : id);
    setUpdatedBooking(booking);
  };

  const handleInputChange = (field, value) => {
    setUpdatedBooking((prev) => ({ ...prev, [field]: value }));
  };

  const handleModify = async (id) => {
    try {
      const response = await axios.put(`https://vehicle-rental-6o3p.onrender.com/api/bookings/modify/${id}`, {
        ...updatedBooking,
        userId: userId, // Ensure userId is being passed
      });
      setBookings((prevBookings) =>
        prevBookings.map((booking) => (booking._id === id ? response.data.booking : booking))
      );
      setEditMode(null);
    } catch (err) {
      console.error('Error modifying booking:', err);
    }
  };
  
  const handleCancel = async (id) => {
    try {
      await axios.delete(`https://vehicle-rental-6o3p.onrender.com/api/bookings/cancel/${id}`, {
        data: { userId: userId }, // Ensure userId is included here as well
      });
      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error('Error canceling booking:', err);
    }
  };
  

  if (loading) {
    return <div className="text-center text-lg font-medium text-gray-500">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center text-lg font-medium text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
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
              {editMode === booking._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={updatedBooking.vehicleId.make || ''}
                    onChange={(e) => handleInputChange('vehicleId.make', e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Vehicle Make"
                  />
                  <input
                    type="text"
                    value={updatedBooking.vehicleId.model || ''}
                    onChange={(e) => handleInputChange('vehicleId.model', e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Vehicle Model"
                  />
                  <input
  type="date"
  value={updatedBooking.startDate ? new Date(new Date(updatedBooking.startDate).toLocaleDateString()).toISOString().split('T')[0] : ''}
  onChange={(e) => handleInputChange('startDate', e.target.value)}
  className="w-full px-4 py-2 border rounded"
  placeholder="Start Date"
/>
<input
  type="date"
  value={updatedBooking.endDate ? new Date(new Date(updatedBooking.endDate).toLocaleDateString()).toISOString().split('T')[0] : ''}
  onChange={(e) => handleInputChange('endDate', e.target.value)}
  className="w-full px-4 py-2 border rounded"
  placeholder="End Date"
/>

                  <button
                    onClick={() => handleModify(booking._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-700">
                      {booking.vehicleId.make} {booking.vehicleId.model}
                    </h3>
                    <p className="text-lg text-gray-500">Vehicle Make & Model</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg text-gray-700">
                      <strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg text-gray-700">
                      <strong>Booked By:</strong> {booking.userId.name}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">
                      <strong>Status:</strong> {booking.status}
                    </p>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleEditToggle(booking._id, booking)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingAdmin;
