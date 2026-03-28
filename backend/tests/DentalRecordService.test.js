const DentalRecordService = require('../src/services/DentalRecordService');
const { DentalRecord, ToothRecord, Patient, Dentist } = require('../src/models');

jest.mock('../src/models');
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('DentalRecordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByPatientId', () => {
    it('should return dental record with teeth when found', async () => {
      const mockRecord = {
        id: 1,
        patientId: 1,
        occlusion: 'normal',
        toJSON: jest.fn().mockReturnValue({ id: 1, patientId: 1, occlusion: 'normal' }),
      };
      const mockTeeth = [
        { id: 1, toothNumber: '11', condition: 'sano' },
        { id: 2, toothNumber: '12', condition: 'caries' },
      ];

      DentalRecord.findOne.mockResolvedValue(mockRecord);
      ToothRecord.findAll.mockResolvedValue(mockTeeth);

      const result = await DentalRecordService.findByPatientId(1);

      expect(result).toBeDefined();
      expect(DentalRecord.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { patientId: 1 },
      }));
      expect(ToothRecord.findAll).toHaveBeenCalled();
    });

    it('should return null when dental record not found', async () => {
      DentalRecord.findOne.mockResolvedValue(null);

      const result = await DentalRecordService.findByPatientId(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new dental record with default teeth', async () => {
      const mockRecord = {
        id: 1,
        patientId: 1,
        toJSON: jest.fn().mockReturnValue({ id: 1, patientId: 1 }),
      };
      const mockTeeth = [{ id: 1, toothNumber: '11', condition: 'sano' }];

      DentalRecord.findOne.mockResolvedValue(null);
      DentalRecord.create.mockResolvedValue(mockRecord);
      ToothRecord.bulkCreate.mockResolvedValue(mockTeeth);
      DentalRecord.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({
        ...mockRecord,
        teeth: mockTeeth,
        toJSON: jest.fn().mockReturnValue({ id: 1, patientId: 1, teeth: mockTeeth }),
      });

      const result = await DentalRecordService.create({ patientId: 1, dentistId: 1 });

      expect(DentalRecord.create).toHaveBeenCalled();
      expect(ToothRecord.bulkCreate).toHaveBeenCalled();
    });

    it('should throw error when dental record already exists', async () => {
      DentalRecord.findOne.mockResolvedValue({ id: 1, patientId: 1 });

      await expect(DentalRecordService.create({ patientId: 1 })).rejects.toThrow(
        'Dental record already exists for this patient'
      );
    });
  });

  describe('update', () => {
    it('should update dental record when found', async () => {
      const mockRecord = {
        id: 1,
        patientId: 1,
        update: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ id: 1, patientId: 1 }),
      };

      DentalRecord.findOne.mockResolvedValue(mockRecord);
      DentalRecord.findOne.mockResolvedValueOnce({
        ...mockRecord,
        teeth: [],
        toJSON: jest.fn().mockReturnValue({ id: 1, patientId: 1, teeth: [] }),
      });

      const result = await DentalRecordService.update(1, { occlusion: 'maloclusion_clase_I' });

      expect(mockRecord.update).toHaveBeenCalledWith({ occlusion: 'maloclusion_clase_I' });
    });

    it('should return null when dental record not found', async () => {
      DentalRecord.findOne.mockResolvedValue(null);

      const result = await DentalRecordService.update(999, { occlusion: 'normal' });

      expect(result).toBeNull();
    });
  });

  describe('initializeTeeth', () => {
    it('should create 32 teeth for adult dentition', async () => {
      const mockTeeth = [];
      for (let i = 0; i < 32; i++) {
        mockTeeth.push({ id: i + 1 });
      }

      ToothRecord.bulkCreate.mockResolvedValue(mockTeeth);

      await DentalRecordService.initializeTeeth(1, 1);

      expect(ToothRecord.bulkCreate).toHaveBeenCalled();
      const callArgs = ToothRecord.bulkCreate.mock.calls[0][0];
      expect(callArgs.length).toBe(32);
    });
  });
});
