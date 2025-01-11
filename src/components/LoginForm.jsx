import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleLogin from @react-oauth/google

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle standard login form submission (for email/password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const { token, user } = response;

      // If user is not verified, show an error
      if (!user.verified) {
        setError('Please verify your email before logging in');
        return;
      }

      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to the appropriate dashboard based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message); // Display the error message from the server
      } else {
        setError('Invalid credentials');
      }
    }
  };

  // Google login success handler
  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;  // Google login response provides the credential

      // Send token to backend for verification
      const googleResponse = await loginUser({ token: googleToken });

      const { token, user } = googleResponse;

      // If user is not verified, show an error
      if (!user.verified) {
        setError('Please verify your email before logging in');
        return;
      }

      // Store token and user in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect user based on their role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      setError('Error with Google login. Please try again.');
    }
  };

  const handleFailure = (error) => {
    setError('Google login failed. Please try again.');
    console.error(error);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-center">Login</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          >
            Login
          </button>
        </form>

        {/* Google Login Button */}
        <div className="my-4">
          <GoogleOAuthProvider clientId="926133325871-a0b45nq96jh6p96icer86agfhmf32ddm.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleLogin}  // Success handler
              onError={handleFailure}         // Failure handler
              shape="pill"                    // Optional: set button shape to pill
              width="100%"                    // Optional: set width to full (100%)
              useOneTap={true}                // Optional: use the One-Tap feature
              theme="outline"                 // Optional: Set button theme (you can choose outline, filled, etc.)
              text=""                          // Optional: customize text in the button
              render={({ onClick }) => (
                <button
                  onClick={onClick}
                  className="w-full p-2 border rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login with Google
                </button>
              )}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
