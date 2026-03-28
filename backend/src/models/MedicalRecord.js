const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
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
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  medicalConditions: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'medical_conditions',
  },
  medications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'medical_records',
  timestamps: true,
  underscored: true,
});

MedicalRecord.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = MedicalRecord;
