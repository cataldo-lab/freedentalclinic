const TreatmentService = require('../src/services/TreatmentService');
const { Treatment } = require('../src/models');

jest.mock('../src/models');
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('TreatmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all treatments', async () => {
      const mockTreatments = [
        { id: 1, name: 'Cleaning', price: 100, durationMinutes: 60 },
        { id: 2, name: 'Filling', price: 200, durationMinutes: 45 },
      ];
      Treatment.findAll.mockResolvedValue(mockTreatments);

      const result = await TreatmentService.findAll();

      expect(result).toEqual(mockTreatments);
      expect(Treatment.findAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']],
      });
    });
  });

  describe('findById', () => {
    it('should return treatment when found', async () => {
      const mockTreatment = { id: 1, name: 'Cleaning', price: 100 };
      Treatment.findByPk.mockResolvedValue(mockTreatment);

      const result = await TreatmentService.findById(1);

      expect(result).toEqual(mockTreatment);
      expect(Treatment.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return null when treatment not found', async () => {
      Treatment.findByPk.mockResolvedValue(null);

      const result = await TreatmentService.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new treatment', async () => {
      const treatmentData = {
        name: 'Cleaning',
        description: 'Deep cleaning',
        price: 100.50,
        durationMinutes: 60,
      };
      const mockCreatedTreatment = { id: 1, ...treatmentData };
      Treatment.create.mockResolvedValue(mockCreatedTreatment);

      const result = await TreatmentService.create(treatmentData);

      expect(result).toEqual(mockCreatedTreatment);
      expect(Treatment.create).toHaveBeenCalledWith(treatmentData);
    });
  });

  describe('update', () => {
    it('should update treatment when found', async () => {
      const treatmentData = { name: 'Cleaning Updated' };
      const mockTreatment = {
        id: 1,
        name: 'Cleaning',
        update: jest.fn().mockResolvedValue(true),
      };
      Treatment.findByPk.mockResolvedValue(mockTreatment);

      await TreatmentService.update(1, treatmentData);

      expect(mockTreatment.update).toHaveBeenCalledWith(treatmentData);
    });

    it('should return null when treatment not found', async () => {
      Treatment.findByPk.mockResolvedValue(null);

      const result = await TreatmentService.update(999, { name: 'Test' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete treatment when found', async () => {
      const mockTreatment = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      Treatment.findByPk.mockResolvedValue(mockTreatment);

      const result = await TreatmentService.delete(1);

      expect(result).toBe(true);
      expect(mockTreatment.destroy).toHaveBeenCalled();
    });

    it('should return false when treatment not found', async () => {
      Treatment.findByPk.mockResolvedValue(null);

      const result = await TreatmentService.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should return treatment count', async () => {
      Treatment.count.mockResolvedValue(5);

      const result = await TreatmentService.count();

      expect(result).toBe(5);
    });
  });
});
