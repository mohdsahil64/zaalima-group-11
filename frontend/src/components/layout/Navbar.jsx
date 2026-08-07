import { Link, useNavigate } from 'react-router-dom';
import { HiBars3, HiBell, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/common';
import { APP_NAME } from '@/constants';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-[8px] text-text-secondary hover:text-text hover:bg-border transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <HiBars3 className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">{APP_NAME[0]}</span>
            </div>
            <span className="text-lg font-bold text-text hidden sm:block">{APP_NAME}</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="p-2 rounded-[8px] text-text-secondary hover:text-text hover:bg-border transition-colors relative"
            aria-label="Notifications"
          >
            <HiBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* User menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-text">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
            </div>
            <Avatar
              src={user?.avatar}
              firstName={user?.firstName}
              lastName={user?.lastName}
              size="sm"
            />
            <button
              onClick={handleLogout}
              className="p-2 rounded-[8px] text-text-secondary hover:text-error hover:bg-error/10 transition-colors"
              aria-label="Logout"
            >
              <HiArrowRightOnRectangle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
