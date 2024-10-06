import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../../assets/logo-market-app.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState(0);
  const [errors, setErrors] = useState([]);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage or a secure cookie
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'Login failed');
        setErrorKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login');
      setErrorKey(prevKey => prevKey + 1);
    }
  };

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors([]); 
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors.map(error => error.msg));
        } else {
          setErrors([data.message || 'An error occurred during registration']);
        }
      } else {
        // Handle successful registration
        console.log('Registration successful');
        // Redirect or update UI as needed
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    }
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>
      <div className="content-grid">
        <div className="grid-item"></div> {/* Empty left column */}
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
        <div className="error-message-container">
          {errorMessage && (
            <div key={errorKey} className="error-message">
              {errorMessage}
            </div>
          )}
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;