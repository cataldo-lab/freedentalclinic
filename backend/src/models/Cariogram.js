const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cariogram = sequelize.define('Cariogram', {
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
  // Diet
  dietFrequency: {
    type: DataTypes.ENUM('0', '1', '2', '3', '4', '5', '6', '7'),
    allowNull: true,
    defaultValue: '0',
    field: 'diet_frequency',
  },
  dietType: {
    type: DataTypes.ENUM('no_carbs', 'some_carbs', 'frequent_carbs', 'very_frequent_carbs'),
    allowNull: true,
    defaultValue: 'no_carbs',
    field: 'diet_type',
  },
  // Fluoride
  fluorideExposure: {
    type: DataTypes.ENUM('excellent', 'good', 'some', 'none'),
    allowNull: true,
    defaultValue: 'good',
    field: 'fluoride_exposure',
  },
  // Bacteria
  streptococcusMutans: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true,
    defaultValue: 'low',
    field: 'streptococcus_mutans',
  },
  lactobacillus: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true,
    defaultValue: 'low',
  },
  // Clinical
  pastCaries: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'past_caries',
  },
  currentCaries: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'current_caries',
  },
  fillings: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  missingTeeth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'missing_teeth',
  },
  // Other factors
  plaqueIndex: {
    type: DataTypes.ENUM('very_low', 'low', 'medium', 'high', 'very_high'),
    allowNull: true,
    defaultValue: 'low',
    field: 'plaque_index',
  },
  salivaFlow: {
    type: DataTypes.ENUM('high', 'normal', 'low', 'very_low'),
    allowNull: true,
    defaultValue: 'normal',
    field: 'saliva_flow',
  },
  salivaBuffer: {
    type: DataTypes.ENUM('high', 'normal', 'low'),
    allowNull: true,
    defaultValue: 'normal',
    field: 'saliva_buffer',
  },
  // Socioeconomic
  socioeconomicLevel: {
    type: DataTypes.ENUM('high', 'medium', 'low'),
    allowNull: true,
    defaultValue: 'medium',
    field: 'socioeconomic_level',
  },
  // Results
  cariesRisk: {
    type: DataTypes.ENUM('very_low', 'low', 'moderate', 'high', 'very_high'),
    allowNull: true,
    defaultValue: 'low',
    field: 'caries_risk',
  },
  dietScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'diet_score',
  },
  bacteriaScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'bacteria_score',
  },
  susceptibilityScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'susceptibility_score',
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'cariograms',
  timestamps: true,
  underscored: true,
});

Cariogram.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = Cariogram;
