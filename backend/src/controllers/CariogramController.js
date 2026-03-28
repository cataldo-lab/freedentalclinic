const cariogramService = require('../services/CariogramService');
const logger = require('../utils/logger');

class CariogramController {
  async getByPatientId(req, res) {
    try {
      const { patientId } = req.params;
      const cariogram = await cariogramService.findByPatientId(patientId);
      if (!cariogram) {
        return res.status(404).json({ error: 'Cariogram not found' });
      }
      res.json(cariogram);
    } catch (error) {
      logger.error('Error in getByPatientId cariogram:', error);
      res.status(500).json({ error: 'Failed to fetch cariogram' });
    }
  }

  async create(req, res) {
    try {
      const cariogram = await cariogramService.create(req.body);
      res.status(201).json(cariogram);
    } catch (error) {
      logger.error('Error in create cariogram:', error);
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create cariogram' });
    }
  }

  async update(req, res) {
    try {
      const { patientId } = req.params;
      const cariogram = await cariogramService.update(patientId, req.body);
      if (!cariogram) {
        return res.status(404).json({ error: 'Cariogram not found' });
      }
      res.json(cariogram);
    } catch (error) {
      logger.error('Error in update cariogram:', error);
      res.status(500).json({ error: 'Failed to update cariogram' });
    }
  }

  async upsert(req, res) {
    try {
      const { patientId } = req.params;
      const cariogram = await cariogramService.upsert(patientId, req.body);
      res.json(cariogram);
    } catch (error) {
      logger.error('Error in upsert cariogram:', error);
      res.status(500).json({ error: 'Failed to save cariogram' });
    }
  }
}

module.exports = new CariogramController();
