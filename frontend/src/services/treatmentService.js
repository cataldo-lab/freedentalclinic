import api from './api';

const treatmentService = {
  getAll: () => api.get('/treatments'),
  
  getById: (id) => api.get(`/treatments/${id}`),
  
  create: (data) => api.post('/treatments', data),
  
  update: (id, data) => api.put(`/treatments/${id}`, data),
  
  delete: (id) => api.delete(`/treatments/${id}`),
};

export default treatmentService;
