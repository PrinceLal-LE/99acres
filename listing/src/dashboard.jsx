// import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Inside your DashboardPage.js


const DashboardPage = () => {
  const history = useNavigate();

  const handleLogout = () => {
    // Clear session and handle logout
    sessionStorage.removeItem('userSession');
    history.push('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>INVENTORY MANAGEMENT</h1>
      <div className="category-container">
        <div className="category" onClick={() => {/* Handle Booking Category Click */}}>
          <h2>BOOKING</h2>
          {/* Include icons or images as needed */}
        </div>
        <div className="category" onClick={() => {/* Handle Resale Category Click */}}>
          <h2>RESELL</h2>
          {/* Include icons or images as needed */}
        </div>
        <div className="category" onClick={() => {/* Handle Rent Category Click */}}>
          <h2>RENT</h2>
          {/* Include icons or images as needed */}
        </div>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
