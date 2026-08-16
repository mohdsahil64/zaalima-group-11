import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import emailService from '../services/email.service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get pipeline view — applications grouped by status for a recruiter
 * @route   GET /api/v1/pipeline
 * @access  Private (Recruiter)
 */
export const getPipeline = asyncHandler(async (req, res) => {
  const { jobId } = req.query;

  let filter = {};

  if (jobId) {
    // Specific job
    const job = await Job.findOne({ _id: jobId, recruiter: req.user._id }).select('_id').lean();
    if (!job) throw ApiError.notFound('Job not found');
    filter.job = jobId;
  } else {
    // All recruiter's jobs
    const recruiterJobs = await Job.find({ recruiter: req.user._id }).select('_id').lean();
    filter.job = { $in: recruiterJobs.map((j) => j._id) };
  }

  const applications = await Application.find(filter)
    .populate('applicant', 'firstName lastName email avatar')
    .populate('job', 'title')
    .select('applicant job status aiScore aiAnalysis createdAt')
    .sort('-createdAt')
    .lean();

  // Group by status
  const pipeline = {
    applied: [],
    shortlisted: [],
    interview: [],
    offered: [],
    rejected: [],
  };

  applications.forEach((app) => {
    if (pipeline[app.status]) {
      pipeline[app.status].push(app);
    }
  });

  ApiResponse.success(res, { pipeline }, 'Pipeline retrieved');
});

/**
 * @desc    Move application to a new stage
 * @route   PUT /api/v1/pipeline/:applicationId/move
 * @access  Private (Recruiter)
 */
export const moveApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['applied', 'shortlisted', 'interview', 'offered', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest('Invalid status');
  }

  const application = await Application.findById(applicationId).populate('job', 'recruiter');
  if (!application) throw ApiError.notFound('Application not found');

  // Verify ownership
  if (application.job.recruiter.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  application.status = status;
  if (notes) application.notes = notes;
  await application.save();

  // Send email notification (non-blocking)
  const applicant = await User.findById(application.applicant).select('firstName email').lean();
  const job = await Job.findById(application.job).populate('company', 'name').lean();
  if (applicant && job) {
    emailService.notifyStatusChange({
      applicantEmail: applicant.email,
      applicantName: applicant.firstName,
      jobTitle: job.title,
      companyName: job.company?.name || '',
      newStatus: status,
    }).catch(() => {});
  }

  ApiResponse.success(res, { application }, `Application moved to ${status}`);
});

/**
 * @desc    Get recruiter's jobs for pipeline filter
 * @route   GET /api/v1/pipeline/jobs
 * @access  Private (Recruiter)
 */
export const getPipelineJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id })
    .select('title totalApplications status')
    .sort('-createdAt')
    .lean();

  ApiResponse.success(res, { jobs }, 'Jobs retrieved');
});
