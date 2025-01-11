import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RentalHistory = () => {
  const [userName, setUserName] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [rentalStart, setRentalStart] = useState('');
  const [rentalEnd, setRentalEnd] = useState('');
  const [rentalHistory, setRentalHistory] = useState([]);
  const [status, setStatus] = useState('');
  const [rentalIdToComplete, setRentalIdToComplete] = useState('');

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to create a new rental history
  const createRentalHistory = async () => {
    const make = vehicleMake.trim(); // Remove any extra spaces or quotes

    // Validate that make is not empty and doesn't have extra quotes
    if (make.includes('"') || make.includes("'")) {
      alert('Invalid characters in vehicle make');
      return;
    }
    try {
      const response = await axios.post('https://vehicle-rental-6o3p.onrender.com/api/rentals/create', {
        name: userName,
        make: make,
        rentalStart,
        rentalEnd,
      });
      setStatus('Rental Created Successfully');
      setRentalHistory([...rentalHistory, response.data]);
    } catch (error) {
      console.error('Error creating rental history', error);
      setStatus('Error creating rental');
    }
  };

  // Function to get rental history for a user
  const getRentalHistoryForUser = async () => {
    try {
      const response = await axios.get(`https://vehicle-rental-6o3p.onrender.com/api/rentals/user-history/${userName}`);
      setRentalHistory(response.data);
    } catch (error) {
      console.error('Error fetching user rental history', error);
      setStatus('Error fetching user rental history');
    }
  };

  // Function to get rental history for a vehicle
  const getRentalHistoryForVehicle = async () => {
    try {
      const response = await axios.get(`https://vehicle-rental-6o3p.onrender.com/api/rentals//vehicle-history/${vehicleMake}`);
      setRentalHistory(response.data);
    } catch (error) {
      console.error('Error fetching vehicle rental history', error);
      setStatus('Error fetching vehicle rental history');
    }
  };

  // Function to mark a rental as completed
  const completeRental = async () => {
    try {
      const response = await axios.post(`https://vehicle-rental-6o3p.onrender.com/api/rentals/complete/${rentalIdToComplete}`);
      setStatus('Rental marked as completed');
      // Refresh rental history
      getRentalHistoryForUser();
    } catch (error) {
      console.error('Error completing rental', error);
      setStatus('Error completing rental');
    }
  };

  // Function to handle back navigation
  const handleBack = () => {
    navigate('/user-dashboard');  // Navigate to the user dashboard or any route you prefer
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 p-4 border rounded-lg shadow-lg">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Back to Dashboard
      </button>

      <h2 className="text-center text-xl mb-4">Rental History</h2>
      
      {/* Rental Creation Form */}
      <div className="mb-4">
        <h3 className="text-lg">Create Rental History</h3>
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Enter User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Enter Vehicle Make"
          value={vehicleMake}
          onChange={(e) => setVehicleMake(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 mb-2 w-full"
          value={rentalStart}
          onChange={(e) => setRentalStart(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 mb-2 w-full"
          value={rentalEnd}
          onChange={(e) => setRentalEnd(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded w-full"
          onClick={createRentalHistory}
        >
          Create Rental History
        </button>
      </div>

      {/* Get Rental History by User */}
      <div className="mb-4">
        <h3 className="text-lg">Get Rental History by User</h3>
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Enter User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 rounded w-full"
          onClick={getRentalHistoryForUser}
        >
          Get Rental History for User
        </button>
      </div>

      {/* Get Rental History by Vehicle */}
      <div className="mb-4">
        <h3 className="text-lg">Get Rental History by Vehicle</h3>
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Enter Vehicle Make"
          value={vehicleMake}
          onChange={(e) => setVehicleMake(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 rounded w-full"
          onClick={getRentalHistoryForVehicle}
        >
          Get Rental History for Vehicle
        </button>
      </div>

      {/* Mark Rental as Completed */}
      <div className="mb-4">
        <h3 className="text-lg">Complete Rental</h3>
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Enter Rental ID"
          value={rentalIdToComplete}
          onChange={(e) => setRentalIdToComplete(e.target.value)}
        />
        <button
          className="bg-red-500 text-white p-2 rounded w-full"
          onClick={completeRental}
        >
          Mark as Completed
        </button>
      </div>

      {/* Status Message */}
      <p className="text-center text-lg font-semibold">{status}</p>

      {/* Display Rental History */}
      <div className="mt-4">
        <h3 className="text-lg">Rental History</h3>
        {rentalHistory.length > 0 ? (
          <ul>
            {rentalHistory.map((rental) => (
              <li key={rental._id} className="border-b py-2">
                <div>
                  <h4>{rental.vehicleId.make} - {rental.vehicleId.model}</h4>
                  <p>User: {rental.userId.name}</p>
                  <p>Rental Start: {new Date(rental.rentalStart).toLocaleDateString()}</p>
                  <p>Rental End: {new Date(rental.rentalEnd).toLocaleDateString()}</p>
                  <p>Status: {rental.status}</p>
                  <p>Total Price: ${rental.totalPrice}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rental history available.</p>
        )}
      </div>
    </div>
  );
};

export default RentalHistory;
