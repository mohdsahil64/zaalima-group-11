import Application from '../models/Application.js';
import Job from '../models/Job.js';
import ApiError from '../utils/ApiError.js';
import { buildPagination } from '../utils/helpers.js';

class ApplicationService {
  async createApplication(applicantId, applicationData) {
    const { job: jobId, coverLetter } = applicationData;

    // Verify job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      throw ApiError.notFound('Job not found');
    }
    if (job.status !== 'open') {
      throw ApiError.badRequest('This job is no longer accepting applications');
    }

    // Check for duplicate application
    const existing = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existing) {
      throw ApiError.conflict('You have already applied to this job');
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      coverLetter,
    });

    // Increment total applications on job
    await Job.findByIdAndUpdate(jobId, { $inc: { totalApplications: 1 } });

    return application;
  }

  async getApplications(userId, role, query = {}) {
    const { page = 1, limit = 10, status, jobId } = query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (role === 'applicant') {
      filter.applicant = userId;
    } else if (role === 'recruiter') {
      if (jobId) {
        filter.job = jobId;
      } else {
        // Get all jobs by this recruiter
        const recruiterJobs = await Job.find({ recruiter: userId }).select('_id');
        filter.job = { $in: recruiterJobs.map((j) => j._id) };
      }
    }

    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('job', 'title company location type')
        .populate('applicant', 'firstName lastName email')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Application.countDocuments(filter),
    ]);

    const pagination = buildPagination(parseInt(page), parseInt(limit), total);

    return { applications, pagination };
  }

  async updateStatus(applicationId, recruiterId, status, notes) {
    const application = await Application.findById(applicationId).populate('job');

    if (!application) {
      throw ApiError.notFound('Application not found');
    }

    // Verify the recruiter owns this job
    if (application.job.recruiter.toString() !== recruiterId.toString()) {
      throw ApiError.forbidden('Not authorized to update this application');
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    return application;
  }
}

export default new ApplicationService();
