const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BudgetItem = sequelize.define('BudgetItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  budgetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'budget_id',
    references: {
      model: 'budgets',
      key: 'id',
    },
  },
  treatmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'treatment_id',
    references: {
      model: 'treatments',
      key: 'id',
    },
  },
  treatmentName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'treatment_name',
  },
  unitPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'unit_price',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  subtotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'budget_items',
  timestamps: true,
  underscored: true,
});

BudgetItem.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = BudgetItem;
