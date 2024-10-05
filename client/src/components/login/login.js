import React from 'react';
import './login.css'; // Import your CSS file

const Login = () => {
    const handleLogin = () => {
        // todo
    };

    const handleRegister = () => {
        // Logic for redirecting to the registration page        
        // history.push('/register');
    };

    return (
        <div className="login-container">
          <h2>Login</h2>
          <form className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="button-group">
              <button type="submit" className="login-btn">Login</button>
              <button type="button" onClick={handleRegister} className="register-button">Register</button>
            </div>
          </form>
        </div>
      );
};

export default Login;
