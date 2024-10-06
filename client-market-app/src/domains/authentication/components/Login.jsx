import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../../assets/logo-market-app.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [errorKey, setErrorKey] = useState(0);
  const [errors, setErrors] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [successKey, setSuccessKey] = useState(0);

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
        setErrors([data.message || 'Login failed']);
        setErrorKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors(['An error occurred during login']);
      setErrorKey(prevKey => prevKey + 1);
    }
  };

  // Remove errors after timer ends
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {        
        setErrors([]);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    if (successMessages.length > 0) {
      const timer = setTimeout(() => {
        setSuccessMessages([]);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [successMessages]);

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
        setErrorKey(prevKey => prevKey + 1);
      } else {
        setSuccessMessages(['Registration successful! Please log in.']);
        setSuccessKey(prevKey => prevKey + 1);
        setEmail('');
        setPassword('');
        console.log('Registration successful');        
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
      setErrorKey(prevKey => prevKey + 1);
    }
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>
      <div className="content-grid">
        <div className="success-message-container">
          {successMessages.map((message, index) => (
            <div key={`${successKey}-${index}`} className="success-message">
              {message}
            </div>
          ))}
        </div>
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
          {errors.map((error, index) => (
            <div key={`${errorKey}-${index}`} className="error-message">
              {error}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;