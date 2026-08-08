import { Router } from 'express';
import { getStats, getCompanies, getRecruiters, getApplicants } from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

// All admin routes require authentication + super_admin role
router.use(protect);
router.use(authorize('super_admin'));

router.get('/stats', getStats);
router.get('/companies', getCompanies);
router.get('/recruiters', getRecruiters);
router.get('/applicants', getApplicants);

export default router;
