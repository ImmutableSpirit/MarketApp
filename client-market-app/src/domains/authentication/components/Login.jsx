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

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {        
        console.log('Registration successful:', data);
        // You can add additional logic here, such as:
        // - Showing a success message to the user
        // - Automatically logging in the user
        // - Redirecting to a different page
      } else {        
        setErrorMessage(data.message || 'Registration failed');
        setErrorKey(prevKey => prevKey + 1);
        console.error('Registration failed:', data); // todo: log with Morgan
        // Handle registration errors (e.g., display error message to user)
      }
    } catch (error) {
      setErrorMessage('Registration failed');
      setErrorKey(prevKey => prevKey + 1);
      console.error('Error during registration:', error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div className="login-container">      
      <div className="login-panel">
        <h1>Welcome</h1>
        <p>Sign In to Market App</p>
        <div className="error-message-container">
          {errorMessage && (
            <div key={errorKey} className="error-message">
              {errorMessage}
            </div>
          )}
        </div>
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