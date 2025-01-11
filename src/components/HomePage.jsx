import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


const HomePage = () => {
  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('https://www.mercedes-benz.co.in/content/dam/retail/india/stage_banner.jpg/1733477122926.jpg?im=Resize=(2730);Crop,rect=(0,0,2730,1214)')" }}>
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-white">
        {/* Section for introduction / description */}
        <div className="text-center py-16 px-6">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to Dash Cars</h1>
          <p className="text-lg mb-6">
            Your trusted car rental shop for convenient, affordable, and stylish rides. 
            Whether you're going on a road trip or need a car for daily use, we have the perfect vehicle for you.
          </p>
          <p className="text-md">
            Explore our fleet and <Link to="/login" className="text-blue-500">book your car</Link> today!
          </p>
        </div>

        {/* Buttons for Login and Register */}
        <div className="flex justify-center items-center space-x-6 py-8">
          <Link to="/login">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
