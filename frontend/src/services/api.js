import axios from 'axios';
import toast from 'react-hot-toast';
import { getActiveToken, getPortalFromPath, clearSession } from '@/utils/session';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  // NOTE: withCredentials is intentionally FALSE.
  // The backend also sets an auth cookie, but a cookie is shared across all
  // tabs AND all portals — that would break simultaneous multi-portal login.
  // We rely purely on the per-portal Bearer token chosen by the current URL.
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach the token for the portal in the current URL
api.interceptors.request.use(
  (config) => {
    // Allow callers to force a specific portal's token (e.g. during login flows)
    const forcedToken = config.__authToken;
    const token = forcedToken || getActiveToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      // Only clear the session for the CURRENT portal, leave others intact
      const portal = getPortalFromPath();
      if (portal) {
        clearSession(portal);
        // Redirect to login only if we're inside that portal
        window.location.href = `/login?portal=${portal}`;
      }
    }

    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error.response?.data || { message });
  }
);

export default api;
