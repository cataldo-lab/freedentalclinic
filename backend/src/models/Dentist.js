const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Dentist = sequelize.define('Dentist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name',
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  specialty: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  licenseNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
    field: 'license_number',
  },
}, {
  tableName: 'dentists',
  timestamps: true,
  underscored: true,
});

Dentist.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = Dentist;
