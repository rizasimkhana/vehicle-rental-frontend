import React, { useEffect, useState } from 'react'; 
import { ClipLoader } from 'react-spinners'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { useBookingContext } from '../services/BookingContext'; 
import { getVehicles } from '../services/api'; 


const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 
  const [vehicleType, setVehicleType] = useState(''); 
  const [location, setLocation] = useState(''); 
  const [minPrice, setMinPrice] = useState(''); 
  const [maxPrice, setMaxPrice] = useState(''); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const navigate = useNavigate(); 
  const { setPricePerDay } = useBookingContext(); 

  const handleBookingClick = (vehicle) => { 
    setPricePerDay(vehicle.pricePerDay); 
    navigate(`/booking/${vehicle._id}`, { state: { vehicle } }); 
  }; 

  const fetchVehicles = async () => { 
    setLoading(true); 
    setError(''); 
    try { 
      const validMinPrice = isNaN(minPrice) || minPrice === '' ? '' : minPrice; 
      const validMaxPrice = isNaN(maxPrice) || maxPrice === '' ? '' : maxPrice; 
      const vehiclesData = await getVehicles({ vehicleType, location, minPrice: validMinPrice, maxPrice: validMaxPrice }); 

      if (vehiclesData.length === 0) { 
        setError('No vehicles found with the selected filters'); 
      } else { 
        setError(''); 
      } 

      setVehicles(vehiclesData); 
    } catch (err) { 
      setError('Failed to fetch vehicles'); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  useEffect(() => { 
    fetchVehicles(); 
  }, []); 

  const handleClear = (field) => { 
    switch (field) { 
      case 'vehicleType': 
        setVehicleType(''); 
        break; 
      case 'location': 
        setLocation(''); 
        break; 
      case 'minPrice': 
        setMinPrice(''); 
        break; 
      case 'maxPrice': 
        setMaxPrice(''); 
        break; 
      default: 
        break; 
    } 
  }; 

  const user = JSON.parse(localStorage.getItem('user')) || {}; 
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : ''; 

  // Toggle the mobile menu 
  const toggleMenu = () => { 
    setIsMenuOpen(!isMenuOpen); 
  }; 

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');  // Redirect to login page
  };

  if (loading) return ( 
    <div className="flex justify-center items-center h-screen"> 
      <ClipLoader size={50} color="#3498db" loading={loading} /> 
    </div> 
  ); 

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
        </div>
      )}

      {/* Filter Section */}
      <div className="p-4">
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Filter Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Vehicle Type */}
            <div className="relative">
              <input
                type="text"
                placeholder="Vehicle Type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
              {vehicleType && (
                <button
                  onClick={() => handleClear('vehicleType')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✖
                </button>
              )}
            </div>

            {/* Location */}
            <div className="relative">
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
              {location && (
                <button
                  onClick={() => handleClear('location')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✖
                </button>
              )}
            </div>

            {/* Min Price */}
            <div className="relative">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
              {minPrice && (
                <button
                  onClick={() => handleClear('minPrice')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✖
                </button>
              )}
            </div>

            {/* Max Price */}
            <div className="relative">
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
              {maxPrice && (
                <button
                  onClick={() => handleClear('maxPrice')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✖
                </button>
              )}
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={fetchVehicles}
              className="col-span-1 md:col-span-2 lg:col-span-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Show error message if no vehicles are found */}
        {error && (
          <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
      </div>

      {/* Vehicles List */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <Link to={`/vehicle/${vehicle._id}`} className="block">
                  <img
                    src={`https://vehicle-rental-6o3p.onrender.com/${vehicle.image}`}
                    alt={vehicle.model}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{vehicle.make} {vehicle.model}</h2>
                    <p className="text-gray-500 text-lg">Year: <span className="font-medium">{vehicle.year}</span></p>
                    <p className="text-gray-500 text-lg">Price per day: <span className="font-medium text-blue-600">${vehicle.pricePerDay}</span></p>
                    <p className="text-gray-500 text-lg">Location: <span className="font-medium">{vehicle.location}</span></p>
                  </div>
                  <div className="border-t pt-4 mt-4 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Description</h3>
                    <p className="text-gray-700 mt-2 text-lg italic">{vehicle.description}</p>
                  </div>
                </Link>
                <div className="mt-4 text-center">
                  <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    onClick={() => handleBookingClick(vehicle)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No vehicles available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
