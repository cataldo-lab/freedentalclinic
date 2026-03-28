import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '../src/context/AppContext';

vi.mock('../src/services/patientService', () => ({
  default: {
    getAll: vi.fn(),
  },
}));

vi.mock('../src/services/dentistService', () => ({
  default: {
    getAll: vi.fn(),
  },
}));

vi.mock('../src/services/treatmentService', () => ({
  default: {
    getAll: vi.fn(),
  },
}));

vi.mock('../src/services/appointmentService', () => ({
  default: {
    getAll: vi.fn(),
  },
}));

import patientService from '../src/services/patientService';
import dentistService from '../src/services/dentistService';
import treatmentService from '../src/services/treatmentService';
import appointmentService from '../src/services/appointmentService';

describe('AppContext', () => {
  const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current.patients).toEqual([]);
    expect(result.current.dentists).toEqual([]);
    expect(result.current.treatments).toEqual([]);
    expect(result.current.appointments).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch patients', async () => {
    const patients = [{ id: 1, name: 'John' }];
    patientService.getAll.mockResolvedValueOnce(patients);

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      await result.current.fetchPatients();
    });

    expect(result.current.patients).toEqual(patients);
  });

  it('should handle errors when fetching patients', async () => {
    const error = new Error('Failed to fetch');
    patientService.getAll.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      await result.current.fetchPatients();
    });

    expect(result.current.error).toBe('Failed to fetch');
  });

  it('should fetch dentists', async () => {
    const dentists = [{ id: 1, name: 'Dr. Smith' }];
    dentistService.getAll.mockResolvedValueOnce(dentists);

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      await result.current.fetchDentists();
    });

    expect(result.current.dentists).toEqual(dentists);
  });

  it('should fetch treatments', async () => {
    const treatments = [{ id: 1, name: 'Cleaning' }];
    treatmentService.getAll.mockResolvedValueOnce(treatments);

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      await result.current.fetchTreatments();
    });

    expect(result.current.treatments).toEqual(treatments);
  });

  it('should fetch appointments with filters', async () => {
    const appointments = [{ id: 1, status: 'scheduled' }];
    appointmentService.getAll.mockResolvedValueOnce(appointments);

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      await result.current.fetchAppointments({ status: 'scheduled' });
    });

    expect(result.current.appointments).toEqual(appointments);
    expect(appointmentService.getAll).toHaveBeenCalledWith({ status: 'scheduled' });
  });
});
