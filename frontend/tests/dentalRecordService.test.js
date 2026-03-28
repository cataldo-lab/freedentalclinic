import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../src/services/api';
import dentalRecordService from '../src/services/dentalRecordService';

describe('DentalRecordService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get dental record by patient id', async () => {
    const mockRecord = { id: 1, patientId: 1, teeth: [] };
    api.get.mockResolvedValueOnce(mockRecord);

    const result = await dentalRecordService.getByPatientId(1);

    expect(api.get).toHaveBeenCalledWith('/dental-records/1');
    expect(result).toEqual(mockRecord);
  });

  it('should create a dental record', async () => {
    const mockData = { patientId: 1, dentistId: 1 };
    const mockRecord = { id: 1, ...mockData };
    api.post.mockResolvedValueOnce(mockRecord);

    const result = await dentalRecordService.create(mockData);

    expect(api.post).toHaveBeenCalledWith('/dental-records', mockData);
    expect(result).toEqual(mockRecord);
  });

  it('should update a dental record', async () => {
    const mockData = { occlusion: 'maloclusion_clase_I' };
    const mockRecord = { id: 1, ...mockData };
    api.put.mockResolvedValueOnce(mockRecord);

    const result = await dentalRecordService.update(1, mockData);

    expect(api.put).toHaveBeenCalledWith('/dental-records/1', mockData);
    expect(result).toEqual(mockRecord);
  });
});
