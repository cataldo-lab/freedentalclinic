const dentalRecordService = require('../services/DentalRecordService');
const logger = require('../utils/logger');

class DentalRecordController {
  async getByPatientId(req, res) {
    try {
      const { patientId } = req.params;
      const record = await dentalRecordService.findByPatientId(patientId);
      if (!record) {
        return res.status(404).json({ error: 'Dental record not found' });
      }
      res.json(record);
    } catch (error) {
      logger.error('Error in getByPatientId dental record:', error);
      res.status(500).json({ error: 'Failed to fetch dental record' });
    }
  }

  async create(req, res) {
    try {
      const record = await dentalRecordService.create(req.body);
      res.status(201).json(record);
    } catch (error) {
      logger.error('Error in create dental record:', error);
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create dental record' });
    }
  }

  async update(req, res) {
    try {
      const { patientId } = req.params;
      const record = await dentalRecordService.update(patientId, req.body);
      if (!record) {
        return res.status(404).json({ error: 'Dental record not found' });
      }
      res.json(record);
    } catch (error) {
      logger.error('Error in update dental record:', error);
      res.status(500).json({ error: 'Failed to update dental record' });
    }
  }
}

module.exports = new DentalRecordController();
