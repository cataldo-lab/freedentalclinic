import api from './api';

const appointmentService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/appointments?${params}` : '/appointments';
    return api.get(endpoint);
  },
  
  getById: (id) => api.get(`/appointments/${id}`),
  
  getToday: () => api.get('/appointments/today'),
  
  getByDate: (date) => api.get(`/appointments/date/${date}`),
  
  create: (data) => api.post('/appointments', data),
  
  update: (id, data) => api.put(`/appointments/${id}`, data),
  
  delete: (id) => api.delete(`/appointments/${id}`),
};

export default appointmentService;
