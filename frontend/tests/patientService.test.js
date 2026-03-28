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
import patientService from '../src/services/patientService';

describe('PatientService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get all patients', async () => {
    const patients = [{ id: 1, name: 'John' }];
    api.get.mockResolvedValueOnce(patients);

    const result = await patientService.getAll();

    expect(api.get).toHaveBeenCalledWith('/patients');
    expect(result).toEqual(patients);
  });

  it('should get patient by id', async () => {
    const patient = { id: 1, name: 'John' };
    api.get.mockResolvedValueOnce(patient);

    const result = await patientService.getById(1);

    expect(api.get).toHaveBeenCalledWith('/patients/1');
    expect(result).toEqual(patient);
  });

  it('should create a patient', async () => {
    const patientData = { name: 'John', lastName: 'Doe', email: 'john@example.com' };
    const createdPatient = { id: 1, ...patientData };
    api.post.mockResolvedValueOnce(createdPatient);

    const result = await patientService.create(patientData);

    expect(api.post).toHaveBeenCalledWith('/patients', patientData);
    expect(result).toEqual(createdPatient);
  });

  it('should update a patient', async () => {
    const patientData = { name: 'John Updated' };
    const updatedPatient = { id: 1, ...patientData };
    api.put.mockResolvedValueOnce(updatedPatient);

    const result = await patientService.update(1, patientData);

    expect(api.put).toHaveBeenCalledWith('/patients/1', patientData);
    expect(result).toEqual(updatedPatient);
  });

  it('should delete a patient', async () => {
    api.delete.mockResolvedValueOnce(null);

    await patientService.delete(1);

    expect(api.delete).toHaveBeenCalledWith('/patients/1');
  });

  it('should search patients', async () => {
    const patients = [{ id: 1, name: 'John' }];
    api.get.mockResolvedValueOnce(patients);

    const result = await patientService.search('John');

    expect(api.get).toHaveBeenCalledWith('/patients/search?q=John');
    expect(result).toEqual(patients);
  });
});
