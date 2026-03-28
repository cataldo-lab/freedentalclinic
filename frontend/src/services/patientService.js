import api from './api';

const patientService = {
  getAll: () => api.get('/patients'),
  
  getById: (id) => api.get(`/patients/${id}`),
  
  create: (data) => api.post('/patients', data),
  
  update: (id, data) => api.put(`/patients/${id}`, data),
  
  delete: (id) => api.delete(`/patients/${id}`),
  
  search: (query) => api.get(`/patients/search?q=${encodeURIComponent(query)}`),
  
  getMedicalRecord: (patientId) => api.get(`/medical-records/${patientId}`),
  
  updateMedicalRecord: (patientId, data) => api.put(`/medical-records/${patientId}`, data),
};

export default patientService;
