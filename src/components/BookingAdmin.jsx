import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import moment from 'moment'; // For date formatting

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableBooking, setEditableBooking] = useState(null); // Store the editable booking
  const [loadingBookingId, setLoadingBookingId] = useState(null); // Track loading state for each booking
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    // Fetch bookings from the API, and filter only confirmed bookings
    axios.get('https://vehicle-rental-6o3p.onrender.com/api/bookings/user/')
      .then((response) => {
        const confirmedBookings = response.data.bookings.filter(booking => !booking.isCanceled);
        setBookings(confirmedBookings);  // Update state with confirmed bookings only
        setLoading(false);  // Stop loading
      })
      .catch((error) => {
        setError(error.message);  // Handle error
        setLoading(false);
      });
  }, []);  // Empty dependency array ensures this runs only once (on component mount)

  const handleCancel = (bookingId) => {
    setError(null); // Clear any previous errors
    setLoadingBookingId(bookingId); // Mark the current booking as loading
    axios.delete(`https://vehicle-rental-6o3p.onrender.com/api/bookings/cancel/${bookingId}`, { isCanceled: true })
      .then((response) => {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, isCanceled: true } : booking
          )
        );
        setLoadingBookingId(null); // Reset loading state
        navigate('/admin-dashboard'); // Use navigate instead of history.push
      })
      .catch((error) => {
        setLoadingBookingId(null); // Reset loading state
        setError('Error canceling booking: ' + error.message);
      });
  };

  const handleEdit = (booking) => {
    setEditableBooking(booking); // Set the booking for editing
  };

  const handleSave = (bookingId, updatedStartDate, updatedEndDate) => {
    setError(null); // Clear previous errors
    setLoadingBookingId(bookingId); // Mark the current booking as loading
    axios.put(`https://vehicle-rental-6o3p.onrender.com/api/bookings/modify/${bookingId}`, {
      startDate: updatedStartDate,
      endDate: updatedEndDate,
    })
      .then((response) => {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, startDate: updatedStartDate, endDate: updatedEndDate } : booking
          )
        );
        setEditableBooking(null); // Clear editable mode
        setLoadingBookingId(null); // Reset loading state
        navigate('/admin-dashboard'); // Use navigate instead of history.push
      })
      .catch((error) => {
        setLoadingBookingId(null); // Reset loading state
        setError('Error modifying booking: ' + error.message);
      });
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Bookings List</h1>

      {/* Back to Dashboard Button */}
      <div className="mb-6 text-center">
        <button
          className="text-white bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => navigate('/admin-dashboard')} // Use navigate instead of history.push
        >
          Back to Admin Dashboard
        </button>
      </div>

      {bookings.length > 0 ? (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vehicle</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Start Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">End Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">
                  {booking.vehicleId ? `${booking.vehicleId.make} ${booking.vehicleId.model}` : 'N/A'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {editableBooking && editableBooking._id === booking._id ? (
                    <input
                      type="datetime-local"
                      value={moment(booking.startDate).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e) => setEditableBooking({ ...editableBooking, startDate: e.target.value })}
                    />
                  ) : (
                    new Date(booking.startDate).toLocaleString()
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {editableBooking && editableBooking._id === booking._id ? (
                    <input
                      type="datetime-local"
                      value={moment(booking.endDate).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e) => setEditableBooking({ ...editableBooking, endDate: e.target.value })}
                    />
                  ) : (
                    new Date(booking.endDate).toLocaleString()
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{booking.isCanceled ? 'Canceled' : 'Confirmed'}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {!booking.isCanceled && (
                    <div className="flex space-x-2">
                      {editableBooking && editableBooking._id === booking._id ? (
                        <>
                          <button
                            className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => handleSave(booking._id, editableBooking.startDate, editableBooking.endDate)}
                            disabled={loadingBookingId === booking._id} // Disable when loading
                          >
                            {loadingBookingId === booking._id ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            className="text-white bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
                            onClick={() => setEditableBooking(null)} // Cancel editing
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-white bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
                            onClick={() => handleEdit(booking)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => handleCancel(booking._id)}
                            disabled={loadingBookingId === booking._id} // Disable when loading
                          >
                            {loadingBookingId === booking._id ? 'Canceling...' : 'Cancel'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4">No bookings available</div>
      )}
    </div>
  );
};

export default BookingsAdmin;
