import jobService from '../services/job.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all jobs (public)
 * @route   GET /api/v1/jobs
 * @access  Public
 */
export const getJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await jobService.getJobs(req.query);
  ApiResponse.paginated(res, jobs, pagination, 'Jobs retrieved successfully');
});

/**
 * @desc    Get single job
 * @route   GET /api/v1/jobs/:id
 * @access  Public
 */
export const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  ApiResponse.success(res, { job }, 'Job retrieved successfully');
});

/**
 * @desc    Create a job
 * @route   POST /api/v1/jobs
 * @access  Private (Recruiter)
 */
export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user._id, req.body);
  ApiResponse.created(res, { job }, 'Job created successfully');
});

/**
 * @desc    Update a job
 * @route   PUT /api/v1/jobs/:id
 * @access  Private (Recruiter)
 */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.user._id, req.body);
  ApiResponse.success(res, { job }, 'Job updated successfully');
});

/**
 * @desc    Delete a job
 * @route   DELETE /api/v1/jobs/:id
 * @access  Private (Recruiter)
 */
export const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user._id);
  ApiResponse.success(res, null, 'Job deleted successfully');
});

/**
 * @desc    Get recruiter's own jobs
 * @route   GET /api/v1/jobs/my-jobs
 * @access  Private (Recruiter)
 */
export const getMyJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await jobService.getRecruiterJobs(req.user._id, req.query);
  ApiResponse.paginated(res, jobs, pagination, 'Jobs retrieved successfully');
});
