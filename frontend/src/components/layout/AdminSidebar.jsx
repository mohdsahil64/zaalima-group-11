import { NavLink } from 'react-router-dom';
import {
  HiHome,
  HiBuildingOffice2,
  HiUsers,
  HiBriefcase,
  HiUserGroup,
  HiDocumentText,
  HiCog6Tooth,
  HiXMark,
  HiShieldCheck,
} from 'react-icons/hi2';
import { APP_NAME } from '@/constants';
import { cn } from '@/utils';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/admin/companies', label: 'Companies', icon: HiBuildingOffice2 },
  { to: '/admin/recruiters', label: 'Recruiters', icon: HiUsers },
  { to: '/admin/jobs', label: 'Jobs', icon: HiBriefcase },
  { to: '/admin/applicants', label: 'Applicants', icon: HiUserGroup },
  { to: '/admin/applications', label: 'Applications', icon: HiDocumentText },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
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
              <HiShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-text">{APP_NAME}</span>
              <span className="text-[10px] text-text-muted ml-1.5 bg-surface-elevated px-1.5 py-0.5 rounded">Admin</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:text-text lg:hidden" aria-label="Close">
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {adminLinks.map((link) => (
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
            to="/admin/settings"
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

export default AdminSidebar;
