import Application from '../models/Application.js';
import Job from '../models/Job.js';
import ApiError from '../utils/ApiError.js';
import { buildPagination } from '../utils/helpers.js';

class ApplicationService {
  async createApplication(applicantId, applicationData) {
    const { job: jobId, coverLetter, resume } = applicationData;

    // Verify job exists and is open
    const job = await Job.findById(jobId).select('status company title').lean();
    if (!job) throw ApiError.notFound('Job not found');
    if (job.status !== 'open') throw ApiError.badRequest('This job is no longer accepting applications');

    // Check for duplicate application
    const existing = await Application.findOne({ job: jobId, applicant: applicantId }).select('_id').lean();
    if (existing) throw ApiError.conflict('You have already applied to this job');

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      company: job.company,
      coverLetter,
      resume: resume || undefined,
      status: 'applied',
      aiStatus: 'pending',
    });

    // Increment total applications on job
    await Job.findByIdAndUpdate(jobId, { $inc: { totalApplications: 1 } });

    return application;
  }

  async getApplications(userId, role, query = {}) {
    const { page = 1, limit = 10, status, jobId, sort = '-createdAt' } = query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (role === 'applicant') {
      filter.applicant = userId;
    } else if (role === 'recruiter') {
      if (jobId) {
        filter.job = jobId;
      } else {
        const recruiterJobs = await Job.find({ recruiter: userId }).select('_id').lean();
        filter.job = { $in: recruiterJobs.map((j) => j._id) };
      }
    }

    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('job', 'title company location type')
        .populate('applicant', 'firstName lastName email avatar')
        .populate('company', 'name')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Application.countDocuments(filter),
    ]);

    return { applications, pagination: buildPagination(parseInt(page), parseInt(limit), total) };
  }

  async getApplicationById(applicationId, userId, role) {
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant', 'firstName lastName email phone avatar')
      .populate('company', 'name')
      .lean();

    if (!application) throw ApiError.notFound('Application not found');

    // Authorization check
    if (role === 'applicant' && application.applicant._id.toString() !== userId.toString()) {
      throw ApiError.forbidden('Not authorized');
    }
    if (role === 'recruiter' && application.job.recruiter.toString() !== userId.toString()) {
      throw ApiError.forbidden('Not authorized');
    }

    return application;
  }

  async updateStatus(applicationId, recruiterId, status, notes) {
    const application = await Application.findById(applicationId).populate('job', 'recruiter');

    if (!application) throw ApiError.notFound('Application not found');

    // Verify the recruiter owns this job
    if (application.job.recruiter.toString() !== recruiterId.toString()) {
      throw ApiError.forbidden('Not authorized to update this application');
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    return application;
  }

  async getRecruiterStats(recruiterId) {
    const recruiterJobs = await Job.find({ recruiter: recruiterId }).select('_id').lean();
    const jobIds = recruiterJobs.map((j) => j._id);

    const [total, applied, shortlisted, interview, offered, rejected] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.countDocuments({ job: { $in: jobIds }, status: 'applied' }),
      Application.countDocuments({ job: { $in: jobIds }, status: 'shortlisted' }),
      Application.countDocuments({ job: { $in: jobIds }, status: 'interview' }),
      Application.countDocuments({ job: { $in: jobIds }, status: 'offered' }),
      Application.countDocuments({ job: { $in: jobIds }, status: 'rejected' }),
    ]);

    return { total, applied, shortlisted, interview, offered, rejected };
  }

  async getApplicantStats(applicantId) {
    const [total, applied, shortlisted, interview, offered, rejected] = await Promise.all([
      Application.countDocuments({ applicant: applicantId }),
      Application.countDocuments({ applicant: applicantId, status: 'applied' }),
      Application.countDocuments({ applicant: applicantId, status: 'shortlisted' }),
      Application.countDocuments({ applicant: applicantId, status: 'interview' }),
      Application.countDocuments({ applicant: applicantId, status: 'offered' }),
      Application.countDocuments({ applicant: applicantId, status: 'rejected' }),
    ]);

    return { total, applied, shortlisted, interview, offered, rejected };
  }
}

export default new ApplicationService();
