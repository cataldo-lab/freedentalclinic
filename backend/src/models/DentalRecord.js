const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DentalRecord = sequelize.define('DentalRecord', {
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
  occlusion: {
    type: DataTypes.ENUM('normal', 'maloclusion_clase_I', 'maloclusion_clase_II', 'malocluse_clase_III', 'abierta', 'cruzada'),
    allowNull: true,
    defaultValue: 'normal',
  },
  periodontalStatus: {
    type: DataTypes.ENUM('sano', 'gingivitis', 'periodontitis_leve', 'periodontitis_moderada', 'periodontitis_severa'),
    allowNull: true,
    defaultValue: 'sano',
    field: 'periodontal_status',
  },
  hygieneGrade: {
    type: DataTypes.ENUM('buena', 'regular', 'mala'),
    allowNull: true,
    defaultValue: 'buena',
    field: 'hygiene_grade',
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lastUpdateDentistId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'last_update_dentist_id',
    references: {
      model: 'dentists',
      key: 'id',
    },
  },
}, {
  tableName: 'dental_records',
  timestamps: true,
  underscored: true,
});

DentalRecord.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = DentalRecord;
