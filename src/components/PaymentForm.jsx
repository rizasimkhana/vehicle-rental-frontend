import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../services/api'; 
import axios from 'axios';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { amount } = location.state || {}; 
  const user = JSON.parse(localStorage.getItem('user')); 

  console.log(user)

  const handleUPIPayment = () => {
    const options = {
      key: "rzp_test_laJStTSXjuQTdp",  // Your Razorpay Key ID
      amount: amount * 100,  // Razorpay expects the amount in paise (1 INR = 100 paise)
      currency: "INR",
      name: "Dash Cars Rental",
      description: "Payment for Order",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaTEKb9BgKMiyfsERlLUJ9eC3rwz2ZR8T2SQ&s",
      handler: function (response) {
        console.log("Payment successful:", response);
  
        // Ensure Razorpay payment ID is being passed correctly
        const paymentId = response.razorpay_payment_id;
        if (!paymentId) {
          console.error("Payment ID not found!");
          alert("Payment ID is missing. Please try again.");
          return;
        }
  
        // Send payment details to backend to verify and complete the transaction
        axios
          .post('https://vehicle-rental-6o3p.onrender.com/api/payments/create-transaction', {
            amount: amount,
            paymentId: paymentId,  // Use the Razorpay payment ID here
            userId: user?.userId || user?.googleId,
            paymentMethod: "UPI",  // Ensure this is the correct method
            email: user.email
          })
          .then((res) => {
            console.log('Transaction successful:', res);
            navigate('/payment-history');  // Redirect to payment history page
          })
          .catch((err) => {
            console.error('Transaction failed:', err);
            alert('Transaction failed, please try again.');
          });
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#F37254",
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  return (
    <div className="payment-form-container flex items-center justify-center min-h-screen bg-gray-100">
      <div className="payment-form bg-white shadow-lg rounded-lg p-6 w-full sm:w-96">
        <h2 className="text-xl font-semibold text-center mb-6">Complete Payment</h2>

        <div className="payment-summary mb-4">
          <p className="text-lg font-medium text-center">Amount: <span className="text-green-600">${amount}</span></p>
        </div>

        <button
          className="upi-payment-btn w-full py-3 mt-4 text-white font-semibold rounded-md bg-green-600 hover:bg-green-700"
          onClick={handleUPIPayment}
          disabled={loading}
        >
          Pay with UPI
        </button>

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
