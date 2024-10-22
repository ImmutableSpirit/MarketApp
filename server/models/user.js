const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
  static associate(models) {
    // Define association here
    User.hasMany(models.Ticker, { foreignKey: 'userId' });
  }
}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
});

module.exports = User;