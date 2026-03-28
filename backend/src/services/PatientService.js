const { Patient } = require('../models');
const logger = require('../utils/logger');

class PatientService {
  async findAll() {
    try {
      const patients = await Patient.findAll({
        order: [['lastName', 'ASC'], ['name', 'ASC']],
      });
      return patients;
    } catch (error) {
      logger.error('Error fetching patients:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const patient = await Patient.findByPk(id);
      if (!patient) {
        return null;
      }
      return patient;
    } catch (error) {
      logger.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const patient = await Patient.findOne({ where: { email } });
      return patient;
    } catch (error) {
      logger.error(`Error fetching patient by email ${email}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const existingPatient = await this.findByEmail(data.email);
      if (existingPatient) {
        throw new Error('Patient with this email already exists');
      }
      const patient = await Patient.create(data);
      logger.info(`Patient created with id: ${patient.id}`);
      return patient;
    } catch (error) {
      logger.error('Error creating patient:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const patient = await Patient.findByPk(id);
      if (!patient) {
        return null;
      }
      const existingPatient = await this.findByEmail(data.email);
      if (existingPatient && existingPatient.id !== id) {
        throw new Error('Email already in use by another patient');
      }
      await patient.update(data);
      logger.info(`Patient ${id} updated`);
      return patient;
    } catch (error) {
      logger.error(`Error updating patient ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const patient = await Patient.findByPk(id);
      if (!patient) {
        return false;
      }
      await patient.destroy();
      logger.info(`Patient ${id} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  }

  async search(query) {
    try {
      const patients = await Patient.findAll({
        where: {
          $or: [
            { name: { $iLike: `%${query}%` } },
            { lastName: { $iLike: `%${query}%` } },
            { email: { $iLike: `%${query}%` } },
          ],
        },
        order: [['lastName', 'ASC'], ['name', 'ASC']],
      });
      return patients;
    } catch (error) {
      logger.error('Error searching patients:', error);
      throw error;
    }
  }

  async count() {
    try {
      const count = await Patient.count();
      return count;
    } catch (error) {
      logger.error('Error counting patients:', error);
      throw error;
    }
  }
}

module.exports = new PatientService();
