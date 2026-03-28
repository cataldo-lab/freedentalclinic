const CariogramService = require('../src/services/CariogramService');

let mockFindOne;
let mockCreate;

beforeEach(() => {
  mockFindOne = jest.fn();
  mockCreate = jest.fn();
});

jest.mock('../src/models', () => ({
  Cariogram: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  Patient: {},
  Dentist: {}
}));

jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

const { Cariogram } = require('../src/models');

describe('CariogramService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateScores', () => {
    it('should calculate low risk for healthy diet', () => {
      const data = {
        dietFrequency: '0',
        dietType: 'no_carbs',
        fluorideExposure: 'excellent',
        streptococcusMutans: 'low',
        lactobacillus: 'low',
        plaqueIndex: 'very_low',
        salivaFlow: 'high',
        salivaBuffer: 'high',
        socioeconomicLevel: 'high',
        pastCaries: 0,
        currentCaries: 0,
        missingTeeth: 0,
      };

      const scores = CariogramService.calculateScores(data);

      expect(scores.dietScore).toBe(0);
      expect(scores.bacteriaScore).toBe(0);
      expect(scores.susceptibilityScore).toBeLessThan(5);
    });

    it('should calculate high risk for poor diet and hygiene', () => {
      const data = {
        dietFrequency: '7',
        dietType: 'very_frequent_carbs',
        fluorideExposure: 'none',
        streptococcusMutans: 'high',
        lactobacillus: 'high',
        plaqueIndex: 'very_high',
        salivaFlow: 'very_low',
        salivaBuffer: 'low',
        socioeconomicLevel: 'low',
        pastCaries: 6,
        currentCaries: 3,
        missingTeeth: 6,
      };

      const scores = CariogramService.calculateScores(data);

      expect(scores.dietScore).toBeGreaterThan(5);
      expect(scores.bacteriaScore).toBeGreaterThan(2);
      expect(scores.susceptibilityScore).toBeGreaterThan(5);
    });

    it('should apply fluoride reduction to susceptibility', () => {
      const dataWithFluoride = {
        dietFrequency: '3',
        dietType: 'frequent_carbs',
        fluorideExposure: 'excellent',
        streptococcusMutans: 'low',
        lactobacillus: 'low',
        plaqueIndex: 'medium',
        salivaFlow: 'normal',
        salivaBuffer: 'normal',
        socioeconomicLevel: 'medium',
        pastCaries: 1,
        currentCaries: 0,
        missingTeeth: 0,
      };

      const dataWithoutFluoride = {
        ...dataWithFluoride,
        fluorideExposure: 'none',
      };

      const scoresWithFluoride = CariogramService.calculateScores(dataWithFluoride);
      const scoresWithoutFluoride = CariogramService.calculateScores(dataWithoutFluoride);

      expect(scoresWithFluoride.susceptibilityScore).toBeLessThan(scoresWithoutFluoride.susceptibilityScore);
    });
  });

  describe('calculateRisk', () => {
    it('should return very_low for very low scores', () => {
      expect(CariogramService.calculateRisk({ dietScore: 1, bacteriaScore: 0, susceptibilityScore: 1 })).toBe('very_low');
    });

    it('should return low for low scores', () => {
      expect(CariogramService.calculateRisk({ dietScore: 2, bacteriaScore: 1, susceptibilityScore: 2 })).toBe('low');
    });

    it('should return moderate for moderate scores', () => {
      expect(CariogramService.calculateRisk({ dietScore: 3, bacteriaScore: 2, susceptibilityScore: 2 })).toBe('moderate');
    });

    it('should return high for high scores', () => {
      expect(CariogramService.calculateRisk({ dietScore: 3, bacteriaScore: 3, susceptibilityScore: 3 })).toBe('high');
    });

    it('should return very_high for very high scores', () => {
      expect(CariogramService.calculateRisk({ dietScore: 4, bacteriaScore: 4, susceptibilityScore: 4 })).toBe('very_high');
    });
  });

  describe('getRiskPercentage', () => {
    it('should return correct percentages for each risk level', () => {
      expect(CariogramService.getRiskPercentage('very_low')).toBe(5);
      expect(CariogramService.getRiskPercentage('low')).toBe(20);
      expect(CariogramService.getRiskPercentage('moderate')).toBe(40);
      expect(CariogramService.getRiskPercentage('high')).toBe(60);
      expect(CariogramService.getRiskPercentage('very_high')).toBe(80);
    });
  });

  describe('findByPatientId', () => {
    it('should return cariogram when found', async () => {
      const mockCariogram = { id: 1, patientId: 1, cariesRisk: 'low' };
      Cariogram.findOne.mockResolvedValue(mockCariogram);

      const result = await CariogramService.findByPatientId(1);

      expect(result).toEqual(mockCariogram);
      expect(Cariogram.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { patientId: 1 },
      }));
    });

    it('should return null when cariogram not found', async () => {
      Cariogram.findOne.mockResolvedValue(null);

      const result = await CariogramService.findByPatientId(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new cariogram with calculated scores', async () => {
      const inputData = {
        patientId: 999,
        dietFrequency: '3',
        dietType: 'frequent_carbs',
        streptococcusMutans: 'medium',
        pastCaries: 2,
        currentCaries: 1,
      };

      const mockCariogram = {
        id: 10,
        patientId: 999,
        cariesRisk: 'moderate',
        dietScore: 5,
        bacteriaScore: 1,
        susceptibilityScore: 3,
      };

      Cariogram.findOne = jest.fn().mockResolvedValue(null);
      Cariogram.create = jest.fn().mockResolvedValue(mockCariogram);
      Cariogram.findOne = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(mockCariogram);

      const result = await CariogramService.create(inputData);

      expect(Cariogram.create).toHaveBeenCalled();
      expect(result.cariesRisk).toBeDefined();
    });

    it('should throw error when cariogram already exists', async () => {
      Cariogram.findOne = jest.fn().mockResolvedValue({ id: 1, patientId: 1 });

      await expect(CariogramService.create({ patientId: 1 })).rejects.toThrow(
        'Cariogram already exists for this patient'
      );
    });
  });

  describe('update', () => {
    it('should update cariogram and recalculate scores', async () => {
      const mockCariogram = {
        id: 1,
        patientId: 1,
        update: jest.fn().mockResolvedValue(true),
      };

      Cariogram.findOne.mockResolvedValue(mockCariogram);
      Cariogram.findOne.mockResolvedValueOnce({
        ...mockCariogram,
        cariesRisk: 'high',
      });

      const result = await CariogramService.update(1, {
        dietFrequency: '7',
        dietType: 'very_frequent_carbs',
        streptococcusMutans: 'high',
        lactobacillus: 'high',
      });

      expect(mockCariogram.update).toHaveBeenCalled();
    });

    it('should return null when cariogram not found', async () => {
      Cariogram.findOne.mockResolvedValue(null);

      const result = await CariogramService.update(999, {});

      expect(result).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should update existing cariogram', async () => {
      const existingCariogram = { 
        id: 1, 
        patientId: 1,
        update: jest.fn().mockResolvedValue(true)
      };
      Cariogram.findOne = jest.fn().mockResolvedValue(existingCariogram);
      Cariogram.findOne = jest.fn().mockResolvedValueOnce(existingCariogram);

      await CariogramService.upsert(1, { dietFrequency: '5', dietType: 'some_carbs' });

      expect(existingCariogram.update).toHaveBeenCalled();
    });

    it('should create new cariogram if not exists', async () => {
      Cariogram.findOne = jest.fn().mockResolvedValue(null);
      Cariogram.create = jest.fn().mockResolvedValue({ id: 100, patientId: 100, cariesRisk: 'low' });
      Cariogram.findOne = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 100, patientId: 100, cariesRisk: 'low' });

      await CariogramService.upsert(100, { patientId: 100, dietFrequency: '3', dietType: 'some_carbs' });

      expect(Cariogram.create).toHaveBeenCalled();
    });
  });
});
