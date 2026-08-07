import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common';
import { APP_NAME } from '@/constants';

const PublicLayout = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/';
    const routes = {
      recruiter: '/recruiter/dashboard',
      applicant: '/applicant/dashboard',
      admin: '/admin/dashboard',
    };
    return routes[user.role] || '/';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Public Navbar */}
      <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">{APP_NAME[0]}</span>
            </div>
            <span className="text-lg font-bold text-text">{APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/jobs" className="text-sm text-text-secondary hover:text-text transition-colors">
              Jobs
            </Link>
            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
