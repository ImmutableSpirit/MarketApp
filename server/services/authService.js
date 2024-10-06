const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.registerUser = async (email, password) => {
  try {
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
          throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword });
      return user;
  } catch (err) {
      console.error('User registration error:', err);
      throw err; 
  }
};

exports.loginUser = async (email, password) => {
    try {
      const user = await User.findOne({ where: { email } }); 
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials'); 
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user: { id: user.id, email: user.email } }; 
    } catch (err) {
      console.error('Login error:', err);
      throw err; 
    }
  };
