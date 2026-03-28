const dentistService = require('../services/DentistService');
const logger = require('../utils/logger');

class DentistController {
  async getAll(req, res) {
    try {
      const dentists = await dentistService.findAll();
      res.json(dentists);
    } catch (error) {
      logger.error('Error in getAll dentists:', error);
      res.status(500).json({ error: 'Failed to fetch dentists' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const dentist = await dentistService.findById(id);
      if (!dentist) {
        return res.status(404).json({ error: 'Dentist not found' });
      }
      res.json(dentist);
    } catch (error) {
      logger.error('Error in getById dentist:', error);
      res.status(500).json({ error: 'Failed to fetch dentist' });
    }
  }

  async create(req, res) {
    try {
      const dentist = await dentistService.create(req.body);
      res.status(201).json(dentist);
    } catch (error) {
      logger.error('Error in create dentist:', error);
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create dentist' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const dentist = await dentistService.update(id, req.body);
      if (!dentist) {
        return res.status(404).json({ error: 'Dentist not found' });
      }
      res.json(dentist);
    } catch (error) {
      logger.error('Error in update dentist:', error);
      if (error.message.includes('already in use')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to update dentist' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await dentistService.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Dentist not found' });
      }
      res.status(204).send();
    } catch (error) {
      logger.error('Error in delete dentist:', error);
      res.status(500).json({ error: 'Failed to delete dentist' });
    }
  }
}

module.exports = new DentistController();
