import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from '@/components/common';
import { APP_NAME } from '@/constants';

const AuthLayout = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (isAuthenticated) {
    const roleRoutes = {
      recruiter: '/recruiter/dashboard',
      applicant: '/applicant/dashboard',
      super_admin: '/admin/dashboard',
    };
    return <Navigate to={roleRoutes[user?.role] || '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Branding panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-surface border-r border-border relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-8">
              <span className="text-white text-lg font-bold">{APP_NAME[0]}</span>
            </div>
            <h1 className="text-2xl font-semibold text-text mb-3 tracking-tight">
              AI-Powered Recruitment Platform
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Streamline your hiring with intelligent candidate matching, automated screening, and data-driven insights. Built for modern teams.
            </p>
            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-xs text-text-muted">AI-powered resume analysis and candidate scoring</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-xs text-text-muted">Visual hiring pipeline with drag-and-drop management</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-xs text-text-muted">Multi-portal access for admins, recruiters, and candidates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
