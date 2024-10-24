// models/ticker.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticker = sequelize.define('Ticker', {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'tickers',
  });

  return Ticker;
};