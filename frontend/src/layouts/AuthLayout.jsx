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
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-surface relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative z-10 px-12 max-w-md">
          <div className="w-12 h-12 rounded-xl bg-primary/90 flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
            <span className="text-white text-xl font-bold">{APP_NAME[0]}</span>
          </div>
          <h1 className="text-2xl font-bold text-text mb-3 leading-tight">
            AI-Powered Recruitment Platform
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            Streamline your hiring with intelligent candidate matching, automated screening, and data-driven insights. Built for modern teams.
          </p>
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-sm text-text-secondary">AI-powered resume analysis and candidate scoring</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-sm text-text-secondary">Visual hiring pipeline with drag-and-drop management</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-sm text-text-secondary">Multi-portal access for admins, recruiters, and candidates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
