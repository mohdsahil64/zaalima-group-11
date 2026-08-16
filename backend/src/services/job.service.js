import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Recruiter from '../models/Recruiter.js';
import ApiError from '../utils/ApiError.js';
import { buildPagination } from '../utils/helpers.js';

class JobService {
  /**
   * Get recruiter's company (with approval check)
   */
  async _getRecruiterCompany(recruiterId) {
    const recruiter = await Recruiter.findOne({ user: recruiterId }).populate('company').lean();
    if (!recruiter) throw ApiError.notFound('Recruiter profile not found');
    if (!recruiter.company) throw ApiError.badRequest('No company associated');
    return recruiter.company;
  }

  /**
   * Public job listing with search/filter/pagination
   */
  async getJobs(query = {}) {
    const { page = 1, limit = 10, search, type, experience, location, status = 'open', sort = '-createdAt' } = query;
    const skip = (page - 1) * limit;

    const filter = { status };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) filter.type = type;
    if (experience) filter.experience = experience;
    if (location) filter.location = { $regex: location, $options: 'i' };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('company', 'name logo location')
        .populate('recruiter', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Job.countDocuments(filter),
    ]);

    return { jobs, pagination: buildPagination(parseInt(page), parseInt(limit), total) };
  }

  async getJobById(jobId) {
    const job = await Job.findById(jobId)
      .populate('company', 'name logo location website industry size description')
      .populate('recruiter', 'firstName lastName email')
      .lean();
    if (!job) throw ApiError.notFound('Job not found');
    return job;
  }

  /**
   * Create job - only approved companies can create jobs
   */
  async createJob(recruiterId, jobData) {
    const company = await this._getRecruiterCompany(recruiterId);

    if (company.status !== 'approved') {
      throw ApiError.forbidden('Your company must be approved before posting jobs. Current status: ' + company.status);
    }

    const job = await Job.create({
      ...jobData,
      recruiter: recruiterId,
      company: company._id,
    });

    // Increment recruiter's job count
    await Recruiter.findOneAndUpdate(
      { user: recruiterId },
      { $inc: { totalJobsPosted: 1 } }
    );

    return job;
  }

  async updateJob(jobId, recruiterId, updateData) {
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) throw ApiError.notFound('Job not found or unauthorized');

    // Don't allow publishing if company not approved
    if (updateData.status === 'open') {
      const company = await this._getRecruiterCompany(recruiterId);
      if (company.status !== 'approved') {
        throw ApiError.forbidden('Your company must be approved before publishing jobs');
      }
    }

    Object.assign(job, updateData);
    await job.save();
    return job;
  }

  async deleteJob(jobId, recruiterId) {
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) throw ApiError.notFound('Job not found or unauthorized');
    await job.deleteOne();
    return job;
  }

  async getRecruiterJobs(recruiterId, query = {}) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const filter = { recruiter: recruiterId };
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('company', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Job.countDocuments(filter),
    ]);

    return { jobs, pagination: buildPagination(parseInt(page), parseInt(limit), total) };
  }
}

export default new JobService();
