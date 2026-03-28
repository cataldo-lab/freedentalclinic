const CariogramController = require('../src/controllers/CariogramController');
const cariogramService = require('../src/services/CariogramService');

jest.mock('../src/services/CariogramService');

describe('CariogramController', () => {
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
    it('should return cariogram when found', async () => {
      const mockCariogram = { id: 1, patientId: 1, cariesRisk: 'low' };
      cariogramService.findByPatientId.mockResolvedValue(mockCariogram);

      await CariogramController.getByPatientId(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockCariogram);
    });

    it('should return 404 when not found', async () => {
      cariogramService.findByPatientId.mockResolvedValue(null);

      await CariogramController.getByPatientId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cariogram not found' });
    });

    it('should handle errors', async () => {
      cariogramService.findByPatientId.mockRejectedValue(new Error('DB error'));

      await CariogramController.getByPatientId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch cariogram' });
    });
  });

  describe('create', () => {
    it('should create cariogram and return 201', async () => {
      mockReq.body = { patientId: 1, dietFrequency: '3' };
      const mockCariogram = { id: 1, patientId: 1, cariesRisk: 'moderate' };
      cariogramService.create.mockResolvedValue(mockCariogram);

      await CariogramController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockCariogram);
    });

    it('should return 400 when already exists', async () => {
      mockReq.body = { patientId: 1 };
      cariogramService.create.mockRejectedValue(new Error('Cariogram already exists'));

      await CariogramController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cariogram already exists' });
    });

    it('should handle errors', async () => {
      cariogramService.create.mockRejectedValue(new Error('DB error'));

      await CariogramController.create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    it('should update cariogram and return 200', async () => {
      mockReq.body = { dietFrequency: '7' };
      const mockCariogram = { id: 1, dietFrequency: '7', cariesRisk: 'high' };
      cariogramService.update.mockResolvedValue(mockCariogram);

      await CariogramController.update(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockCariogram);
    });

    it('should return 404 when not found', async () => {
      cariogramService.update.mockResolvedValue(null);

      await CariogramController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cariogram not found' });
    });

    it('should handle errors', async () => {
      cariogramService.update.mockRejectedValue(new Error('DB error'));

      await CariogramController.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('upsert', () => {
    it('should upsert cariogram and return 200', async () => {
      mockReq.body = { dietFrequency: '5' };
      const mockCariogram = { id: 1, dietFrequency: '5' };
      cariogramService.upsert.mockResolvedValue(mockCariogram);

      await CariogramController.upsert(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockCariogram);
    });

    it('should handle errors', async () => {
      cariogramService.upsert.mockRejectedValue(new Error('DB error'));

      await CariogramController.upsert(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to save cariogram' });
    });
  });
});
