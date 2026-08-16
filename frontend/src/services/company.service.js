import api from './api';

const CompanyService = {
  getMyCompany: () => api.get('/companies/my-company'),
  updateMyCompany: (data) => api.put('/companies/my-company', data),
};

export default CompanyService;
