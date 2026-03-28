const DentistService = require('../src/services/DentistService');
const { Dentist } = require('../src/models');

jest.mock('../src/models');
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('DentistService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all dentists', async () => {
      const mockDentists = [
        { id: 1, name: 'Dr. John', lastName: 'Doe', specialty: 'Orthodontics' },
        { id: 2, name: 'Dr. Jane', lastName: 'Smith', specialty: 'General' },
      ];
      Dentist.findAll.mockResolvedValue(mockDentists);

      const result = await DentistService.findAll();

      expect(result).toEqual(mockDentists);
      expect(Dentist.findAll).toHaveBeenCalledWith({
        order: [['lastName', 'ASC'], ['name', 'ASC']],
      });
    });
  });

  describe('findById', () => {
    it('should return dentist when found', async () => {
      const mockDentist = { id: 1, name: 'Dr. John', lastName: 'Doe' };
      Dentist.findByPk.mockResolvedValue(mockDentist);

      const result = await DentistService.findById(1);

      expect(result).toEqual(mockDentist);
      expect(Dentist.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return null when dentist not found', async () => {
      Dentist.findByPk.mockResolvedValue(null);

      const result = await DentistService.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new dentist', async () => {
      const dentistData = {
        name: 'Dr. John',
        lastName: 'Doe',
        email: 'john@example.com',
        specialty: 'General',
      };
      const mockCreatedDentist = { id: 1, ...dentistData };
      
      Dentist.findOne.mockResolvedValue(null);
      Dentist.create.mockResolvedValue(mockCreatedDentist);

      const result = await DentistService.create(dentistData);

      expect(result).toEqual(mockCreatedDentist);
      expect(Dentist.create).toHaveBeenCalledWith(dentistData);
    });

    it('should throw error when email already exists', async () => {
      const dentistData = {
        name: 'Dr. John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      Dentist.findOne.mockResolvedValue({ id: 1, email: 'john@example.com' });

      await expect(DentistService.create(dentistData)).rejects.toThrow(
        'Dentist with this email already exists'
      );
    });

    it('should throw error when license number already exists', async () => {
      const dentistData = {
        name: 'Dr. John',
        lastName: 'Doe',
        email: 'john@example.com',
        licenseNumber: 'LIC123',
      };
      Dentist.findOne.mockResolvedValue(null);
      Dentist.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1, licenseNumber: 'LIC123' });

      await expect(DentistService.create(dentistData)).rejects.toThrow(
        'Dentist with this license number already exists'
      );
    });
  });

  describe('update', () => {
    it('should update dentist when found', async () => {
      const dentistData = { name: 'Dr. John Updated' };
      const mockDentist = {
        id: 1,
        name: 'Dr. John',
        update: jest.fn().mockResolvedValue(true),
      };
      Dentist.findByPk.mockResolvedValue(mockDentist);
      Dentist.findOne.mockResolvedValue(null);

      await DentistService.update(1, dentistData);

      expect(mockDentist.update).toHaveBeenCalledWith(dentistData);
    });

    it('should return null when dentist not found', async () => {
      Dentist.findByPk.mockResolvedValue(null);

      const result = await DentistService.update(999, { name: 'Test' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete dentist when found', async () => {
      const mockDentist = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      Dentist.findByPk.mockResolvedValue(mockDentist);

      const result = await DentistService.delete(1);

      expect(result).toBe(true);
      expect(mockDentist.destroy).toHaveBeenCalled();
    });

    it('should return false when dentist not found', async () => {
      Dentist.findByPk.mockResolvedValue(null);

      const result = await DentistService.delete(999);

      expect(result).toBe(false);
    });
  });
});
