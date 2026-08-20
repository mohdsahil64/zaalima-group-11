import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader } from '@/components/common';
import { DashboardLayout, ProtectedLayout, AuthLayout, PublicLayout } from '@/layouts';
import AdminLayout from '@/layouts/AdminLayout';
import { ROLES } from '@/constants';

// Auth pages
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/Auth/ResetPasswordPage'));

// Public pages
const LandingPage = lazy(() => import('@/pages/Public/LandingPage'));
const JobBoardPage = lazy(() => import('@/pages/Public/JobBoardPage'));
const JobDetailPage = lazy(() => import('@/pages/Public/JobDetailPage'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/Admin/AdminDashboard'));
const AdminCompanies = lazy(() => import('@/pages/Admin/AdminCompanies'));
const AdminRecruiters = lazy(() => import('@/pages/Admin/AdminRecruiters'));
const AdminJobs = lazy(() => import('@/pages/Admin/AdminJobs'));
const AdminApplicants = lazy(() => import('@/pages/Admin/AdminApplicants'));
const AdminApplications = lazy(() => import('@/pages/Admin/AdminApplications'));
const AdminSettings = lazy(() => import('@/pages/Admin/AdminSettings'));

// Recruiter pages
const RecruiterDashboard = lazy(() => import('@/pages/Recruiter/RecruiterDashboard'));
const RecruiterCompany = lazy(() => import('@/pages/Recruiter/RecruiterCompany'));
const RecruiterJobs = lazy(() => import('@/pages/Recruiter/RecruiterJobs'));
const RecruiterCreateJob = lazy(() => import('@/pages/Recruiter/RecruiterCreateJob'));
const RecruiterJobDetail = lazy(() => import('@/pages/Recruiter/RecruiterJobDetail'));
const RecruiterApplications = lazy(() => import('@/pages/Recruiter/RecruiterApplications'));
const RecruiterCandidates = lazy(() => import('@/pages/Recruiter/RecruiterCandidates'));
const RecruiterPipeline = lazy(() => import('@/pages/Recruiter/RecruiterPipeline'));
const RecruiterSettings = lazy(() => import('@/pages/Recruiter/RecruiterSettings'));

// Applicant pages
const ApplicantDashboard = lazy(() => import('@/pages/Applicant/ApplicantDashboard'));
const ApplicantJobs = lazy(() => import('@/pages/Applicant/ApplicantJobs'));
const ApplicantJobDetail = lazy(() => import('@/pages/Applicant/ApplicantJobDetail'));
const ApplicantApplications = lazy(() => import('@/pages/Applicant/ApplicantApplications'));
const ApplicantResume = lazy(() => import('@/pages/Applicant/ApplicantResume'));
const ApplicantProfile = lazy(() => import('@/pages/Applicant/ApplicantProfile'));
const ApplicantSettings = lazy(() => import('@/pages/Applicant/ApplicantSettings'));

// Other
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));

const App = () => {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="jobs" element={<JobBoardPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedLayout allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/companies" element={<AdminCompanies />} />
            <Route path="admin/recruiters" element={<AdminRecruiters />} />
            <Route path="admin/jobs" element={<AdminJobs />} />
            <Route path="admin/applicants" element={<AdminApplicants />} />
            <Route path="admin/applications" element={<AdminApplications />} />
            <Route path="admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Recruiter routes */}
        <Route element={<ProtectedLayout allowedRoles={[ROLES.RECRUITER]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="recruiter/company" element={<RecruiterCompany />} />
            <Route path="recruiter/jobs" element={<RecruiterJobs />} />
            <Route path="recruiter/jobs/create" element={<RecruiterCreateJob />} />
            <Route path="recruiter/jobs/:id" element={<RecruiterJobDetail />} />
            <Route path="recruiter/applications" element={<RecruiterApplications />} />
            <Route path="recruiter/candidates" element={<RecruiterCandidates />} />
            <Route path="recruiter/pipeline" element={<RecruiterPipeline />} />
            <Route path="recruiter/settings" element={<RecruiterSettings />} />
          </Route>
        </Route>

        {/* Applicant routes */}
        <Route element={<ProtectedLayout allowedRoles={[ROLES.APPLICANT]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="applicant/dashboard" element={<ApplicantDashboard />} />
            <Route path="applicant/jobs" element={<ApplicantJobs />} />
            <Route path="applicant/jobs/:id" element={<ApplicantJobDetail />} />
            <Route path="applicant/applications" element={<ApplicantApplications />} />
            <Route path="applicant/resume" element={<ApplicantResume />} />
            <Route path="applicant/profile" element={<ApplicantProfile />} />
            <Route path="applicant/settings" element={<ApplicantSettings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
