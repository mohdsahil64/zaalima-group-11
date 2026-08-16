import { Router } from 'express';
import multer from 'multer';
import {
  uploadResume,
  uploadResumeForApplication,
  parseApplicationResume,
  getResumeUrl,
} from '../controllers/resume.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

// Multer memory storage (for S3 upload — keeps file in buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  },
});

router.use(protect);

// Upload resume to profile
router.post('/upload', authorize('applicant'), upload.single('resume'), uploadResume);

// Upload resume to specific application
router.post('/upload/:applicationId', authorize('applicant'), upload.single('resume'), uploadResumeForApplication);

// Trigger parsing for an application (recruiter/admin retry)
router.post('/parse/:applicationId', authorize('recruiter', 'super_admin'), parseApplicationResume);

// Get signed download URL
router.get('/download/:key(*)', getResumeUrl);

export default router;
