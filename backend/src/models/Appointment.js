const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
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
    allowNull: false,
    field: 'dentist_id',
    references: {
      model: 'dentists',
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
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'appointment_date',
  },
  appointmentTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'appointment_time',
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
    allowNull: false,
    defaultValue: 'scheduled',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true,
});

Appointment.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = Appointment;
