import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

const AddVehicle = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const user = JSON.parse(localStorage.getItem('user')) || {}; 
    const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : ''; 

      // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');  // Redirect to login page
  };
  const navigate = useNavigate();
      // Toggle the mobile menu 
      const toggleMenu = () => { 
        setIsMenuOpen(!isMenuOpen); 
      }; 
  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    // Prepare the data to be sent
    const vehicleData = {
      make,
      model,
      year,
      pricePerDay,
      availability,
      location,
      description,
    };

    try {
      const formData = new FormData();
      Object.entries(vehicleData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (image) {
        formData.append('image', image);
      }

      await axios.post('https://vehicle-rental-6o3p.onrender.com/api/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to user-dashboard after adding a new vehicle
      navigate('/user-dashboard');
    } catch (err) {
      setError('Failed to add vehicle. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
            <Link to={`/bookings`} className="text-white">Bookings</Link>
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
          <Link to={`/bookings`} className="text-white">Bookings</Link>
          <Link to={`/add-vehicle`} className="text-white">RENT CARS</Link>
        </div>
      )}
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white p-6 shadow-xl rounded-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          Add New Vehicle
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Make"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              placeholder="Price Per Day"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Availability"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddVehicle;
