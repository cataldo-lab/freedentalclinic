import api from './api';

const dentistService = {
  getAll: () => api.get('/dentists'),
  
  getById: (id) => api.get(`/dentists/${id}`),
  
  create: (data) => api.post('/dentists', data),
  
  update: (id, data) => api.put(`/dentists/${id}`, data),
  
  delete: (id) => api.delete(`/dentists/${id}`),
};

export default dentistService;
