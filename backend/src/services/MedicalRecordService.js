const { MedicalRecord, Patient, Dentist } = require('../models');
const logger = require('../utils/logger');

class MedicalRecordService {
  async findByPatientId(patientId) {
    try {
      const record = await MedicalRecord.findOne({
        where: { patientId },
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName', 'email'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName', 'specialty'] },
        ],
      });
      return record;
    } catch (error) {
      logger.error(`Error fetching medical record for patient ${patientId}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const existingRecord = await MedicalRecord.findOne({
        where: { patientId: data.patientId },
      });
      if (existingRecord) {
        throw new Error('Medical record already exists for this patient');
      }
      const record = await MedicalRecord.create(data);
      logger.info(`Medical record created with id: ${record.id}`);
      return await this.findByPatientId(record.patientId);
    } catch (error) {
      logger.error('Error creating medical record:', error);
      throw error;
    }
  }

  async update(patientId, data) {
    try {
      const record = await MedicalRecord.findOne({
        where: { patientId },
      });
      if (!record) {
        return null;
      }
      await record.update(data);
      logger.info(`Medical record for patient ${patientId} updated`);
      return await this.findByPatientId(patientId);
    } catch (error) {
      logger.error(`Error updating medical record for patient ${patientId}:`, error);
      throw error;
    }
  }

  async upsert(patientId, data) {
    try {
      const existingRecord = await MedicalRecord.findOne({
        where: { patientId },
      });
      if (existingRecord) {
        return await this.update(patientId, data);
      }
      return await this.create({ ...data, patientId });
    } catch (error) {
      logger.error(`Error upserting medical record for patient ${patientId}:`, error);
      throw error;
    }
  }
}

module.exports = new MedicalRecordService();
