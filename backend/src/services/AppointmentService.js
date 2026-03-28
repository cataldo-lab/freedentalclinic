const { Appointment, Patient, Dentist, Treatment } = require('../models');
const logger = require('../utils/logger');

class AppointmentService {
  async findAll(filters = {}) {
    try {
      const where = {};
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.date) {
        where.appointmentDate = filters.date;
      }
      if (filters.dentistId) {
        where.dentistId = filters.dentistId;
      }
      if (filters.patientId) {
        where.patientId = filters.patientId;
      }

      const appointments = await Appointment.findAll({
        where,
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName', 'email', 'phone'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName', 'specialty'] },
          { model: Treatment, as: 'treatment', attributes: ['id', 'name', 'price', 'durationMinutes'] },
        ],
        order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']],
      });
      return appointments;
    } catch (error) {
      logger.error('Error fetching appointments:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName', 'email', 'phone'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName', 'specialty'] },
          { model: Treatment, as: 'treatment', attributes: ['id', 'name', 'price', 'durationMinutes'] },
        ],
      });
      if (!appointment) {
        return null;
      }
      return appointment;
    } catch (error) {
      logger.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const appointment = await Appointment.create(data);
      logger.info(`Appointment created with id: ${appointment.id}`);
      return await this.findById(appointment.id);
    } catch (error) {
      logger.error('Error creating appointment:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return null;
      }
      await appointment.update(data);
      logger.info(`Appointment ${id} updated`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error updating appointment ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return false;
      }
      await appointment.destroy();
      logger.info(`Appointment ${id} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting appointment ${id}:`, error);
      throw error;
    }
  }

  async findByDate(date) {
    try {
      const appointments = await Appointment.findAll({
        where: { appointmentDate: date },
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName', 'email', 'phone'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName', 'specialty'] },
          { model: Treatment, as: 'treatment', attributes: ['id', 'name', 'price', 'durationMinutes'] },
        ],
        order: [['appointmentTime', 'ASC']],
      });
      return appointments;
    } catch (error) {
      logger.error(`Error fetching appointments for date ${date}:`, error);
      throw error;
    }
  }

  async getTodayAppointments() {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await this.findByDate(today);
    } catch (error) {
      logger.error('Error fetching today appointments:', error);
      throw error;
    }
  }

  async count() {
    try {
      const count = await Appointment.count();
      return count;
    } catch (error) {
      logger.error('Error counting appointments:', error);
      throw error;
    }
  }

  async countByStatus(status) {
    try {
      const count = await Appointment.count({ where: { status } });
      return count;
    } catch (error) {
      logger.error(`Error counting appointments by status ${status}:`, error);
      throw error;
    }
  }
}

module.exports = new AppointmentService();
