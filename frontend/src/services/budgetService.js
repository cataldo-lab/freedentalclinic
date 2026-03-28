import api from './api';

const budgetService = {
  getByPatientId: (patientId) => api.get(`/budgets/patient/${patientId}`),
  
  getById: (id) => api.get(`/budgets/${id}`),
  
  create: (data) => api.post('/budgets', data),
  
  update: (id, data) => api.put(`/budgets/${id}`, data),
  
  delete: (id) => api.delete(`/budgets/${id}`),
  
  updateStatus: (id, status) => api.patch(`/budgets/${id}/status`, { status }),
};

export default budgetService;
