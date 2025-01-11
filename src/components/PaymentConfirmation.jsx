import React, { useEffect, useState } from 'react';
import { getPaymentHistory } from '../services/api'; // Get payment history API

const PaymentConfirmation = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user')).Id; // Retrieve user ID
        const history = await getPaymentHistory(userId);
        setPaymentHistory(history);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Your Payment History</h2>
      <ul>
        {paymentHistory.map((payment) => (
          <li key={payment.transactionId}>
            <strong>Transaction ID:</strong> {payment.transactionId} - 
            <strong>Status:</strong> {payment.status} - 
            <strong>Amount:</strong> ${payment.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentConfirmation;
