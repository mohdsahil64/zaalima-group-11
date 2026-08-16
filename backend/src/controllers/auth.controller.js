import authService from '../services/auth.service.js';
import Recruiter from '../models/Recruiter.js';
import { generateTokenResponse } from '../middlewares/auth.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  generateTokenResponse(user, 201, res, 'Registration successful');
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);
  generateTokenResponse(user, 200, res, 'Login successful');
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (_req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  ApiResponse.success(res, null, 'Logout successful');
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await authService.forgotPassword(req.body.email);

  // TODO: Send email with reset URL in production
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

  ApiResponse.success(res, { resetUrl }, 'Password reset token generated');
});

/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const user = await authService.resetPassword(req.params.token, req.body.password);
  generateTokenResponse(user, 200, res, 'Password reset successful');
});

/**
 * @desc    Get current user with role-specific profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const userData = { user: req.user };

  // If recruiter, include company info
  if (req.user.role === 'recruiter') {
    const recruiter = await Recruiter.findOne({ user: req.user._id })
      .populate('company')
      .lean();
    if (recruiter) {
      userData.recruiter = recruiter;
      userData.company = recruiter.company;
    }
  }

  ApiResponse.success(res, userData, 'User retrieved successfully');
});
