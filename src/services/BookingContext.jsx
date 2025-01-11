// BookingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const BookingContext = createContext();

// Custom hook to access the context
export const useBookingContext = () => {
  return useContext(BookingContext);
};

// Context provider component to wrap your app
export const BookingProvider = ({ children }) => {
  const [pricePerDay, setPricePerDay] = useState(100); // Example price per day, you can modify this
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingDays, setBookingDays] = useState(0);
  const [amount, setAmount] = useState(0);

  // Function to calculate booking days and amount
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = (end - start) / (1000 * 3600 * 24); // Calculate the difference in days
      setBookingDays(days);
      setAmount(days * pricePerDay); // Calculate total amount based on pricePerDay and bookingDays
    }
  }, [startDate, endDate, pricePerDay]);

  return (
    <BookingContext.Provider
      value={{
        pricePerDay,
        setPricePerDay,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        bookingDays,
        amount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
