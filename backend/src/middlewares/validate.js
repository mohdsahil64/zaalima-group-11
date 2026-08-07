import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to handle express-validator results
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => err.msg);
    throw ApiError.badRequest('Validation failed', extractedErrors);
  }

  next();
};

export default validate;
