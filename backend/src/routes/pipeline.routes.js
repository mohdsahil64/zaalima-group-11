import { Router } from 'express';
import { getPipeline, moveApplication, getPipelineJobs } from '../controllers/pipeline.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

router.use(protect);
router.use(authorize('recruiter', 'super_admin'));

router.get('/', getPipeline);
router.get('/jobs', getPipelineJobs);
router.put('/:applicationId/move', moveApplication);

export default router;
