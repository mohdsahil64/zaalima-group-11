import api from './api';

const AuthService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  getMe: () => api.get('/auth/me'),
  // Fetch current user using an explicit token (used when verifying a stored portal session)
  getMeWithToken: (token) => api.get('/auth/me', { __authToken: token }),
};

export default AuthService;
