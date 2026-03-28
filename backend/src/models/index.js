const Patient = require('./Patient');
const Dentist = require('./Dentist');
const Treatment = require('./Treatment');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const DentalRecord = require('./DentalRecord');
const ToothRecord = require('./ToothRecord');
const Cariogram = require('./Cariogram');
const Budget = require('./Budget');
const BudgetItem = require('./BudgetItem');
const MedicalHistory = require('./MedicalHistory');

Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(Dentist, { foreignKey: 'dentistId', as: 'dentist' });
Appointment.belongsTo(Treatment, { foreignKey: 'treatmentId', as: 'treatment' });

Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Dentist.hasMany(Appointment, { foreignKey: 'dentistId', as: 'appointments' });
Treatment.hasMany(Appointment, { foreignKey: 'treatmentId', as: 'appointments' });

MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
MedicalRecord.belongsTo(Dentist, { foreignKey: 'dentistId', as: 'dentist' });

Patient.hasOne(MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecord' });
Dentist.hasMany(MedicalRecord, { foreignKey: 'dentistId', as: 'medicalRecords' });

DentalRecord.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
DentalRecord.belongsTo(Dentist, { foreignKey: 'lastUpdateDentistId', as: 'dentist' });
DentalRecord.hasMany(ToothRecord, { foreignKey: 'dentalRecordId', as: 'teeth' });

ToothRecord.belongsTo(DentalRecord, { foreignKey: 'dentalRecordId', as: 'dentalRecord' });

Patient.hasOne(DentalRecord, { foreignKey: 'patientId', as: 'dentalRecord' });

Cariogram.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Cariogram.belongsTo(Dentist, { foreignKey: 'dentistId', as: 'dentist' });

Patient.hasOne(Cariogram, { foreignKey: 'patientId', as: 'cariogram' });

Budget.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Budget.belongsTo(Dentist, { foreignKey: 'dentistId', as: 'dentist' });
Budget.hasMany(BudgetItem, { foreignKey: 'budgetId', as: 'items' });

BudgetItem.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });

Patient.hasMany(Budget, { foreignKey: 'patientId', as: 'budgets' });

MedicalHistory.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
MedicalHistory.belongsTo(Dentist, { foreignKey: 'dentistId', as: 'dentist' });

Patient.hasMany(MedicalHistory, { foreignKey: 'patientId', as: 'medicalHistories' });

module.exports = {
  Patient,
  Dentist,
  Treatment,
  Appointment,
  MedicalRecord,
  DentalRecord,
  ToothRecord,
  Cariogram,
  Budget,
  BudgetItem,
  MedicalHistory,
};
