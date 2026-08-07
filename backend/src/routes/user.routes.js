import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { updateProfileValidator, changePasswordValidator } from '../validators/user.validator.js';

const router = Router();

router.use(protect); // All user routes require authentication

router.get('/me', getProfile);
router.put('/me', updateProfileValidator, validate, updateProfile);
router.put('/change-password', changePasswordValidator, validate, changePassword);

export default router;
