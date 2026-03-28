const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Treatment = sequelize.define('Treatment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duration_minutes',
  },
}, {
  tableName: 'treatments',
  timestamps: true,
  underscored: true,
});

Treatment.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = Treatment;
