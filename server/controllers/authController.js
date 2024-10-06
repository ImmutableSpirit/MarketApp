const authService = require('../services/authService');
const User = require('../models/user');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.registerUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Email already registered') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.loginUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error during login' });
  }
};
