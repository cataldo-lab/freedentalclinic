const { DentalRecord, ToothRecord, Patient, Dentist } = require('../models');
const logger = require('../utils/logger');

class DentalRecordService {
  async findByPatientId(patientId) {
    try {
      const record = await DentalRecord.findOne({
        where: { patientId },
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName', 'email', 'dateOfBirth'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName'] },
        ],
      });

      if (!record) {
        return null;
      }

      const teeth = await ToothRecord.findAll({
        where: { dentalRecordId: record.id },
        order: [['toothNumber', 'ASC'], ['position', 'ASC']],
      });

      return { ...record.toJSON(), teeth };
    } catch (error) {
      logger.error(`Error fetching dental record for patient ${patientId}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const existingRecord = await DentalRecord.findOne({
        where: { patientId: data.patientId },
      });

      if (existingRecord) {
        throw new Error('Dental record already exists for this patient');
      }

      const record = await DentalRecord.create({
        patientId: data.patientId,
        dentistId: data.dentistId,
        occlusion: data.occlusion || 'normal',
        periodontalStatus: data.periodontalStatus || 'sano',
        hygieneGrade: data.hygieneGrade || 'buena',
        observations: data.observations || '',
        lastUpdateDentistId: data.dentistId,
      });

      if (data.teeth && data.teeth.length > 0) {
        const teethData = data.teeth.map(tooth => ({
          ...tooth,
          dentalRecordId: record.id,
          lastUpdateDentistId: data.dentistId,
        }));
        await ToothRecord.bulkCreate(teethData);
      } else {
        await this.initializeTeeth(record.id, data.dentistId);
      }

      logger.info(`Dental record created with id: ${record.id}`);
      return await this.findByPatientId(record.patientId);
    } catch (error) {
      logger.error('Error creating dental record:', error);
      throw error;
    }
  }

  async update(patientId, data) {
    try {
      const record = await DentalRecord.findOne({
        where: { patientId },
      });

      if (!record) {
        return null;
      }

      await record.update({
        occlusion: data.occlusion,
        periodontalStatus: data.periodontalStatus,
        hygieneGrade: data.hygieneGrade,
        observations: data.observations,
        lastUpdateDentistId: data.dentistId,
      });

      if (data.teeth) {
        for (const tooth of data.teeth) {
          if (tooth.id) {
            await ToothRecord.update(
              {
                condition: tooth.condition,
                surface: tooth.surface,
                mobility: tooth.mobility,
                pain: tooth.pain,
                notes: tooth.notes,
                lastUpdateDentistId: data.dentistId,
              },
              { where: { id: tooth.id } }
            );
          } else if (tooth.toothNumber) {
            await ToothRecord.create({
              dentalRecordId: record.id,
              toothNumber: tooth.toothNumber,
              position: tooth.position,
              condition: tooth.condition || 'sano',
              surface: tooth.surface || 'ninguna',
              mobility: tooth.mobility || 'ninguna',
              pain: tooth.pain || false,
              notes: tooth.notes || '',
              lastUpdateDentistId: data.dentistId,
            });
          }
        }
      }

      logger.info(`Dental record for patient ${patientId} updated`);
      return await this.findByPatientId(patientId);
    } catch (error) {
      logger.error(`Error updating dental record for patient ${patientId}:`, error);
      throw error;
    }
  }

  async initializeTeeth(dentalRecordId, dentistId) {
    const adultTeeth = [
      { toothNumber: '18', position: 'sup_der' },
      { toothNumber: '17', position: 'sup_der' },
      { toothNumber: '16', position: 'sup_der' },
      { toothNumber: '15', position: 'sup_der' },
      { toothNumber: '14', position: 'sup_der' },
      { toothNumber: '13', position: 'sup_der' },
      { toothNumber: '12', position: 'sup_der' },
      { toothNumber: '11', position: 'sup_der' },
      { toothNumber: '21', position: 'sup_izq' },
      { toothNumber: '22', position: 'sup_izq' },
      { toothNumber: '23', position: 'sup_izq' },
      { toothNumber: '24', position: 'sup_izq' },
      { toothNumber: '25', position: 'sup_izq' },
      { toothNumber: '26', position: 'sup_izq' },
      { toothNumber: '27', position: 'sup_izq' },
      { toothNumber: '28', position: 'sup_izq' },
      { toothNumber: '48', position: 'inf_der' },
      { toothNumber: '47', position: 'inf_der' },
      { toothNumber: '46', position: 'inf_der' },
      { toothNumber: '45', position: 'inf_der' },
      { toothNumber: '44', position: 'inf_der' },
      { toothNumber: '43', position: 'inf_der' },
      { toothNumber: '42', position: 'inf_der' },
      { toothNumber: '41', position: 'inf_der' },
      { toothNumber: '31', position: 'inf_izq' },
      { toothNumber: '32', position: 'inf_izq' },
      { toothNumber: '33', position: 'inf_izq' },
      { toothNumber: '34', position: 'inf_izq' },
      { toothNumber: '35', position: 'inf_izq' },
      { toothNumber: '36', position: 'inf_izq' },
      { toothNumber: '37', position: 'inf_izq' },
      { toothNumber: '38', position: 'inf_izq' },
    ];

    const teethData = adultTeeth.map(tooth => ({
      ...tooth,
      dentalRecordId,
      condition: 'sano',
      surface: 'ninguna',
      mobility: 'ninguna',
      pain: false,
      notes: '',
      lastUpdateDentistId: dentistId,
    }));

    await ToothRecord.bulkCreate(teethData);
  }
}

module.exports = new DentalRecordService();
