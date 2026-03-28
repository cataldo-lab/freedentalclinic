const { MedicalHistory, Patient, Dentist } = require('../models');
const logger = require('../utils/logger');

class MedicalHistoryService {
  async findByPatientId(patientId) {
    try {
      const histories = await MedicalHistory.findAll({
        where: { patientId },
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName'] },
        ],
        order: [['createdAt', 'DESC']],
      });
      return histories;
    } catch (error) {
      logger.error(`Error fetching medical histories for patient ${patientId}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const history = await MedicalHistory.create(data);
      logger.info(`Medical history created with id: ${history.id}`);
      return await this.findById(history.id);
    } catch (error) {
      logger.error('Error creating medical history:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const history = await MedicalHistory.findByPk(id, {
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName'] },
        ],
      });
      return history;
    } catch (error) {
      logger.error(`Error fetching medical history ${id}:`, error);
      throw error;
    }
  }

  async logCariogram(patientId, dentistId, newData, previousData = null) {
    const title = previousData ? 'Actualización de Cariograma' : 'Cariograma Inicial';
    const riskLabels = {
      very_low: 'Muy Bajo',
      low: 'Bajo',
      moderate: 'Moderado',
      high: 'Alto',
      very_high: 'Muy Alto',
    };
    
    const description = `Riesgo cariogénico: ${riskLabels[newData.cariesRisk] || 'No determinado'}`;

    return await this.create({
      patientId,
      dentistId,
      type: 'cariogram',
      title,
      description,
      data: newData,
      previousData,
    });
  }

  async logDentalRecord(patientId, dentistId, newData, previousData = null) {
    const title = previousData ? 'Actualización de Ficha Odontológica' : 'Ficha Odontológica Inicial';
    
    const conditions = newData.teeth?.filter(t => t.condition !== 'sano').map(t => `${t.toothNumber}: ${t.condition}`).join(', ') || 'Sin cambios';

    return await this.create({
      patientId,
      dentistId,
      type: 'dental_record',
      title,
      description: `Piezas modificadas: ${conditions}`,
      data: newData,
      previousData,
    });
  }

  async logBudget(patientId, dentistId, budgetData, action = 'created') {
    const actionLabels = {
      created: 'Presupuesto Creado',
      updated: 'Presupuesto Actualizado',
      accepted: 'Presupuesto Aceptado',
      rejected: 'Presupuesto Rechazado',
      deleted: 'Presupuesto Eliminado',
    };

    return await this.create({
      patientId,
      dentistId,
      type: 'budget',
      title: actionLabels[action] || 'Presupuesto',
      description: `Total: $${budgetData.total?.toLocaleString('es-CL') || 0} CLP`,
      data: budgetData,
    });
  }

  async logAppointment(patientId, dentistId, appointmentData, action = 'created') {
    const actionLabels = {
      created: 'Cita Programada',
      updated: 'Cita Actualizada',
      completed: 'Cita Completada',
      cancelled: 'Cita Cancelada',
    };

    return await this.create({
      patientId,
      dentistId,
      type: 'appointment',
      title: actionLabels[action] || 'Cita',
      description: `${appointmentData.treatmentName || ''} - ${appointmentData.appointmentDate} ${appointmentData.appointmentTime}`,
      data: appointmentData,
    });
  }

  async addNote(patientId, dentistId, title, description) {
    return await this.create({
      patientId,
      dentistId,
      type: 'note',
      title,
      description,
      data: null,
    });
  }

  async addEntry(patientId, type, title, description, dentistId = null) {
    return await this.create({
      patientId,
      dentistId,
      type,
      title,
      description,
      data: null,
    });
  }
}

module.exports = new MedicalHistoryService();
