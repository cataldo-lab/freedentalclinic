const { Cariogram, Patient, Dentist } = require('../models');
const logger = require('../utils/logger');

const DIET_SCORES = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7
};

const DIET_TYPE_SCORES = {
  'no_carbs': 0, 'some_carbs': 1, 'frequent_carbs': 2, 'very_frequent_carbs': 3
};

const FLUORIDE_SCORES = {
  'excellent': 3, 'good': 2, 'some': 1, 'none': 0
};

const BACTERIA_SCORES = {
  'low': 0, 'medium': 1, 'high': 2
};

const PLAQUE_SCORES = {
  'very_low': 0, 'low': 1, 'medium': 2, 'high': 3, 'very_high': 4
};

const SALIVA_FLOW_SCORES = {
  'high': 0, 'normal': 1, 'low': 2, 'very_low': 3
};

const SALIVA_BUFFER_SCORES = {
  'high': 0, 'normal': 1, 'low': 2
};

const SOCIO_SCORES = {
  'high': 0, 'medium': 1, 'low': 2
};

class CariogramService {
  calculateScores(data) {
    const dietScore = (parseInt(data.dietFrequency) || 0) + DIET_TYPE_SCORES[data.dietType] || 0;
    
    const bacteriaScore = BACTERIA_SCORES[data.streptococcusMutans] + BACTERIA_SCORES[data.lactobacillus];
    
    let susceptibilityScore = PLAQUE_SCORES[data.plaqueIndex] + 
                              SALIVA_FLOW_SCORES[data.salivaFlow] + 
                              SALIVA_BUFFER_SCORES[data.salivaBuffer] +
                              SOCIO_SCORES[data.socioeconomicLevel];
    
    const pastCariesFactor = data.pastCaries > 5 ? 3 : data.pastCaries > 2 ? 2 : data.pastCaries > 0 ? 1 : 0;
    const currentCariesFactor = data.currentCaries > 2 ? 3 : data.currentCaries > 0 ? 2 : 1;
    const missingTeethFactor = data.missingTeeth > 5 ? 2 : data.missingTeeth > 0 ? 1 : 0;
    
    susceptibilityScore += (pastCariesFactor + currentCariesFactor + missingTeethFactor);
    
    const fluorideReduction = FLUORIDE_SCORES[data.fluorideExposure];
    susceptibilityScore = Math.max(0, susceptibilityScore - fluorideReduction);
    
    return {
      dietScore: Math.min(10, dietScore),
      bacteriaScore: Math.min(10, bacteriaScore),
      susceptibilityScore: Math.min(10, susceptibilityScore)
    };
  }

  calculateRisk(scores) {
    const total = scores.dietScore + scores.bacteriaScore + scores.susceptibilityScore;
    
    if (total <= 3) return 'very_low';
    if (total <= 5) return 'low';
    if (total <= 7) return 'moderate';
    if (total <= 9) return 'high';
    return 'very_high';
  }

  getRiskPercentage(risk) {
    const percentages = {
      'very_low': 5,
      'low': 20,
      'moderate': 40,
      'high': 60,
      'very_high': 80
    };
    return percentages[risk] || 20;
  }

  async findByPatientId(patientId) {
    try {
      const cariogram = await Cariogram.findOne({
        where: { patientId },
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'name', 'lastName', 'email'] },
          { model: Dentist, as: 'dentist', attributes: ['id', 'name', 'lastName'] },
        ],
      });
      return cariogram;
    } catch (error) {
      logger.error(`Error fetching cariogram for patient ${patientId}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const existing = await Cariogram.findOne({
        where: { patientId: data.patientId },
      });

      if (existing) {
        throw new Error('Cariogram already exists for this patient');
      }

      const scores = this.calculateScores(data);
      const cariesRisk = this.calculateRisk(scores);

      const createData = {
        patientId: data.patientId,
        dentistId: data.dentistId || null,
        dietFrequency: data.dietFrequency || '0',
        dietType: data.dietType || 'no_carbs',
        fluorideExposure: data.fluorideExposure || 'good',
        streptococcusMutans: data.streptococcusMutans || 'low',
        lactobacillus: data.lactobacillus || 'low',
        pastCaries: data.pastCaries || 0,
        currentCaries: data.currentCaries || 0,
        fillings: data.fillings || 0,
        missingTeeth: data.missingTeeth || 0,
        plaqueIndex: data.plaqueIndex || 'low',
        salivaFlow: data.salivaFlow || 'normal',
        salivaBuffer: data.salivaBuffer || 'normal',
        socioeconomicLevel: data.socioeconomicLevel || 'medium',
        observations: data.observations || '',
        dietScore: scores.dietScore,
        bacteriaScore: scores.bacteriaScore,
        susceptibilityScore: scores.susceptibilityScore,
        cariesRisk,
      };

      const cariogram = await Cariogram.create(createData);

      logger.info(`Cariogram created with id: ${cariogram.id}`);
      return await this.findByPatientId(cariogram.patientId);
    } catch (error) {
      logger.error('Error creating cariogram:', error);
      throw error;
    }
  }

  async update(patientId, data) {
    try {
      const cariogram = await Cariogram.findOne({
        where: { patientId },
      });

      if (!cariogram) {
        return null;
      }

      const scores = this.calculateScores(data);
      const cariesRisk = this.calculateRisk(scores);

      await cariogram.update({
        ...data,
        dietScore: scores.dietScore,
        bacteriaScore: scores.bacteriaScore,
        susceptibilityScore: scores.susceptibilityScore,
        cariesRisk,
      });

      logger.info(`Cariogram for patient ${patientId} updated`);
      return await this.findByPatientId(patientId);
    } catch (error) {
      logger.error(`Error updating cariogram for patient ${patientId}:`, error);
      throw error;
    }
  }

  async upsert(patientId, data) {
    try {
      const existing = await Cariogram.findOne({
        where: { patientId },
      });

      if (existing) {
        return await this.update(patientId, data);
      }
      return await this.create({ ...data, patientId });
    } catch (error) {
      logger.error(`Error upserting cariogram for patient ${patientId}:`, error);
      throw error;
    }
  }
}

module.exports = new CariogramService();
