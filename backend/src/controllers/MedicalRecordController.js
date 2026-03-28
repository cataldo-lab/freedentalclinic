const medicalRecordService = require('../services/MedicalRecordService');
const logger = require('../utils/logger');

class MedicalRecordController {
  async getByPatientId(req, res) {
    try {
      const { patientId } = req.params;
      const record = await medicalRecordService.findByPatientId(patientId);
      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' });
      }
      res.json(record);
    } catch (error) {
      logger.error('Error in getByPatientId medical record:', error);
      res.status(500).json({ error: 'Failed to fetch medical record' });
    }
  }

  async create(req, res) {
    try {
      const record = await medicalRecordService.create(req.body);
      res.status(201).json(record);
    } catch (error) {
      logger.error('Error in create medical record:', error);
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create medical record' });
    }
  }

  async update(req, res) {
    try {
      const { patientId } = req.params;
      const record = await medicalRecordService.update(patientId, req.body);
      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' });
      }
      res.json(record);
    } catch (error) {
      logger.error('Error in update medical record:', error);
      res.status(500).json({ error: 'Failed to update medical record' });
    }
  }

  async upsert(req, res) {
    try {
      const { patientId } = req.params;
      const record = await medicalRecordService.upsert(patientId, req.body);
      res.json(record);
    } catch (error) {
      logger.error('Error in upsert medical record:', error);
      res.status(500).json({ error: 'Failed to upsert medical record' });
    }
  }
}

module.exports = new MedicalRecordController();
