const { Treatment } = require('../models');
const logger = require('../utils/logger');

class TreatmentService {
  async findAll() {
    try {
      const treatments = await Treatment.findAll({
        order: [['name', 'ASC']],
      });
      return treatments;
    } catch (error) {
      logger.error('Error fetching treatments:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const treatment = await Treatment.findByPk(id);
      if (!treatment) {
        return null;
      }
      return treatment;
    } catch (error) {
      logger.error(`Error fetching treatment ${id}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const treatment = await Treatment.create(data);
      logger.info(`Treatment created with id: ${treatment.id}`);
      return treatment;
    } catch (error) {
      logger.error('Error creating treatment:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const treatment = await Treatment.findByPk(id);
      if (!treatment) {
        return null;
      }
      await treatment.update(data);
      logger.info(`Treatment ${id} updated`);
      return treatment;
    } catch (error) {
      logger.error(`Error updating treatment ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const treatment = await Treatment.findByPk(id);
      if (!treatment) {
        return false;
      }
      await treatment.destroy();
      logger.info(`Treatment ${id} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting treatment ${id}:`, error);
      throw error;
    }
  }

  async count() {
    try {
      const count = await Treatment.count();
      return count;
    } catch (error) {
      logger.error('Error counting treatments:', error);
      throw error;
    }
  }
}

module.exports = new TreatmentService();
