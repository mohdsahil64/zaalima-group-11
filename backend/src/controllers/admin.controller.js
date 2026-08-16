import adminService from '../services/admin.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/v1/admin/stats
 * @access  Private (Super Admin)
 */
export const getStats = asyncHandler(async (_req, res) => {
  const stats = await adminService.getStats();
  ApiResponse.success(res, { stats }, 'Stats retrieved successfully');
});

/**
 * @desc    Get all companies
 * @route   GET /api/v1/admin/companies
 * @access  Private (Super Admin)
 */
export const getCompanies = asyncHandler(async (req, res) => {
  const { companies, pagination } = await adminService.getCompanies(req.query);
  ApiResponse.paginated(res, companies, pagination, 'Companies retrieved successfully');
});

/**
 * @desc    Get single company
 * @route   GET /api/v1/admin/companies/:id
 * @access  Private (Super Admin)
 */
export const getCompany = asyncHandler(async (req, res) => {
  const company = await adminService.getCompanyById(req.params.id);
  ApiResponse.success(res, { company }, 'Company retrieved successfully');
});

/**
 * @desc    Approve company
 * @route   PUT /api/v1/admin/companies/:id/approve
 * @access  Private (Super Admin)
 */
export const approveCompany = asyncHandler(async (req, res) => {
  const company = await adminService.approveCompany(req.params.id);
  ApiResponse.success(res, { company }, 'Company approved successfully');
});

/**
 * @desc    Reject company
 * @route   PUT /api/v1/admin/companies/:id/reject
 * @access  Private (Super Admin)
 */
export const rejectCompany = asyncHandler(async (req, res) => {
  const company = await adminService.rejectCompany(req.params.id, req.body.reason);
  ApiResponse.success(res, { company }, 'Company rejected');
});

/**
 * @desc    Suspend company
 * @route   PUT /api/v1/admin/companies/:id/suspend
 * @access  Private (Super Admin)
 */
export const suspendCompany = asyncHandler(async (req, res) => {
  const company = await adminService.suspendCompany(req.params.id);
  ApiResponse.success(res, { company }, 'Company suspended');
});

/**
 * @desc    Reactivate company
 * @route   PUT /api/v1/admin/companies/:id/reactivate
 * @access  Private (Super Admin)
 */
export const reactivateCompany = asyncHandler(async (req, res) => {
  const company = await adminService.reactivateCompany(req.params.id);
  ApiResponse.success(res, { company }, 'Company reactivated');
});

/**
 * @desc    Get all recruiters
 * @route   GET /api/v1/admin/recruiters
 * @access  Private (Super Admin)
 */
export const getRecruiters = asyncHandler(async (req, res) => {
  const { recruiters, pagination } = await adminService.getRecruiters(req.query);
  ApiResponse.paginated(res, recruiters, pagination, 'Recruiters retrieved successfully');
});

/**
 * @desc    Get all applicants
 * @route   GET /api/v1/admin/applicants
 * @access  Private (Super Admin)
 */
export const getApplicants = asyncHandler(async (req, res) => {
  const { applicants, pagination } = await adminService.getApplicants(req.query);
  ApiResponse.paginated(res, applicants, pagination, 'Applicants retrieved successfully');
});

/**
 * @desc    Toggle user active status
 * @route   PUT /api/v1/admin/users/:id/toggle-status
 * @access  Private (Super Admin)
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.toggleUserStatus(req.params.id);
  ApiResponse.success(res, { user }, `User ${user.isActive ? 'activated' : 'suspended'}`);
});

/**
 * @desc    Get all jobs (admin view)
 * @route   GET /api/v1/admin/jobs
 * @access  Private (Super Admin)
 */
export const getAdminJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await adminService.getJobs(req.query);
  ApiResponse.paginated(res, jobs, pagination, 'Jobs retrieved successfully');
});

/**
 * @desc    Get all applications (admin view)
 * @route   GET /api/v1/admin/applications
 * @access  Private (Super Admin)
 */
export const getAdminApplications = asyncHandler(async (req, res) => {
  const { applications, pagination } = await adminService.getApplications(req.query);
  ApiResponse.paginated(res, applications, pagination, 'Applications retrieved successfully');
});
