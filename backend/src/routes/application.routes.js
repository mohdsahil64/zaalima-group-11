import { Router } from 'express';
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
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

router.get('/', getApplications);
router.post('/', authorize('applicant'), createApplicationValidator, validate, createApplication);
router.put(
  '/:id/status',
  authorize('recruiter', 'super_admin'),
  updateApplicationStatusValidator,
  validate,
  updateApplicationStatus
);

export default router;
