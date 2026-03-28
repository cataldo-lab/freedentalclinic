const medicalHistoryService = require('../services/MedicalHistoryService');
const logger = require('../utils/logger');

class MedicalHistoryController {
  async getByPatientId(req, res) {
    try {
      const { patientId } = req.params;
      const histories = await medicalHistoryService.findByPatientId(patientId);
      res.json(histories);
    } catch (error) {
      logger.error('Error in getByPatientId medical history:', error);
      res.status(500).json({ error: 'Failed to fetch medical histories' });
    }
  }

  async create(req, res) {
    try {
      const history = await medicalHistoryService.create(req.body);
      res.status(201).json(history);
    } catch (error) {
      logger.error('Error in create medical history:', error);
      res.status(500).json({ error: 'Failed to create medical history' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const history = await medicalHistoryService.findById(id);
      if (!history) {
        return res.status(404).json({ error: 'Medical history not found' });
      }
      res.json(history);
    } catch (error) {
      logger.error('Error in getById medical history:', error);
      res.status(500).json({ error: 'Failed to fetch medical history' });
    }
  }

  async addNote(req, res) {
    try {
      const { patientId } = req.params;
      const { title, description, dentistId } = req.body;
      const history = await medicalHistoryService.addNote(
        parseInt(patientId),
        dentistId ? parseInt(dentistId) : null,
        title,
        description
      );
      res.status(201).json(history);
    } catch (error) {
      logger.error('Error in addNote medical history:', error);
      res.status(500).json({ error: 'Failed to add note' });
    }
  }

  async addEntry(req, res) {
    try {
      const { patientId } = req.params;
      const { type, title, description, dentistId } = req.body;
      const history = await medicalHistoryService.addEntry(
        parseInt(patientId),
        type,
        title,
        description,
        dentistId ? parseInt(dentistId) : null
      );
      res.status(201).json(history);
    } catch (error) {
      logger.error('Error in addEntry medical history:', error);
      res.status(500).json({ error: 'Failed to add entry' });
    }
  }
}

module.exports = new MedicalHistoryController();
