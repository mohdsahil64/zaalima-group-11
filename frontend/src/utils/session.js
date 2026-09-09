/**
 * Multi-portal session storage.
 *
 * Each portal (admin, recruiter, applicant) keeps its OWN token + user in
 * localStorage under a namespaced key. This lets all three be logged in at
 * the same time in the same tab — the active one is decided by the URL path.
 */

export const PORTALS = ['admin', 'recruiter', 'applicant'];

// Map user.role -> portal key
export const roleToPortal = (role) => {
  if (role === 'super_admin') return 'admin';
  if (role === 'recruiter') return 'recruiter';
  if (role === 'applicant') return 'applicant';
  return null;
};

// Map portal key -> allowed role(s) for validation
export const portalToRole = (portal) => {
  if (portal === 'admin') return 'super_admin';
  if (portal === 'recruiter') return 'recruiter';
  if (portal === 'applicant') return 'applicant';
  return null;
};

/**
 * Detect the active portal from a URL pathname.
 * /admin/... -> admin, /recruiter/... -> recruiter, /applicant/... -> applicant
 * Falls back to null for public/auth routes.
 */
export const getPortalFromPath = (pathname = window.location.pathname) => {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/recruiter')) return 'recruiter';
  if (pathname.startsWith('/applicant')) return 'applicant';
  return null;
};

const tokenKey = (portal) => `ats_token_${portal}`;
const userKey = (portal) => `ats_user_${portal}`;

/** Save a portal's session (token + user). */
export const saveSession = (portal, token, user) => {
  if (!portal) return;
  localStorage.setItem(tokenKey(portal), token);
  localStorage.setItem(userKey(portal), JSON.stringify(user));
};

/** Get the token for a portal. */
export const getToken = (portal) => {
  if (!portal) return null;
  return localStorage.getItem(tokenKey(portal));
};

/** Get the stored user object for a portal. */
export const getUser = (portal) => {
  if (!portal) return null;
  try {
    const raw = localStorage.getItem(userKey(portal));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Clear one portal's session only. */
export const clearSession = (portal) => {
  if (!portal) return;
  localStorage.removeItem(tokenKey(portal));
  localStorage.removeItem(userKey(portal));
};

/** Get all portals that currently have an active session. */
export const getActivePortals = () =>
  PORTALS.filter((p) => !!getToken(p)).map((p) => ({
    portal: p,
    user: getUser(p),
  }));

/** Get the token for the portal that matches the current URL. */
export const getActiveToken = () => getToken(getPortalFromPath());

/** Default dashboard route for a portal. */
export const portalDashboard = (portal) => {
  const map = {
    admin: '/admin/dashboard',
    recruiter: '/recruiter/dashboard',
    applicant: '/applicant/dashboard',
  };
  return map[portal] || '/';
};
