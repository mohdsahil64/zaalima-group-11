import api from './api';

const ResumeService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadForApplication: (applicationId, file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post(`/resumes/upload/${applicationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getDownloadUrl: (key) => api.get(`/resumes/download/${encodeURIComponent(key)}`),
};

export default ResumeService;
