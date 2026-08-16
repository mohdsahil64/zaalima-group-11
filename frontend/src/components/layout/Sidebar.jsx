import { NavLink } from 'react-router-dom';
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
  { to: '/applicant/applications', label: 'Applications', icon: HiDocumentText },
  { to: '/applicant/resume', label: 'Resume', icon: HiDocumentArrowUp },
  { to: '/applicant/profile', label: 'Profile', icon: HiUser },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = user?.role === ROLES.RECRUITER ? recruiterLinks : applicantLinks;
  const settingsPath = user?.role === ROLES.RECRUITER ? '/recruiter/settings' : '/applicant/settings';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[240px] bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 lg:static lg:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">{APP_NAME[0]}</span>
            </div>
            <span className="text-sm font-semibold text-text">{APP_NAME}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-text lg:hidden"
            aria-label="Close"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-text hover:bg-surface-hover'
                )
              }
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-border shrink-0">
          <NavLink
            to={settingsPath}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
              )
            }
          >
            <HiCog6Tooth className="w-4 h-4 shrink-0" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
