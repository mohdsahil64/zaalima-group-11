import { Router } from 'express';
import { getRankedCandidates, getRankingStats } from '../controllers/ranking.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

router.use(protect);
router.use(authorize('recruiter', 'super_admin'));

router.get('/candidates', getRankedCandidates);
router.get('/stats', getRankingStats);

export default router;
