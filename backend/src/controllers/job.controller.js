import jobService from '../services/job.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await jobService.getJobs(req.query);

  ApiResponse.paginated(
    res,
    jobs,
    pagination,
    'Jobs retrieved successfully'
  );
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);

  ApiResponse.success(
    res,
    { job },
    'Job retrieved successfully'
  );
});

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(
    req.user._id,
    req.body
  );

  ApiResponse.created(
    res,
    { job },
    'Job created successfully'
  );
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(
    req.params.id,
    req.user._id,
    req.body
  );

  ApiResponse.success(
    res,
    { job },
    'Job updated successfully'
  );
});

export const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(
    req.params.id,
    req.user._id
  );

  ApiResponse.success(
    res,
    null,
    'Job deleted successfully'
  );
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } =
    await jobService.getRecruiterJobs(
      req.user._id,
      req.query
    );

  ApiResponse.paginated(
    res,
    jobs,
    pagination,
    'Recruiter jobs retrieved successfully'
  );
});

export const getAdminJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } =
    await jobService.getAllJobsForAdmin(req.query);

  ApiResponse.paginated(
    res,
    jobs,
    pagination,
    'All jobs retrieved successfully'
  );
});

export const adminUpdateJob = asyncHandler(async (req, res) => {
  const job = await jobService.adminUpdateJob(
    req.params.id,
    req.body
  );

  ApiResponse.success(
    res,
    { job },
    'Job updated successfully'
  );
});

export const adminDeleteJob = asyncHandler(async (req, res) => {
  await jobService.adminDeleteJob(req.params.id);

  ApiResponse.success(
    res,
    null,
    'Job deleted successfully'
  );
});