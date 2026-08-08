import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from '@/components/common';

const ProtectedLayout = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes = {
      recruiter: '/recruiter/dashboard',
      applicant: '/applicant/dashboard',
      super_admin: '/admin/dashboard',
    };
    return <Navigate to={roleRoutes[user?.role] || '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
