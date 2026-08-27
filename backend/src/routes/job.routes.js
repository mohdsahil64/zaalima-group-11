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

import {
  createJobValidator,
  updateJobValidator,
} from '../validators/job.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// GET /api/v1/jobs
router.get('/', getJobs);

/*
|--------------------------------------------------------------------------
| Protected Recruiter Routes
|--------------------------------------------------------------------------
*/

// IMPORTANT:
// /recruiter/my-jobs must come BEFORE /:id
router.get(
  '/recruiter/my-jobs',
  protect,
  authorize('recruiter', 'super_admin'),
  getMyJobs
);

// GET /api/v1/jobs/:id
router.get('/:id', getJob);

/*
|--------------------------------------------------------------------------
| Job CRUD
|--------------------------------------------------------------------------
*/

// POST /api/v1/jobs
router.post(
  '/',
  protect,
  authorize('recruiter', 'super_admin'),
  createJobValidator,
  validate,
  createJob
);

// PUT /api/v1/jobs/:id
router.put(
  '/:id',
  protect,
  authorize('recruiter', 'super_admin'),
  updateJobValidator,
  validate,
  updateJob
);

// DELETE /api/v1/jobs/:id
router.delete(
  '/:id',
  protect,
  authorize('recruiter', 'super_admin'),
  deleteJob
);

export default router;