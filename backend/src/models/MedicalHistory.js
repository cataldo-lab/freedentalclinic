const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MedicalHistory = sequelize.define('MedicalHistory', {
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
  type: {
    type: DataTypes.ENUM('cariogram', 'dental_record', 'budget', 'appointment', 'note'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  previousData: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'previous_data',
  },
}, {
  tableName: 'medical_histories',
  timestamps: true,
  underscored: true,
});

MedicalHistory.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = MedicalHistory;
