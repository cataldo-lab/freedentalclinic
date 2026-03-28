const PatientService = require('../src/services/PatientService');
const { Patient } = require('../src/models');

jest.mock('../src/models');
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('PatientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        { id: 1, name: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      ];
      Patient.findAll.mockResolvedValue(mockPatients);

      const result = await PatientService.findAll();

      expect(result).toEqual(mockPatients);
      expect(Patient.findAll).toHaveBeenCalledWith({
        order: [['lastName', 'ASC'], ['name', 'ASC']],
      });
    });

    it('should throw error on database failure', async () => {
      Patient.findAll.mockRejectedValue(new Error('Database error'));

      await expect(PatientService.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should return patient when found', async () => {
      const mockPatient = { id: 1, name: 'John', lastName: 'Doe' };
      Patient.findByPk.mockResolvedValue(mockPatient);

      const result = await PatientService.findById(1);

      expect(result).toEqual(mockPatient);
      expect(Patient.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return null when patient not found', async () => {
      Patient.findByPk.mockResolvedValue(null);

      const result = await PatientService.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      const patientData = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };
      const mockCreatedPatient = { id: 1, ...patientData };
      
      Patient.findOne.mockResolvedValue(null);
      Patient.create.mockResolvedValue(mockCreatedPatient);

      const result = await PatientService.create(patientData);

      expect(result).toEqual(mockCreatedPatient);
      expect(Patient.create).toHaveBeenCalledWith(patientData);
    });

    it('should throw error when email already exists', async () => {
      const patientData = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      Patient.findOne.mockResolvedValue({ id: 1, email: 'john@example.com' });

      await expect(PatientService.create(patientData)).rejects.toThrow(
        'Patient with this email already exists'
      );
    });
  });

  describe('update', () => {
    it('should update patient when found', async () => {
      const patientData = { name: 'John Updated' };
      const mockPatient = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        update: jest.fn().mockResolvedValue(true),
      };
      Patient.findByPk.mockResolvedValue(mockPatient);
      Patient.findOne.mockResolvedValue(null);

      await PatientService.update(1, patientData);

      expect(mockPatient.update).toHaveBeenCalledWith(patientData);
    });

    it('should return null when patient not found', async () => {
      Patient.findByPk.mockResolvedValue(null);

      const result = await PatientService.update(999, { name: 'Test' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete patient when found', async () => {
      const mockPatient = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      Patient.findByPk.mockResolvedValue(mockPatient);

      const result = await PatientService.delete(1);

      expect(result).toBe(true);
      expect(mockPatient.destroy).toHaveBeenCalled();
    });

    it('should return false when patient not found', async () => {
      Patient.findByPk.mockResolvedValue(null);

      const result = await PatientService.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should return patient count', async () => {
      Patient.count.mockResolvedValue(10);

      const result = await PatientService.count();

      expect(result).toBe(10);
    });
  });
});
