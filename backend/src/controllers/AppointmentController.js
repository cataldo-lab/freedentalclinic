const appointmentService = require('../services/AppointmentService');
const logger = require('../utils/logger');

class AppointmentController {
  async getAll(req, res) {
    try {
      const filters = {
        status: req.query.status,
        date: req.query.date,
        dentistId: req.query.dentistId,
        patientId: req.query.patientId,
      };
      const appointments = await appointmentService.findAll(filters);
      res.json(appointments);
    } catch (error) {
      logger.error('Error in getAll appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.findById(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      logger.error('Error in getById appointment:', error);
      res.status(500).json({ error: 'Failed to fetch appointment' });
    }
  }

  async create(req, res) {
    try {
      const appointment = await appointmentService.create(req.body);
      res.status(201).json(appointment);
    } catch (error) {
      logger.error('Error in create appointment:', error);
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.update(id, req.body);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      logger.error('Error in update appointment:', error);
      res.status(500).json({ error: 'Failed to update appointment' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await appointmentService.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.status(204).send();
    } catch (error) {
      logger.error('Error in delete appointment:', error);
      res.status(500).json({ error: 'Failed to delete appointment' });
    }
  }

  async getToday(req, res) {
    try {
      const appointments = await appointmentService.getTodayAppointments();
      res.json(appointments);
    } catch (error) {
      logger.error('Error in getToday appointments:', error);
      res.status(500).json({ error: 'Failed to fetch today appointments' });
    }
  }

  async getByDate(req, res) {
    try {
      const { date } = req.params;
      const appointments = await appointmentService.findByDate(date);
      res.json(appointments);
    } catch (error) {
      logger.error('Error in getByDate appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments by date' });
    }
  }
}

module.exports = new AppointmentController();
