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
 * @desc    Get applications
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
