import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

import api from '../src/services/api';

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET requests', () => {
    it('should make a GET request', async () => {
      const data = [{ id: 1, name: 'Test' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(data),
      });

      const result = await api.get('/patients');

      expect(mockFetch).toHaveBeenCalledWith('/api/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(data);
    });
  });

  describe('POST requests', () => {
    it('should make a POST request with body', async () => {
      const newPatient = { name: 'John', lastName: 'Doe' };
      const createdPatient = { id: 1, ...newPatient };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdPatient),
      });

      const result = await api.post('/patients', newPatient);

      expect(mockFetch).toHaveBeenCalledWith('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      });
      expect(result).toEqual(createdPatient);
    });
  });

  describe('PUT requests', () => {
    it('should make a PUT request with body', async () => {
      const updatedPatient = { id: 1, name: 'John Updated' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedPatient),
      });

      const result = await api.put('/patients/1', { name: 'John Updated' });

      expect(mockFetch).toHaveBeenCalledWith('/api/patients/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'John Updated' }),
      });
      expect(result).toEqual(updatedPatient);
    });
  });

  describe('DELETE requests', () => {
    it('should make a DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve(null),
      });

      await api.delete('/patients/1');

      expect(mockFetch).toHaveBeenCalledWith('/api/patients/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('Error handling', () => {
    it('should throw error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      await expect(api.get('/patients/999')).rejects.toThrow('Not found');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.get('/patients')).rejects.toThrow('Network error');
    });
  });
});
