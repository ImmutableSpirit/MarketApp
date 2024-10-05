const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

exports.registerUser = async (email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await user.create({ email, password: hashedPassword });
        return user; // Return the created user
      } catch (err) {
        console.error('User registration error:', err);
        throw new Error('Error creating user');
      }
};

exports.loginUser = async (email, password) => {
    try {
      const user = await User.findOne({ where: { email } }); // Use Sequelize to find the user
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials'); // Provide a clear error message
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user: { id: user.id, email: user.email } }; // Return user info alongside the token
    } catch (err) {
      console.error('Login error:', err);
      throw new Error('Error during login'); // Provide a more user-friendly error message
    }
  };
