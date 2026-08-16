import api from './api';

const AdminService = {
  getStats: () => api.get('/admin/stats'),
  getCompanies: (params) => api.get('/admin/companies', { params }),
  getCompany: (id) => api.get(`/admin/companies/${id}`),
  approveCompany: (id) => api.put(`/admin/companies/${id}/approve`),
  rejectCompany: (id, reason) => api.put(`/admin/companies/${id}/reject`, { reason }),
  suspendCompany: (id) => api.put(`/admin/companies/${id}/suspend`),
  reactivateCompany: (id) => api.put(`/admin/companies/${id}/reactivate`),
  getRecruiters: (params) => api.get('/admin/recruiters', { params }),
  getApplicants: (params) => api.get('/admin/applicants', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  getApplications: (params) => api.get('/admin/applications', { params }),
};

export default AdminService;
