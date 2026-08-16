import { Router } from 'express';
import { analyzeApplication, getAnalysis, analyzeJobApplications } from '../controllers/ai.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

router.use(protect);

// Trigger analysis for single application
router.post('/analyze/:applicationId', authorize('recruiter', 'super_admin'), analyzeApplication);

// Bulk analyze all applications for a job
router.post('/analyze-job/:jobId', authorize('recruiter', 'super_admin'), analyzeJobApplications);

// Get analysis results
router.get('/analysis/:applicationId', getAnalysis);

export default router;
