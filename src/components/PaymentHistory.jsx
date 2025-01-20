import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { useNavigate,Link } from 'react-router-dom';

const PaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);  // State to hold the PDF URL for inline display
  const [showModal, setShowModal] = useState(false);  // Control modal visibility
  const [selectedPaymentId, setSelectedPaymentId] = useState(null); // To keep track of which payment's PDF to show
  const navigate = useNavigate();
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
  

  // Fetch payment history from backend API
  useEffect(() => {
    const fetchPaymentHistory = async () => {
    console.log(user.email)
      try {
        const userId = user.googleId || user.email ;  // Use googleId for Google login or userId for traditional login
        
        const response = await axios.get(`https://vehicle-rental-6o3p.onrender.com/api/payments/history/${userId}`);
        console.log('Payment history response:', response.data);

        // If the payments are empty, log a message
        if (response.data && Array.isArray(response.data)) {
          setPayments(response.data);
        } else {
          console.error('Unexpected data structure:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPaymentHistory();
    } else {
      console.error('User is not logged in');
    }
  }, [user]);

  // Function to handle invoice download and show the PDF inline in a modal
  const showInvoice = async (paymentId) => {
    try {
      const response = await axios.get(`https://vehicle-rental-6o3p.onrender.com/api/payments/invoice/${paymentId}`, {
        responseType: 'blob', // Expecting a PDF file as a blob
      });

      // Create a temporary link to view the PDF inline in the modal
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setSelectedPaymentId(paymentId);  // Store the selected payment ID
      setShowModal(true);  // Show the modal with the PDF
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  // Close modal and reset the state
  const closeModal = () => {
    setShowModal(false);
    setPdfUrl(null);
    setSelectedPaymentId(null);
  };


  // Render loading message or the payment history table
  if (loading) {
    return <div className="text-center py-4">Loading payment history...</div>;
  }

  return (
    <>
          {/* Responsive Navbar */}
          <nav className="bg-blue-500 p-4 shadow-lg">
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
    <div className="payment-history-container max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Payment ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center">No payment history found.</td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.transactionId} className="border-b">
                <td className="px-4 py-2">{payment.transactionId}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{payment.amount}</td>
                <td className="px-4 py-2">{new Date(payment.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{payment.status}</td>
                <td className="px-4 py-2">
                  {payment.status === 'Completed' && (
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => showInvoice(payment.transactionId)}
                    >
                      View Invoice
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for displaying the PDF inline */}
      {showModal && pdfUrl && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-4/5 max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">Invoice for Payment {selectedPaymentId}</h2>
            <iframe 
              src={pdfUrl} 
              width="100%" 
              height="500px" 
              style={{ border: 'none' }}
              title="Invoice PDF"
            />
            <button 
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default PaymentHistory;
