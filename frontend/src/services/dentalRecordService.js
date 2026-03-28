import api from './api';

const dentalRecordService = {
  getByPatientId: (patientId) => api.get(`/dental-records/${patientId}`),
  
  create: (data) => api.post('/dental-records', data),
  
  update: (patientId, data) => api.put(`/dental-records/${patientId}`, data),
};

export default dentalRecordService;
