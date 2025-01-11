import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";  // Import CSS for the date picker
import { useNavigate, useParams } from 'react-router-dom';
import { createBooking } from '../services/api';  // Import API call to create booking
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import { ClipLoader } from 'react-spinners'; // Import the spinner component from react-spinners
import 'react-toastify/dist/ReactToastify.css'; 
import { useBookingContext } from '../services/BookingContext';
import PaymentForm from './PaymentForm';

const BookingForm = ({ vehicle }) => {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const { startDate, setStartDate, endDate, setEndDate, bookingDays, amount } = useBookingContext();
  // State for the start date, end date, error, success message, and loading status
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state
  const [showPayment, setShowPayment] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')); // Get the user info from localStorage
  
  // Handle form submission
  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Check if start and end dates are selected
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    // Check if end date is after start date
    if (startDate >= endDate) {
      setError('End date should be after start date.');
      return;
    }

    // Start loading spinner
    setLoading(true);
    setError('');  // Clear any previous error messages

    try {
      // Get the userId, fallback to googleId if traditional login is not used
      const userId = user?.userId || user?.googleId;

      // Ensure that userId is available
      if (!userId) {
        setError('User is not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      // Prepare booking data
      const bookingData = {
        userId: user?.userId || user?.googleId,
        vehicleId: vehicleId,
        startDate: startDate.toISOString(),  // Convert to ISO string for timestamp
        endDate: endDate.toISOString(),      // Convert to ISO string for timestamp
      };

      // Call API to create a booking
      const response = await createBooking(bookingData);

      // Show success notification
      toast.success('Booking Successful! And confirmation mail is sent', {
        position: "top-right",
        autoClose: 3000,  // Close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Clear success message and reset loading state
      setSuccessMessage('Booking Successful! Redirecting...');
      setTimeout(() => {
        navigate(`/payment/${vehicleId}`,{ state: { amount } });
        setShowPayment(true); 
      }, 2000);

    } catch (error) {
      // Handle API errors
      if (error.response) {
        // If the server responded with a status code outside of 2xx
        setError(error.response.data.message || 'Something went wrong. Please try again.');
      } else if (error.request) {
        // If no response was received
        setError('Network error. Please try again later.');
      } else {
        // If something went wrong setting up the request
        setError('Error setting up request. Please try again.');
      }
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Booking Form</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        <form onSubmit={handleBooking}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              className="w-full md:w-96 mt-2 p-2 border border-gray-300 rounded-md"
              minDate={new Date()}
              placeholderText="Select a start date"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              className="w-full md:w-96 mt-2 p-2 border border-gray-300 rounded-md"
              minDate={startDate || new Date()}
              placeholderText="Select an end date"
            />
          </div>

          {/* Display the loading spinner while the form is being submitted */}
          <div className="text-center">
            {loading ? (
              <ClipLoader size={30} color="#4fa94d" loading={loading} />
            ) : (
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                disabled={loading}  // Disable the button while loading
              >
                Confirm Booking
              </button>
            )}
          </div>
        </form>

        <ToastContainer /> 

        {showPayment && <PaymentForm />}
      </div>
    </div>
  );
};

export default BookingForm;
