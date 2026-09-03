import userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const { user, applicantProfile } = await userService.getProfile(req.user._id);
  ApiResponse.success(res, { user, applicantProfile }, 'Profile retrieved successfully');
});

/**
 * @desc    Update user profile (User fields + Applicant fields if role is applicant)
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { user, applicantProfile } = await userService.updateProfile(req.user._id, req.body);
  ApiResponse.success(res, { user, applicantProfile }, 'Profile updated successfully');
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/users/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user._id, currentPassword, newPassword);
  ApiResponse.success(res, null, 'Password changed successfully');
});
