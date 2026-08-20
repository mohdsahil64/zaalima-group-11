import api from './api';

const AIService = {
  analyzeApplication: (applicationId) => api.post(`/ai/analyze/${applicationId}`),
  analyzeJobApplications: (jobId) => api.post(`/ai/analyze-job/${jobId}`),
  getAnalysis: (applicationId) => api.get(`/ai/analysis/${applicationId}`),
};

export default AIService;
