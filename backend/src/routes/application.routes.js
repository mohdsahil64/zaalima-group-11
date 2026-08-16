import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  getRecruiterStats,
  getApplicantStats,
} from '../controllers/application.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';
import validate from '../middlewares/validate.js';
import {
  createApplicationValidator,
  updateApplicationStatusValidator,
} from '../validators/application.validator.js';

const router = Router();

router.use(protect); // All application routes require authentication

// Stats
router.get('/recruiter-stats', authorize('recruiter'), getRecruiterStats);
router.get('/applicant-stats', authorize('applicant'), getApplicantStats);

// CRUD
router.get('/', getApplications);
router.get('/:id', getApplication);
router.post('/', authorize('applicant'), createApplicationValidator, validate, createApplication);
router.put(
  '/:id/status',
  authorize('recruiter', 'super_admin'),
  updateApplicationStatusValidator,
  validate,
  updateApplicationStatus
);

export default router;
