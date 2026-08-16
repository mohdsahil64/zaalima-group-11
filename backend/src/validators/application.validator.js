import { body } from 'express-validator';

export const createApplicationValidator = [
  body('job').notEmpty().withMessage('Job ID is required').isMongoId().withMessage('Invalid Job ID'),
  body('coverLetter')
    .optional()
    .isLength({ max: 3000 })
    .withMessage('Cover letter cannot exceed 3000 characters'),
];

export const updateApplicationStatusValidator = [
  body('status')
    .isIn(['applied', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'])
    .withMessage('Invalid application status'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];
