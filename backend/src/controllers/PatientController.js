const patientService = require('../services/PatientService');
const logger = require('../utils/logger');

class PatientController {
  async getAll(req, res) {
    try {
      const patients = await patientService.findAll();
      res.json(patients);
    } catch (error) {
      logger.error('Error in getAll patients:', error);
      res.status(500).json({ error: 'Failed to fetch patients' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const patient = await patientService.findById(id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      logger.error('Error in getById patient:', error);
      res.status(500).json({ error: 'Failed to fetch patient' });
    }
  }

  async create(req, res) {
    try {
      const patient = await patientService.create(req.body);
      res.status(201).json(patient);
    } catch (error) {
      logger.error('Error in create patient:', error);
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create patient' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const patient = await patientService.update(id, req.body);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      logger.error('Error in update patient:', error);
      if (error.message.includes('already in use')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to update patient' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await patientService.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.status(204).send();
    } catch (error) {
      logger.error('Error in delete patient:', error);
      res.status(500).json({ error: 'Failed to delete patient' });
    }
  }

  async search(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const patients = await patientService.search(q);
      res.json(patients);
    } catch (error) {
      logger.error('Error in search patients:', error);
      res.status(500).json({ error: 'Failed to search patients' });
    }
  }
}

module.exports = new PatientController();
