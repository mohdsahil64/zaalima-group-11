import api from './api';

const ApplicationService = {
  getApplications: (params) => api.get('/applications', { params }),
  createApplication: (data) => api.post('/applications', data),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

export default ApplicationService;
