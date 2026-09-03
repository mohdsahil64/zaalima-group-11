import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HiBars3,
  HiBell,
  HiArrowRightOnRectangle,
  HiChevronDown,
  HiUser,
  HiCog6Tooth,
  HiSparkles,
  HiCheckCircle,
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';

const mockNotifications = [
  { id: 1, text: 'New application for Senior Developer', time: '2m ago', unread: true, type: 'application' },
  { id: 2, text: 'Interview scheduled with Sarah K.', time: '1h ago', unread: true, type: 'interview' },
  { id: 3, text: 'Resume scored: 87% match', time: '3h ago', unread: false, type: 'ai' },
];

const getPageTitle = (pathname) => {
  const map = {
    '/recruiter/dashboard': 'Dashboard',
    '/recruiter/jobs': 'Jobs',
    '/recruiter/jobs/create': 'Post a Job',
    '/recruiter/applications': 'Applications',
    '/recruiter/pipeline': 'Pipeline',
    '/recruiter/candidates': 'Candidates',
    '/recruiter/company': 'Company',
    '/recruiter/settings': 'Settings',
    '/applicant/dashboard': 'Dashboard',
    '/applicant/jobs': 'Browse Jobs',
    '/applicant/applications': 'My Applications',
    '/applicant/resume': 'My Resume',
    '/applicant/profile': 'My Profile',
    '/applicant/settings': 'Settings',
    '/admin/dashboard': 'Admin Dashboard',
  };
  return map[pathname] || 'Dashboard';
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifsRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;
  const pageTitle = getPageTitle(location.pathname);
  const settingsPath = user?.role === 'recruiter' ? '/recruiter/settings' : '/applicant/settings';
  const profilePath = user?.role === 'applicant' ? '/applicant/profile' : null;

  useEffect(() => {
    const handler = (e) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setShowNotifs(false);
    setShowProfile(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setShowProfile(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-surface/90 backdrop-blur-xl border-b border-border shrink-0">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="flex items-center justify-between h-full px-3 sm:px-5 lg:px-6 gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-hover transition-colors lg:hidden shrink-0"
            aria-label="Open menu"
          >
            <HiBars3 className="w-5 h-5" />
          </button>
          <div className="hidden sm:block min-w-0">
            <h1 className="text-sm font-semibold text-text truncate">{pageTitle}</h1>
            <p className="text-[11px] text-text-muted capitalize">
              {user?.role?.replace('_', ' ')} Portal
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">

          {/* Notifications */}
          <div ref={notifsRef} className="relative">
            <button
              onClick={() => { setShowNotifs((s) => !s); setShowProfile(false); }}
              className="relative p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
              aria-label="Notifications"
            >
              <HiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-background animate-pulse" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-surface-elevated border border-border rounded-2xl shadow-xl overflow-hidden animate-fade-down z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-text">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="divide-y divide-border/50 max-h-72 overflow-y-auto">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer ${n.unread ? 'bg-primary/5' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        n.type === 'application' ? 'bg-info/15 text-info'
                        : n.type === 'interview'  ? 'bg-warning/15 text-warning'
                        : 'bg-primary/15 text-primary'
                      }`}>
                        {n.type === 'ai' ? <HiSparkles className="w-4 h-4" />
                          : n.type === 'interview' ? <HiCheckCircle className="w-4 h-4" />
                          : <HiBell className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text leading-snug">{n.text}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border">
                  <button className="w-full text-xs text-primary hover:text-primary-light font-medium transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-border mx-0.5 sm:mx-1" />

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setShowProfile((s) => !s); setShowNotifs(false); }}
              className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1.5 rounded-xl hover:bg-surface-hover transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm shrink-0">
                <span className="text-white text-xs font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="hidden sm:block text-left min-w-0">
                <p className="text-xs font-semibold text-text leading-none truncate max-w-[100px]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-text-muted capitalize mt-0.5 truncate">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <HiChevronDown className={`w-3.5 h-3.5 text-text-muted hidden sm:block transition-transform duration-200 shrink-0 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-48 sm:w-52 bg-surface-elevated border border-border rounded-2xl shadow-xl overflow-hidden animate-fade-down z-50">
                <div className="px-4 py-3 border-b border-border bg-surface">
                  <p className="text-xs font-semibold text-text truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[11px] text-text-muted truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="py-1.5">
                  {profilePath && (
                    <Link
                      to={profilePath}
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-surface-hover transition-colors"
                    >
                      <HiUser className="w-4 h-4 shrink-0" /> View Profile
                    </Link>
                  )}
                  <Link
                    to={settingsPath}
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-surface-hover transition-colors"
                  >
                    <HiCog6Tooth className="w-4 h-4 shrink-0" /> Settings
                  </Link>
                </div>
                <div className="border-t border-border py-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error/80 hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <HiArrowRightOnRectangle className="w-4 h-4 shrink-0" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
