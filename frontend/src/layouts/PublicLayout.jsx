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
      super_admin: '/admin/dashboard',
    };
    return routes[user.role] || '/';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">{APP_NAME[0]}</span>
            </div>
            <span className="text-sm font-semibold text-text">{APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link to="/jobs" className="text-xs text-text-secondary hover:text-text transition-colors font-medium">
              Jobs
            </Link>
            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
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
      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] text-text-muted">
            &copy; {new Date().getFullYear()} {APP_NAME}. Built with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
