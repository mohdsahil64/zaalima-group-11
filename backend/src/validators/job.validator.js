import { body } from 'express-validator';

const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'internship',
  'remote',
];

const EXPERIENCE_LEVELS = [
  'entry',
  'mid',
  'senior',
  'lead',
  'executive',
];

const JOB_STATUSES = [
  'open',
  'closed',
  'draft',
  'paused',
];

const validateStringArray = (field, label) =>
  body(field)
    .optional()
    .isArray()
    .withMessage(`${label} must be an array`)
    .custom((items) => {
      if (!items.every((item) => typeof item === 'string')) {
        throw new Error(`${label} must contain only strings`);
      }
      return true;
    });

export const createJobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),

  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),

  body('type')
    .isIn(JOB_TYPES)
    .withMessage('Invalid job type'),

  body('experience')
    .optional()
    .isIn(EXPERIENCE_LEVELS)
    .withMessage('Invalid experience level'),

  body('salary')
    .optional()
    .isObject()
    .withMessage('Salary must be an object'),

  body('salary.min')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('Minimum salary must be a number'),

  body('salary.max')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('Maximum salary must be a number'),

  body('salary.currency')
    .optional()
    .isString()
    .withMessage('Salary currency must be a string'),

  validateStringArray('skills', 'Skills'),

  validateStringArray('requirements', 'Requirements'),

  validateStringArray('benefits', 'Benefits'),
];

export const updateJobValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job description cannot be empty')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),

  body('company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty'),

  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),

  body('type')
    .optional()
    .isIn(JOB_TYPES)
    .withMessage('Invalid job type'),

  body('experience')
    .optional()
    .isIn(EXPERIENCE_LEVELS)
    .withMessage('Invalid experience level'),

  body('salary')
    .optional()
    .isObject()
    .withMessage('Salary must be an object'),

  body('salary.min')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('Minimum salary must be a number'),

  body('salary.max')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('Maximum salary must be a number'),

  body('salary.currency')
    .optional()
    .isString()
    .withMessage('Salary currency must be a string'),

  validateStringArray('skills', 'Skills'),

  validateStringArray('requirements', 'Requirements'),

  validateStringArray('benefits', 'Benefits'),

  body('status')
    .optional()
    .isIn(JOB_STATUSES)
    .withMessage('Invalid job status'),
];