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
  HiAcademicCap,
  HiViewColumns,
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants';
import { cn } from '@/utils';

const recruiterLinks = [
  { to: '/recruiter/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/recruiter/company', label: 'Company Profile', icon: HiBuildingOffice2 },
  { to: '/recruiter/jobs', label: 'Jobs', icon: HiBriefcase },
  { to: '/recruiter/applications', label: 'Applications', icon: HiDocumentText },
  { to: '/recruiter/pipeline', label: 'Pipeline', icon: HiViewColumns },
  { to: '/recruiter/candidates', label: 'Candidates', icon: HiUsers },
];

const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/applicant/jobs', label: 'Browse Jobs', icon: HiBriefcase },
  { to: '/applicant/applications', label: 'My Applications', icon: HiDocumentText },
  { to: '/applicant/resume', label: 'My Resume', icon: HiDocumentArrowUp },
  { to: '/applicant/profile', label: 'Profile', icon: HiUser },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = user?.role === ROLES.RECRUITER ? recruiterLinks : applicantLinks;
  const settingsPath = user?.role === ROLES.RECRUITER ? '/recruiter/settings' : '/applicant/settings';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-[8px] text-text-secondary hover:text-text hover:bg-border transition-colors"
            aria-label="Close sidebar"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col h-full px-3 py-4 lg:pt-6">
          <div className="flex-1 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text hover:bg-border'
                  )
                }
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-border pt-4 mt-4 space-y-1">
            <NavLink
              to={settingsPath}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-text hover:bg-border'
                )
              }
            >
              <HiCog6Tooth className="w-5 h-5" />
              Settings
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
