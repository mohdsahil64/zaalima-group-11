import { Link, useNavigate } from 'react-router-dom';
import { HiBars3, HiBell, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/common';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors lg:hidden"
            aria-label="Menu"
          >
            <HiBars3 className="w-5 h-5" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors relative"
            aria-label="Notifications"
          >
            <HiBell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>

          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
            <Avatar
              src={user?.avatar}
              firstName={user?.firstName}
              lastName={user?.lastName}
              size="sm"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-text leading-none">{user?.firstName} {user?.lastName}</p>
              <p className="text-[11px] text-text-muted capitalize mt-0.5">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-colors ml-1"
              aria-label="Logout"
            >
              <HiArrowRightOnRectangle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
