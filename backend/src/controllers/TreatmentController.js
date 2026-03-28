const treatmentService = require('../services/TreatmentService');
const logger = require('../utils/logger');

class TreatmentController {
  async getAll(req, res) {
    try {
      const treatments = await treatmentService.findAll();
      res.json(treatments);
    } catch (error) {
      logger.error('Error in getAll treatments:', error);
      res.status(500).json({ error: 'Failed to fetch treatments' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const treatment = await treatmentService.findById(id);
      if (!treatment) {
        return res.status(404).json({ error: 'Treatment not found' });
      }
      res.json(treatment);
    } catch (error) {
      logger.error('Error in getById treatment:', error);
      res.status(500).json({ error: 'Failed to fetch treatment' });
    }
  }

  async create(req, res) {
    try {
      const treatment = await treatmentService.create(req.body);
      res.status(201).json(treatment);
    } catch (error) {
      logger.error('Error in create treatment:', error);
      res.status(500).json({ error: 'Failed to create treatment' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const treatment = await treatmentService.update(id, req.body);
      if (!treatment) {
        return res.status(404).json({ error: 'Treatment not found' });
      }
      res.json(treatment);
    } catch (error) {
      logger.error('Error in update treatment:', error);
      res.status(500).json({ error: 'Failed to update treatment' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await treatmentService.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Treatment not found' });
      }
      res.status(204).send();
    } catch (error) {
      logger.error('Error in delete treatment:', error);
      res.status(500).json({ error: 'Failed to delete treatment' });
    }
  }
}

module.exports = new TreatmentController();
