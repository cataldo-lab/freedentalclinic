import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

import api from '../src/services/api';
import cariogramService from '../src/services/cariogramService';

describe('CariogramService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get cariogram by patient id', async () => {
    const mockCariogram = { id: 1, patientId: 1, cariesRisk: 'low' };
    api.get.mockResolvedValueOnce(mockCariogram);

    const result = await cariogramService.getByPatientId(1);

    expect(api.get).toHaveBeenCalledWith('/cariograms/1');
    expect(result).toEqual(mockCariogram);
  });

  it('should create a cariogram', async () => {
    const mockData = { patientId: 1, dietFrequency: '3' };
    const mockCariogram = { id: 1, ...mockData, cariesRisk: 'moderate' };
    api.post.mockResolvedValueOnce(mockCariogram);

    const result = await cariogramService.create(mockData);

    expect(api.post).toHaveBeenCalledWith('/cariograms', mockData);
    expect(result).toEqual(mockCariogram);
  });

  it('should update a cariogram', async () => {
    const mockData = { dietFrequency: '7' };
    const mockCariogram = { id: 1, ...mockData, cariesRisk: 'high' };
    api.put.mockResolvedValueOnce(mockCariogram);

    const result = await cariogramService.update(1, mockData);

    expect(api.put).toHaveBeenCalledWith('/cariograms/1', mockData);
    expect(result).toEqual(mockCariogram);
  });

  it('should upsert a cariogram', async () => {
    const mockData = { patientId: 1, dietFrequency: '5' };
    const mockCariogram = { id: 1, ...mockData, cariesRisk: 'moderate' };
    api.patch.mockResolvedValueOnce(mockCariogram);

    const result = await cariogramService.upsert(1, mockData);

    expect(api.patch).toHaveBeenCalledWith('/cariograms/1', mockData);
    expect(result).toEqual(mockCariogram);
  });
});
