const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

class Ticker extends Model {}

Ticker.init({
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Ticker',
  tableName: 'tickers',
});

Ticker.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Ticker, { foreignKey: 'userId' });

module.exports = Ticker;