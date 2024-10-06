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
          <button className="register-button">Register</button>
        </div>
      </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>
    </div>
  );
}

export default Login;