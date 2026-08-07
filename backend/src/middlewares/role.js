import ApiError from '../utils/ApiError.js';

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};
