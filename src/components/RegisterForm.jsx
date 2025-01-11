import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://vehicle-rental-6o3p.onrender.com/users/register', { name, email, phone, password });
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setError('Error registering. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    const googleToken = response.credential; // Getting the Google ID token
    try {
      // Send the Google ID token to the backend for authentication
      const result = await axios.post('https://vehicle-rental-6o3p.onrender.com/users/social-login', {
        token: googleToken, // Send the Google ID token
      });
      console.log(result.data);
      navigate('/login'); // Redirect to dashboard after successful login
    } catch (error) {
      setError('Error with Google login. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-center">Register</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        
        {/* Regular Email/Password Registration Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 mb-4 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full p-2 mb-4 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        {/* Google Login Button */}
        <div className="mt-4">
          <GoogleOAuthProvider clientId="926133325871-a0b45nq96jh6p96icer86agfhmf32ddm.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleResponse}
              onError={() => setError('Google login failed. Please try again.')}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
