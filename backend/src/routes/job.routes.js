import { Router } from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/job.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';
import validate from '../middlewares/validate.js';
import { createJobValidator, updateJobValidator } from '../validators/job.validator.js';

const router = Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes (Recruiter only)
router.use(protect);
router.get('/recruiter/my-jobs', authorize('recruiter', 'super_admin'), getMyJobs);
router.post('/', authorize('recruiter', 'super_admin'), createJobValidator, validate, createJob);
router.put('/:id', authorize('recruiter', 'super_admin'), updateJobValidator, validate, updateJob);
router.delete('/:id', authorize('recruiter', 'super_admin'), deleteJob);

export default router;
