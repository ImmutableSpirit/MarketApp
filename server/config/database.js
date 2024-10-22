require('dotenv').config();
const { Sequelize } = require('sequelize');
const User = require('../models/user');
const Ticker = require('../models/ticker');

console.log('Current working directory:', process.cwd());
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

process.env.TEST_VAR = 'This is a test';
console.log('TEST_VAR:', process.env.TEST_VAR);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully!');
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });

  module.exports = {
    sequelize,
    User,
    Ticker
  };
