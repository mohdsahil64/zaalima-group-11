import { body } from 'express-validator';

export const updateProfileValidator = [
  // User model fields
  body('firstName').optional().trim().isLength({ max: 50 }).withMessage('Max 50 characters'),
  body('lastName').optional().trim().isLength({ max: 50 }).withMessage('Max 50 characters'),
  body('phone').optional().trim(),
  body('avatar').optional().trim(),

  // Applicant model fields
  body('headline').optional().trim().isLength({ max: 120 }).withMessage('Headline max 120 characters'),
  body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio max 1000 characters'),
  body('location').optional().trim(),
  body('portfolio').optional().trim(),
  body('linkedin').optional().trim(),
  body('github').optional().trim(),
  body('experienceLevel').optional().trim()
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive', ''])
    .withMessage('Invalid experience level'),
  body('skills')
    .optional()
    .custom((val) => {
      if (!Array.isArray(val)) throw new Error('Skills must be an array');
      if (val.some(s => typeof s !== 'string' || s.trim() === '')) throw new Error('Each skill must be a non-empty string');
      if (val.length > 50) throw new Error('Maximum 50 skills allowed');
      return true;
    }),
  body('experience').optional().isArray().withMessage('Experience must be an array'),
  body('education').optional().isArray().withMessage('Education must be an array'),
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];
