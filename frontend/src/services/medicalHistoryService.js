import api from './api';

const medicalHistoryService = {
  getByPatientId: (patientId) => api.get(`/medical-histories/patient/${patientId}`),
  
  getById: (id) => api.get(`/medical-histories/${id}`),
  
  create: (data) => api.post('/medical-histories', data),
  
  addNote: (patientId, data) => api.post(`/medical-histories/note/${patientId}`, data),

  addEntry: (patientId, data) => api.post(`/medical-histories/entry/${patientId}`, data),
};

export default medicalHistoryService;
