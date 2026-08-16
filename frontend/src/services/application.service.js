import api from './api';

const ApplicationService = {
  getApplications: (params) => api.get('/applications', { params }),
  getApplication: (id) => api.get(`/applications/${id}`),
  createApplication: (data) => api.post('/applications', data),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  getRecruiterStats: () => api.get('/applications/recruiter-stats'),
  getApplicantStats: () => api.get('/applications/applicant-stats'),
};

export default ApplicationService;
