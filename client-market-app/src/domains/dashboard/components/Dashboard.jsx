import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2 className="welcome-message">Welcome to the Dashboard</h2>
      <div className="dashboard-panel">
        <h3>Dashboard Content</h3>
        <p>Market stuff goes here</p>
      </div>
    </div>
  );
}

export default Dashboard;