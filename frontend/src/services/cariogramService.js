import api from './api';

const cariogramService = {
  getByPatientId: (patientId) => api.get(`/cariograms/${patientId}`),
  
  create: (data) => api.post('/cariograms', data),
  
  update: (patientId, data) => api.put(`/cariograms/${patientId}`, data),
  
  upsert: (patientId, data) => api.patch(`/cariograms/${patientId}`, data),
};

export default cariogramService;
