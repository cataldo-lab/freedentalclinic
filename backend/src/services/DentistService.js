const { Dentist } = require('../models');
const logger = require('../utils/logger');

class DentistService {
  async findAll() {
    try {
      const dentists = await Dentist.findAll({
        order: [['lastName', 'ASC'], ['name', 'ASC']],
      });
      return dentists;
    } catch (error) {
      logger.error('Error fetching dentists:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const dentist = await Dentist.findByPk(id);
      if (!dentist) {
        return null;
      }
      return dentist;
    } catch (error) {
      logger.error(`Error fetching dentist ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const dentist = await Dentist.findOne({ where: { email } });
      return dentist;
    } catch (error) {
      logger.error(`Error fetching dentist by email ${email}:`, error);
      throw error;
    }
  }

  async findByLicense(licenseNumber) {
    try {
      const dentist = await Dentist.findOne({ where: { licenseNumber } });
      return dentist;
    } catch (error) {
      logger.error(`Error fetching dentist by license ${licenseNumber}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      if (data.email) {
        const existingDentist = await this.findByEmail(data.email);
        if (existingDentist) {
          throw new Error('Dentist with this email already exists');
        }
      }
      if (data.licenseNumber) {
        const existingDentist = await this.findByLicense(data.licenseNumber);
        if (existingDentist) {
          throw new Error('Dentist with this license number already exists');
        }
      }
      const dentist = await Dentist.create(data);
      logger.info(`Dentist created with id: ${dentist.id}`);
      return dentist;
    } catch (error) {
      logger.error('Error creating dentist:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const dentist = await Dentist.findByPk(id);
      if (!dentist) {
        return null;
      }
      if (data.email) {
        const existingDentist = await this.findByEmail(data.email);
        if (existingDentist && existingDentist.id !== id) {
          throw new Error('Email already in use by another dentist');
        }
      }
      if (data.licenseNumber) {
        const existingDentist = await this.findByLicense(data.licenseNumber);
        if (existingDentist && existingDentist.id !== id) {
          throw new Error('License number already in use by another dentist');
        }
      }
      await dentist.update(data);
      logger.info(`Dentist ${id} updated`);
      return dentist;
    } catch (error) {
      logger.error(`Error updating dentist ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const dentist = await Dentist.findByPk(id);
      if (!dentist) {
        return false;
      }
      await dentist.destroy();
      logger.info(`Dentist ${id} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting dentist ${id}:`, error);
      throw error;
    }
  }

  async count() {
    try {
      const count = await Dentist.count();
      return count;
    } catch (error) {
      logger.error('Error counting dentists:', error);
      throw error;
    }
  }
}

module.exports = new DentistService();
