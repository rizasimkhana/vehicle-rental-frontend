import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';
import PaymentConfirmation from './components/PaymentConfirmation';
import PaymentHistory from './components/PaymentHistory';
import { BookingProvider } from './services/BookingContext';
import VehicleDetails from './components/VehicleDetail';
import RentalHistory from './components/RentalHistory';
import BookingList from './components/BookingList';
import HomePage from './components/HomePage';
import BookingAdmin from './components/BookingAdmin';
import UsersList from './components/UsersList';
import AddVehicle from './components/AddVehicle';



function App() {
  return (
    <BookingProvider>
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/user-dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/booking/:vehicleId" element={<BookingForm />} />
        <Route path="/payment/:vehicleId" element={<PaymentForm />} /> {/* Payment form after booking */}
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} /> {/* Payment confirmation page */}
        <Route path="/payment-history" element={<PaymentHistory />} /> {/* User payment history */}
        <Route path="/vehicle/:vehicleId" element={<VehicleDetails />} />
        <Route path="/rental-history" element={<RentalHistory />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/bookings-admin" element={<BookingAdmin />} />
        <Route path="/user-accounts" element={<UsersList />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />

        </Routes>
    </Router>
    </BookingProvider>
  );
}

export default App;
