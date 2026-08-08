import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/v1/admin/stats
 * @access  Private (Super Admin)
 */
export const getStats = asyncHandler(async (_req, res) => {
  // Placeholder - will be implemented with real queries
  const stats = {
    totalCompanies: 0,
    pendingCompanies: 0,
    totalRecruiters: 0,
    totalApplicants: 0,
    totalJobs: 0,
    totalApplications: 0,
  };

  ApiResponse.success(res, { stats }, 'Stats retrieved successfully');
});

/**
 * @desc    Get all companies
 * @route   GET /api/v1/admin/companies
 * @access  Private (Super Admin)
 */
export const getCompanies = asyncHandler(async (_req, res) => {
  ApiResponse.success(res, { companies: [] }, 'Companies retrieved successfully');
});

/**
 * @desc    Get all recruiters
 * @route   GET /api/v1/admin/recruiters
 * @access  Private (Super Admin)
 */
export const getRecruiters = asyncHandler(async (_req, res) => {
  ApiResponse.success(res, { recruiters: [] }, 'Recruiters retrieved successfully');
});

/**
 * @desc    Get all applicants
 * @route   GET /api/v1/admin/applicants
 * @access  Private (Super Admin)
 */
export const getApplicants = asyncHandler(async (_req, res) => {
  ApiResponse.success(res, { applicants: [] }, 'Applicants retrieved successfully');
});
