import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from '@/components/common';
import { APP_NAME } from '@/constants';

const AuthLayout = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (isAuthenticated) {
    const roleRoutes = {
      recruiter: '/recruiter/dashboard',
      applicant: '/applicant/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={roleRoutes[user?.role] || '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-border items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-[16px] bg-primary mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{APP_NAME[0]}</span>
          </div>
          <h1 className="text-3xl font-bold text-text mb-3">
            AI-Powered Recruitment
          </h1>
          <p className="text-text-secondary text-lg">
            Streamline your hiring process with intelligent candidate matching, automated screening, and data-driven insights.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
