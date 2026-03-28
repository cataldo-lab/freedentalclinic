const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ToothRecord = sequelize.define('ToothRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dentalRecordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'dental_record_id',
    references: {
      model: 'dental_records',
      key: 'id',
    },
  },
  toothNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'tooth_number',
  },
  position: {
    type: DataTypes.ENUM(
      'sup_der', 'sup_izq', 'inf_der', 'inf_izq',
      'sup_der_sup', 'sup_der_inf', 'sup_izq_sup', 'sup_izq_inf',
      'inf_der_sup', 'inf_der_inf', 'inf_izq_sup', 'inf_izq_inf'
    ),
    allowNull: false,
  },
  condition: {
    type: DataTypes.ENUM(
      'sano', 'caries', 'obturado', 'endodonciado', 'extraido', 'ausente',
      'provisional', 'implante', 'corona', 'fractura', 'desgaste',
      'hipoplasia', 'mancha', 'restauracion_defectuosa'
    ),
    allowNull: false,
    defaultValue: 'sano',
  },
  surface: {
    type: DataTypes.ENUM('ninguna', 'oclusal', 'mesial', 'distal', 'vestibular', 'lingual', 'palatina', 'multiple'),
    allowNull: true,
    defaultValue: 'ninguna',
  },
  mobility: {
    type: DataTypes.ENUM('ninguna', 'grado_1', 'grado_2', 'grado_3'),
    allowNull: true,
    defaultValue: 'ninguna',
  },
  pain: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  notes: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  lastUpdateDentistId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'last_update_dentist_id',
  },
}, {
  tableName: 'tooth_records',
  timestamps: true,
  underscored: true,
});

ToothRecord.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = ToothRecord;
