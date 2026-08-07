import api from './api';

const UserService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

export default UserService;
