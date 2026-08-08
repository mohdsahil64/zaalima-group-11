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
} from 'react-icons/hi2';
import { cn } from '@/utils';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/admin/companies', label: 'Companies', icon: HiBuildingOffice2 },
  { to: '/admin/recruiters', label: 'Recruiters', icon: HiUsers },
  { to: '/admin/jobs', label: 'Jobs', icon: HiBriefcase },
  { to: '/admin/applicants', label: 'Applicants', icon: HiUserGroup },
  { to: '/admin/applications', label: 'Applications', icon: HiDocumentText },
];

const bottomLinks = [
  { to: '/admin/settings', label: 'Settings', icon: HiCog6Tooth },
];

const AdminSidebar = ({ isOpen, onClose }) => {
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
            {adminLinks.map((link) => (
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
            {bottomLinks.map((link) => (
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
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
