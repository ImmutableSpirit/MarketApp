import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Header from './shared/components/Header';
//import Footer from './shared/components/Footer';
import Dashboard from './domains/dashboard/components/Dashboard';
import Login from './domains/authentication/components/Login';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
