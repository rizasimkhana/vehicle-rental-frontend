import axios from 'axios';

// Base URL of your backend API
const BASE_URL = 'https://vehicle-rental-6o3p.onrender.com';

// Function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user', error);
    throw error;
  }
};

// Function to login a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, userData);
    return response.data; // returns token and user info
  } catch (error) {
    console.error('Error logging in user', error);
    throw error;
  }
};

// Function to get all users (admin only)
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/Users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users', error);
    throw error;
  }
};
// Function to fetch vehicles data
// api.js

// export const getVehicles = async () => {
//   try {
//     const response = await fetch(`${BASE_URL}/api/vehicles/`);
    
//     // Check if the response status is ok (status code 200-299)
//     if (!response.ok) {
//       throw new Error('Failed to fetch vehicles');
//     }

//     // Try parsing the response as JSON
//     const data = await response.json(); 
    
//     // Check if the vehicles data exists in the response
//     if (data && Array.isArray(data.vehicles)) {
//       return data.vehicles;  // Return the vehicles array
//     } else {
//       throw new Error('Invalid response format');
//     }

//   } catch (error) {
//     console.error("Error fetching vehicles:", error);
//     throw error; // Re-throw the error so it can be handled in the calling component
//   }
// };
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/bookings/create`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking', error);
    throw error;
  }
};

// Create a transaction (payment)
export const createTransaction = async (amount, nonce, userId, paymentMethod, email) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/payments/create-transaction`, {
      amount,
      nonce,
      userId,
      paymentMethod,
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Payment failed');
  }
};

// Get Payment History for a user
export const getPaymentHistory = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/payments/payment-history/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching payment history');
  }
};

export const getVehicleDetails = async (vehicleId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching vehicle history');
  }
};

// Function to get vehicles with filters
export const getVehicles = async ({ vehicleType, location, minPrice, maxPrice }) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/vehicles/`, {
      params: {
        vehicleType,
        location,
        minPrice,
        maxPrice
      }
    });
    return response.data.vehicles; // Assuming the vehicles are in the 'vehicles' key of the response
  } catch (error) {
    throw new Error('Error fetching vehicles');
  }
};



// Function to get reviews for a specific vehicle
export const getReviews = async (vehicleId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/reviews/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Function to submit a review for a vehicle
export const createReview = async (vehicleId, rating, reviewText) => {
  const token = localStorage.getItem('authToken');  // Assuming you're storing the token in localStorage

  if (!token) {
    throw new Error('No token found, user is not authenticated');
  }

  try {
    // Send vehicleId, rating, and reviewText in the body of the POST request
    const response = await axios.post(
      'https://vehicle-rental-6o3p.onrender.com/api/reviews',  // The API endpoint remains the same
      {
        vehicleId,         // Include vehicleId in the request body
        rating,            // Include rating in the request body
        reviewText         // Include reviewText in the request body
      },
      {
        headers: {
          Authorization: `Bearer ${token}`  // Include the token in the Authorization header
        }
      }
    );
    
    // Return the response data after successfully posting the review
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error.response?.data || error.message);
    throw error;  // Rethrow error to be handled in the component
  }
};


// Function to mark a review as helpful
export const markReviewHelpful = async (reviewId) => {
  const token = localStorage.getItem('authToken');  // Assuming you're storing the token in localStorage
  try {
    const response = await axios.post(
      `${BASE_URL}/api/reviews/${reviewId}/helpful`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    console.log(localStorage.getItem('authToken'))
    return response.data;
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    throw error;
  }
};

// Function to mark a review as unhelpful
export const markReviewUnhelpful = async (reviewId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/reviews/${reviewId}/unhelpful`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking review as unhelpful:', error);
    throw error;
  }
};

// Admin function to moderate review (approve or reject)
export const moderateReview = async (reviewId, status) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/reviews/${reviewId}/moderate`,
      { status },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,  // Assuming admin has a separate token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error moderating review:', error);
    throw error;
  }
};

