import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader } from '@/components/common';
import { DashboardLayout, ProtectedLayout, AuthLayout, PublicLayout } from '@/layouts';
import { ROLES } from '@/constants';

// Lazy loaded pages
const LandingPage = lazy(() => import('@/pages/Public/LandingPage'));
const JobBoardPage = lazy(() => import('@/pages/Public/JobBoardPage'));
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/Auth/ResetPasswordPage'));
const RecruiterDashboard = lazy(() => import('@/pages/Recruiter/RecruiterDashboard'));
const ApplicantDashboard = lazy(() => import('@/pages/Applicant/ApplicantDashboard'));
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/Profile/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));

const App = () => {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="jobs" element={<JobBoardPage />} />
        </Route>

        {/* Auth routes - redirect if already logged in */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Recruiter routes */}
        <Route element={<ProtectedLayout allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="recruiter/jobs" element={<RecruiterDashboard />} />
            <Route path="recruiter/applications" element={<RecruiterDashboard />} />
            <Route path="recruiter/candidates" element={<RecruiterDashboard />} />
            <Route path="recruiter/analytics" element={<RecruiterDashboard />} />
          </Route>
        </Route>

        {/* Applicant routes */}
        <Route element={<ProtectedLayout allowedRoles={[ROLES.APPLICANT]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="applicant/dashboard" element={<ApplicantDashboard />} />
            <Route path="applicant/jobs" element={<ApplicantDashboard />} />
            <Route path="applicant/applications" element={<ApplicantDashboard />} />
            <Route path="applicant/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Shared authenticated routes */}
        <Route element={<ProtectedLayout allowedRoles={[ROLES.RECRUITER, ROLES.APPLICANT, ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
