import { Router } from 'express';
import {
  getStats,
  getCompanies,
  getCompany,
  approveCompany,
  rejectCompany,
  suspendCompany,
  reactivateCompany,
  getRecruiters,
  getApplicants,
  toggleUserStatus,
  getAdminJobs,
  getAdminApplications,
} from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

// All admin routes require authentication + super_admin role
router.use(protect);
router.use(authorize('super_admin'));

// Dashboard
router.get('/stats', getStats);

// Companies
router.get('/companies', getCompanies);
router.get('/companies/:id', getCompany);
router.put('/companies/:id/approve', approveCompany);
router.put('/companies/:id/reject', rejectCompany);
router.put('/companies/:id/suspend', suspendCompany);
router.put('/companies/:id/reactivate', reactivateCompany);

// Users
router.get('/recruiters', getRecruiters);
router.get('/applicants', getApplicants);
router.put('/users/:id/toggle-status', toggleUserStatus);

// Jobs & Applications
router.get('/jobs', getAdminJobs);
router.get('/applications', getAdminApplications);

export default router;
