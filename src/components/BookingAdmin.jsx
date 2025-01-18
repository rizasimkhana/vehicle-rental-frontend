import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableBooking, setEditableBooking] = useState(null); // Store the editable booking

  useEffect(() => {
    // Fetch bookings from the API
    axios.get('https://vehicle-rental-6o3p.onrender.com/api/bookings/user/')
      .then((response) => {
        setBookings(response.data.bookings);  // Update state with bookings
        setLoading(false);  // Stop loading
      })
      .catch((error) => {
        setError(error.message);  // Handle error
        setLoading(false);
      });
  }, []);  // Empty dependency array ensures this runs only once (on component mount)

  const handleCancel = (bookingId) => {
    // Call API to cancel the booking
    axios.delete(`https://vehicle-rental-6o3p.onrender.com/api/bookings/cancel/${bookingId}`, { isCanceled: true })
      .then((response) => {
        // Update the bookings state to reflect the cancellation
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, isCanceled: true } : booking
          )
        );
      })
      .catch((error) => {
        setError('Error canceling booking: ' + error.message);
      });
  };

  const handleEdit = (booking) => {
    setEditableBooking(booking); // Set the booking for editing
  };

  const handleSave = (bookingId, updatedStartDate, updatedEndDate) => {
    // Call the modifyBooking API with the new start and end dates
    axios.put(`https://vehicle-rental-6o3p.onrender.com/api/bookings/modify/${bookingId}`, {
      startDate: updatedStartDate,
      endDate: updatedEndDate,
    })
      .then((response) => {
        // Update the bookings state with the modified booking
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, startDate: updatedStartDate, endDate: updatedEndDate } : booking
          )
        );
        setEditableBooking(null); // Clear editable mode
      })
      .catch((error) => {
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
                  {booking.vehicleId.make} {booking.vehicleId.model}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {editableBooking && editableBooking._id === booking._id ? (
                    <input
                      type="datetime-local"
                      defaultValue={new Date(booking.startDate).toISOString().slice(0, 16)}
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
                      defaultValue={new Date(booking.endDate).toISOString().slice(0, 16)}
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
                          >
                            Save
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
                          >
                            Cancel
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
