import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AuthService from '@/services/auth.service';
import {
  getPortalFromPath,
  getToken,
  getUser,
  saveSession,
  clearSession,
  getActivePortals,
  roleToPortal,
  portalToRole,
  portalDashboard,
} from '@/utils/session';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const location = useLocation();

  // The portal is derived from the current URL (/admin, /recruiter, /applicant)
  const [activePortal, setActivePortal] = useState(getPortalFromPath());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Re-derive the active portal whenever the URL changes
  useEffect(() => {
    setActivePortal(getPortalFromPath(location.pathname));
  }, [location.pathname]);

  /**
   * Load the session for the currently active portal.
   * Uses the cached user immediately, then re-verifies with the backend.
   */
  const loadUser = useCallback(async () => {
    const portal = getPortalFromPath();

    // On public/auth pages there is no portal — nothing to load
    if (!portal) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const token = getToken(portal);
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Show cached user instantly for snappy UX
    const cached = getUser(portal);
    if (cached) {
      setUser(cached);
      setIsAuthenticated(true);
    }

    try {
      const response = await AuthService.getMeWithToken(token);
      const freshUser = response.data.user;
      // Guard: token's role must match this portal
      if (roleToPortal(freshUser.role) !== portal) {
        clearSession(portal);
        setUser(null);
        setIsAuthenticated(false);
      } else {
        saveSession(portal, token, freshUser);
        setUser(freshUser);
        setIsAuthenticated(true);
      }
    } catch {
      clearSession(portal);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload session whenever the active portal changes
  useEffect(() => {
    setLoading(true);
    loadUser();
  }, [activePortal, loadUser]);

  /**
   * Login — saves the session under the portal matching the user's role.
   * Does NOT touch other portals' sessions.
   */
  const login = async (credentials) => {
    const response = await AuthService.login(credentials);
    const { user: userData, token } = response.data;

    const portal = roleToPortal(userData.role);
    saveSession(portal, token, userData);

    // If we're currently viewing this portal, update live state
    if (getPortalFromPath() === portal) {
      setUser(userData);
      setIsAuthenticated(true);
    }

    toast.success(`Signed in as ${userData.firstName}`);
    return userData;
  };

  /**
   * Register — same as login, saves the new user's session for their portal.
   */
  const register = async (data) => {
    const response = await AuthService.register(data);
    const { user: userData, token } = response.data;

    const portal = roleToPortal(userData.role);
    saveSession(portal, token, userData);

    if (getPortalFromPath() === portal) {
      setUser(userData);
      setIsAuthenticated(true);
    }

    toast.success('Account created successfully');
    return userData;
  };

  /**
   * Logout — clears ONLY the current portal's session by default.
   * Other portals stay logged in.
   */
  const logout = async (portalToLogout) => {
    const portal = portalToLogout || getPortalFromPath();
    try {
      await AuthService.logout();
    } catch {
      // ignore
    }
    if (portal) clearSession(portal);

    if (getPortalFromPath() === portal) {
      setUser(null);
      setIsAuthenticated(false);
    }
    toast.success('Logged out');
  };

  /** Logout of ALL portals at once. */
  const logoutAll = async () => {
    try {
      await AuthService.logout();
    } catch {
      // ignore
    }
    ['admin', 'recruiter', 'applicant'].forEach(clearSession);
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out of all portals');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    activePortal,
    login,
    register,
    logout,
    logoutAll,
    loadUser,
    // Helpers for the portal switcher
    getActivePortals,
    portalDashboard,
    portalToRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
