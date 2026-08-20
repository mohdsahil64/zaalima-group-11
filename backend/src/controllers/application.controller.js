import applicationService from '../services/application.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Submit application
 * @route   POST /api/v1/applications
 * @access  Private (Applicant)
 */
export const createApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.createApplication(req.user._id, req.body);
  ApiResponse.created(res, { application }, 'Application submitted successfully');
});

/**
 * @desc    Get applications (role-scoped)
 * @route   GET /api/v1/applications
 * @access  Private
 */
export const getApplications = asyncHandler(async (req, res) => {
  const { applications, pagination } = await applicationService.getApplications(
    req.user._id,
    req.user.role,
    req.query
  );
  ApiResponse.paginated(res, applications, pagination, 'Applications retrieved successfully');
});

/**
 * @desc    Get single application
 * @route   GET /api/v1/applications/:id
 * @access  Private
 */
export const getApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(
    req.params.id,
    req.user._id,
    req.user.role
  );
  ApiResponse.success(res, { application }, 'Application retrieved successfully');
});

/**
 * @desc    Update application status
 * @route   PUT /api/v1/applications/:id/status
 * @access  Private (Recruiter)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateStatus(
    req.params.id,
    req.user._id,
    req.body.status,
    req.body.notes
  );
  ApiResponse.success(res, { application }, 'Application status updated');
});

/**
 * @desc    Get recruiter dashboard stats
 * @route   GET /api/v1/applications/recruiter-stats
 * @access  Private (Recruiter)
 */
export const getRecruiterStats = asyncHandler(async (req, res) => {
  const stats = await applicationService.getRecruiterStats(req.user._id);
  ApiResponse.success(res, { stats }, 'Stats retrieved successfully');
});

/**
 * @desc    Get applicant dashboard stats
 * @route   GET /api/v1/applications/applicant-stats
 * @access  Private (Applicant)
 */
export const getApplicantStats = asyncHandler(async (req, res) => {
  const stats = await applicationService.getApplicantStats(req.user._id);
  ApiResponse.success(res, { stats }, 'Stats retrieved successfully');
});
