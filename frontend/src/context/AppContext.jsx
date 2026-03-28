import { createContext, useContext, useState, useCallback } from 'react';
import patientService from '../services/patientService';
import dentistService from '../services/dentistService';
import treatmentService from '../services/treatmentService';
import appointmentService from '../services/appointmentService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDentists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dentistService.getAll();
      setDentists(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTreatments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await treatmentService.getAll();
      setTreatments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointments = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAll(filters);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    patients,
    dentists,
    treatments,
    appointments,
    loading,
    error,
    fetchPatients,
    fetchDentists,
    fetchTreatments,
    fetchAppointments,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
