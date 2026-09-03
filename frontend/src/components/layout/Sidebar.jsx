import { NavLink, useLocation } from 'react-router-dom';
import {
  HiHome,
  HiBriefcase,
  HiDocumentText,
  HiUser,
  HiCog6Tooth,
  HiXMark,
  HiUsers,
  HiBuildingOffice2,
  HiDocumentArrowUp,
  HiViewColumns,
  HiSparkles,
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { ROLES, APP_NAME } from '@/constants';
import { cn } from '@/utils';

const recruiterLinks = [
  { to: '/recruiter/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/recruiter/company', label: 'Company', icon: HiBuildingOffice2 },
  { to: '/recruiter/jobs', label: 'Jobs', icon: HiBriefcase },
  { to: '/recruiter/applications', label: 'Applications', icon: HiDocumentText },
  { to: '/recruiter/pipeline', label: 'Pipeline', icon: HiViewColumns },
  { to: '/recruiter/candidates', label: 'Candidates', icon: HiUsers },
];

const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/applicant/jobs', label: 'Browse Jobs', icon: HiBriefcase },
  { to: '/applicant/applications', label: 'My Applications', icon: HiDocumentText },
  { to: '/applicant/resume', label: 'Resume', icon: HiDocumentArrowUp },
  { to: '/applicant/profile', label: 'Profile', icon: HiUser },
];

const roleConfig = {
  recruiter:   { label: 'Recruiter',   color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20',  dot: 'bg-primary' },
  applicant:   { label: 'Job Seeker',  color: 'text-success', bg: 'bg-success/10', border: 'border-success/20',  dot: 'bg-success' },
  super_admin: { label: 'Super Admin', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20',  dot: 'bg-warning' },
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = user?.role === ROLES.RECRUITER ? recruiterLinks : applicantLinks;
  const settingsPath = user?.role === ROLES.RECRUITER ? '/recruiter/settings' : '/applicant/settings';
  const role = roleConfig[user?.role] || roleConfig.applicant;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          // base
          'fixed inset-y-0 left-0 z-50 flex flex-col',
          'w-[260px] sm:w-[240px]',
          'bg-gradient-sidebar border-r border-border',
          'transition-transform duration-300 ease-out',
          // desktop: always visible as part of flow
          'lg:static lg:z-auto lg:translate-x-0 lg:shrink-0',
          // mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm shrink-0 relative">
              <span className="text-white font-bold text-sm">{APP_NAME[0]}</span>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-background" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text leading-none truncate">{APP_NAME}</p>
              <p className="text-[10px] text-text-muted mt-0.5">ATS Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors lg:hidden shrink-0 ml-2"
            aria-label="Close sidebar"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-3 py-2.5 border-b border-border/50">
          <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border', role.bg, role.border)}>
            <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', role.dot)} />
            <span className={cn('text-xs font-semibold truncate', role.color)}>{role.label}</span>
            <HiSparkles className={cn('w-3 h-3 ml-auto shrink-0', role.color, 'opacity-60')} />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-2.5 mb-2">
            Navigation
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative overflow-hidden border',
                  isActive
                    ? 'bg-primary/10 text-primary border-primary/15 shadow-glow-sm'
                    : 'text-text-secondary hover:text-text hover:bg-surface-hover border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                  )}
                  <link.icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform duration-200',
                      isActive ? 'text-primary' : 'text-text-muted group-hover:text-text group-hover:scale-110'
                    )}
                  />
                  <span className="truncate">{link.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-border/50 shrink-0 space-y-1">
          <NavLink
            to={settingsPath}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 border',
                isActive
                  ? 'bg-primary/10 text-primary border-primary/15'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover border-transparent'
              )
            }
          >
            <HiCog6Tooth className="w-4 h-4 shrink-0 text-text-muted group-hover:rotate-90 transition-transform duration-300" />
            <span className="truncate">Settings</span>
          </NavLink>

          {/* User mini card */}
          <div className="mt-1 p-3 rounded-xl bg-surface-elevated border border-border flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
