import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
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
  const [isUpdate, setIsUpdate] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the mobile menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { id } = useParams();  // Get the vehicle id from the URL params
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      const { data } = await axios.get('https://vehicle-rental-6o3p.onrender.com/api/vehicles');
      console.log(data); // Log the API response here
      if (Array.isArray(data.vehicles)) {
        setVehicles(data.vehicles);  // Access the 'vehicles' array
      } else {
        setError('Fetched data is not an array');
      }
    } catch (err) {
      setError('Failed to fetch vehicles');
      console.error(err);
    }
  };

  // Fetch vehicle data for update
  useEffect(() => {
    if (id) {
      setIsUpdate(true);
      const fetchVehicle = async () => {
        try {
          const { data } = await axios.get(`https://vehicle-rental-6o3p.onrender.com/api/vehicles/${id}`);
          const { vehicle } = data;
          setMake(vehicle.make);
          setModel(vehicle.model);
          setYear(vehicle.year);
          setPricePerDay(vehicle.pricePerDay);
          setAvailability(vehicle.availability);
          setLocation(vehicle.location);
          setDescription(vehicle.description);
        } catch (error) {
          setError('Failed to fetch vehicle details');
        }
      };
      fetchVehicle();
    } else {
      setIsUpdate(false);
    }
    fetchVehicles();
  }, [id]);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    navigate('/admin-dashboard');

    setMake('');
    setModel('');
    setYear('');
    setPricePerDay('');
    setAvailability('');
    setLocation('');
    setDescription('');
    setImage('');

    // Prepare the data to be sent
    const updatedData = {
      make,
      model,
      year,
      pricePerDay,
      availability,
      location,
      description,
    };

    try {
      if (isUpdate) {
        // If image is updated, use FormData, otherwise send the data as JSON
        const formData = new FormData();

        // Append the updated data fields (with or without image)
        Object.entries(updatedData).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        if (image) {
          // Append image if it's selected
          formData.append('image', image);
          await axios.patch(`https://vehicle-rental-6o3p.onrender.com/api/vehicles/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          // If there's no image, send the data as JSON
          await axios.put(`https://vehicle-rental-6o3p.onrender.com/api/vehicles/${id}`, updatedData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      } else {
        // If it's a new vehicle, send everything including the image
        const formData = new FormData();
        Object.entries(updatedData).forEach(([key, value]) => {
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
      }

      // After successful add or update, fetch the vehicles again to refresh the list
      fetchVehicles();

      // Optionally, you can also redirect to the admin dashboard (or stay on the same page)
      navigate('/admin-dashboard'); // Redirect to dashboard after successful submission
    } catch (err) {
      setError('Failed to add/update vehicle. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (vehicleId) => {
    setActiveAccordion(activeAccordion === vehicleId ? null : vehicleId);
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`https://vehicle-rental-6o3p.onrender.com/api/vehicles/${vehicleId}`);
      fetchVehicles();  // Refresh the list after deletion
    } catch (err) {
      setError('Failed to delete vehicle.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-3xl font-bold">
            Dash Cars
          </Link>
          {/* Desktop Navbar */}
          <div className="hidden md:flex space-x-6">
            <Link to="/admin-dashboard" className="text-white">Home</Link>
            <Link to="/rental-history" className="text-white">Rental History</Link>
            <Link to="/payment-history" className="text-white">Payment History</Link>
            <Link to={`/bookings`} className="text-white">Bookings</Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path d="M2 2h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 4h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 4h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/>
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-blue-500 p-4 space-y-4">
              <Link to="/admin-dashboard" className="text-white block">Home</Link>
              <Link to="/rental-history" className="text-white block">Rental History</Link>
              <Link to="/payment-history" className="text-white block">Payment History</Link>
              <Link to={`/bookings`} className="text-white">Bookings</Link>
            </div>
          )}

          {/* User and Logout */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center rounded-full">A</div>
            <p className="text-white font-semibold">Admin</p>
            <button
              onClick={handleLogout}
              className="text-white ml-4 hover:text-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Vehicle Form Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white p-6 shadow-xl rounded-lg max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
            {isUpdate ? 'Update Vehicle' : 'Add New Vehicle'}
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
                {isUpdate ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Displaying Vehicles */}
      <div className="container mx-auto py-8 px-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Vehicles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(vehicles) && vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-white p-6 shadow-lg rounded-lg">
                <h4 className="font-semibold text-xl text-gray-800">
                  {vehicle.make} {vehicle.model}
                </h4>
                <p className="text-gray-600 mt-2">{vehicle.location}</p>
                {vehicle.image && (
                  <img
                    src={`https://vehicle-rental-6o3p.onrender.com/${vehicle.image}`}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="mt-4 w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => toggleAccordion(vehicle._id)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {activeAccordion === vehicle._id ? 'Hide Details' : 'Edit'}
                  </button>
                  <button
                    onClick={() => deleteVehicle(vehicle._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
                {activeAccordion === vehicle._id && (
                  <div className="mt-4">
                    <h5 className="text-lg font-medium text-gray-700">Update {vehicle.make} {vehicle.model}</h5>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={make || vehicle.make}
                          onChange={(e) => setMake(e.target.value)}
                          placeholder="Make"
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={model || vehicle.model}
                          onChange={(e) => setModel(e.target.value)}
                          placeholder="Model"
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          value={year || vehicle.year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="Year"
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          value={pricePerDay || vehicle.pricePerDay}
                          onChange={(e) => setPricePerDay(e.target.value)}
                          placeholder="Price Per Day"
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={availability || vehicle.availability}
                          onChange={(e) => setAvailability(e.target.value)}
                          placeholder="Availability"
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={location || vehicle.location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Location"
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <textarea
                          value={description || vehicle.description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Description"
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <button
                          type="submit"
                          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg"
                        >
                          Update Vehicle
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No vehicles available.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
