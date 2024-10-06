import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../../assets/logo-market-app.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigate('/dashboard');
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        // You can add additional logic here, such as:
        // - Showing a success message to the user
        // - Automatically logging in the user
        // - Redirecting to a different page
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        // Handle registration errors (e.g., display error message to user)
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div className="login-container">      
      <div className="login-panel">
        <h1>Welcome</h1>
        <p>Sign In to Market App</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <button className="login-button" onClick={handleLogin}>Login</button>
          <button className="register-button" onClick={handleRegister}>Register</button>
        </div>
      </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>
    </div>
  );
}

export default Login;