const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'patient_id',
    references: {
      model: 'patients',
      key: 'id',
    },
  },
  dentistId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'dentist_id',
    references: {
      model: 'dentists',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired'),
    allowNull: false,
    defaultValue: 'draft',
  },
  subtotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  validUntil: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'valid_until',
  },
}, {
  tableName: 'budgets',
  timestamps: true,
  underscored: true,
});

Budget.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = Budget;
