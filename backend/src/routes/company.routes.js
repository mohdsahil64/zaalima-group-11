import { Router } from 'express';
import { getMyCompany, updateMyCompany } from '../controllers/company.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

router.use(protect);
router.use(authorize('recruiter'));

router.get('/my-company', getMyCompany);
router.put('/my-company', updateMyCompany);

export default router;
