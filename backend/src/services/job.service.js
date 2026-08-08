import Job from '../models/Job.js';
import ApiError from '../utils/ApiError.js';
import { buildPagination } from '../utils/helpers.js';

class JobService {
  async getJobs(query = {}) {
    const { page = 1, limit = 10, search, type, experience, status = 'open', sort = '-createdAt' } = query;
    const skip = (page - 1) * limit;

    const filter = { status };

    if (search) {
      filter.$text = { $search: search };
    }
    if (type) filter.type = type;
    if (experience) filter.experience = experience;

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('recruiter', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Job.countDocuments(filter),
    ]);

    const pagination = buildPagination(parseInt(page), parseInt(limit), total);

    return { jobs, pagination };
  }

  async getJobById(jobId) {
    const job = await Job.findById(jobId)
      .populate('recruiter', 'firstName lastName email')
      .lean();
    if (!job) {
      throw ApiError.notFound('Job not found');
    }
    return job;
  }

  async createJob(recruiterId, jobData) {
    const job = await Job.create({
      ...jobData,
      recruiter: recruiterId,
    });
    return job;
  }

  async updateJob(jobId, recruiterId, updateData) {
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) {
      throw ApiError.notFound('Job not found or unauthorized');
    }

    Object.assign(job, updateData);
    await job.save();
    return job;
  }

  async deleteJob(jobId, recruiterId) {
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) {
      throw ApiError.notFound('Job not found or unauthorized');
    }

    await job.deleteOne();
    return job;
  }

  async getRecruiterJobs(recruiterId, query = {}) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const filter = { recruiter: recruiterId };
    if (status) filter.status = status;

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)).lean(),
      Job.countDocuments(filter),
    ]);

    const pagination = buildPagination(parseInt(page), parseInt(limit), total);

    return { jobs, pagination };
  }
}

export default new JobService();
