const DentalRecordController = require('../src/controllers/DentalRecordController');
const dentalRecordService = require('../src/services/DentalRecordService');

jest.mock('../src/services/DentalRecordService');

describe('DentalRecordController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: { patientId: '1' },
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getByPatientId', () => {
    it('should return dental record when found', async () => {
      const mockRecord = { id: 1, patientId: 1, teeth: [] };
      dentalRecordService.findByPatientId.mockResolvedValue(mockRecord);

      await DentalRecordController.getByPatientId(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockRecord);
    });

    it('should return 404 when not found', async () => {
      dentalRecordService.findByPatientId.mockResolvedValue(null);

      await DentalRecordController.getByPatientId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Dental record not found' });
    });

    it('should handle errors', async () => {
      dentalRecordService.findByPatientId.mockRejectedValue(new Error('DB error'));

      await DentalRecordController.getByPatientId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch dental record' });
    });
  });

  describe('create', () => {
    it('should create dental record and return 201', async () => {
      mockReq.body = { patientId: 1, dentistId: 1 };
      const mockRecord = { id: 1, patientId: 1 };
      dentalRecordService.create.mockResolvedValue(mockRecord);

      await DentalRecordController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockRecord);
    });

    it('should return 400 when already exists', async () => {
      mockReq.body = { patientId: 1 };
      dentalRecordService.create.mockRejectedValue(new Error('Dental record already exists'));

      await DentalRecordController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Dental record already exists' });
    });

    it('should handle errors', async () => {
      dentalRecordService.create.mockRejectedValue(new Error('DB error'));

      await DentalRecordController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    it('should update dental record and return 200', async () => {
      mockReq.body = { occlusion: 'maloclusion_clase_I' };
      const mockRecord = { id: 1, occlusion: 'maloclusion_clase_I' };
      dentalRecordService.update.mockResolvedValue(mockRecord);

      await DentalRecordController.update(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockRecord);
    });

    it('should return 404 when not found', async () => {
      dentalRecordService.update.mockResolvedValue(null);

      await DentalRecordController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Dental record not found' });
    });

    it('should handle errors', async () => {
      dentalRecordService.update.mockRejectedValue(new Error('DB error'));

      await DentalRecordController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
