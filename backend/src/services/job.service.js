import mongoose from 'mongoose';
import Job from '../models/Job.js';
import ApiError from '../utils/ApiError.js';
import { buildPagination } from '../utils/helpers.js';

class JobService {
  async getJobs(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      experience,
      status = 'open',
      sort = '-createdAt',
    } = query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const currentLimit = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (currentPage - 1) * currentLimit;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    if (type) {
      filter.type = type;
    }

    if (experience) {
      filter.experience = experience;
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('recruiter', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Job.countDocuments(filter),
    ]);

    const pagination = buildPagination(
      currentPage,
      currentLimit,
      total
    );

    return {
      jobs,
      pagination,
    };
  }

  async getJobById(jobId) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw ApiError.badRequest('Invalid job ID');
    }

    const job = await Job.findById(jobId)
      .populate('recruiter', 'firstName lastName email')
      .lean();

    if (!job) {
      throw ApiError.notFound('Job not found');
    }

    return job;
  }

  async createJob(recruiterId, jobData) {
    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      throw ApiError.badRequest('Invalid recruiter ID');
    }

    const job = await Job.create({
      ...jobData,
      recruiter: recruiterId,
    });

    return Job.findById(job._id)
      .populate('recruiter', 'firstName lastName email')
      .lean();
  }

  async updateJob(jobId, recruiterId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw ApiError.badRequest('Invalid job ID');
    }

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      throw ApiError.badRequest('Invalid recruiter ID');
    }

    const job = await Job.findOne({
      _id: jobId,
      recruiter: recruiterId,
    });

    if (!job) {
      throw ApiError.notFound(
        'Job not found or you are not authorized to modify it'
      );
    }

    Object.assign(job, updateData);

    await job.save();

    return Job.findById(job._id)
      .populate('recruiter', 'firstName lastName email')
      .lean();
  }

  async deleteJob(jobId, recruiterId) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw ApiError.badRequest('Invalid job ID');
    }

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      throw ApiError.badRequest('Invalid recruiter ID');
    }

    const job = await Job.findOne({
      _id: jobId,
      recruiter: recruiterId,
    });

    if (!job) {
      throw ApiError.notFound(
        'Job not found or you are not authorized to delete it'
      );
    }

    await job.deleteOne();

    return job;
  }

  async getRecruiterJobs(recruiterId, query = {}) {
    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      throw ApiError.badRequest('Invalid recruiter ID');
    }

    const {
      page = 1,
      limit = 10,
      status,
    } = query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);

    const currentLimit = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (currentPage - 1) * currentLimit;

    const filter = {
      recruiter: recruiterId,
    };

    if (status) {
      filter.status = status;
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Job.countDocuments(filter),
    ]);

    const pagination = buildPagination(
      currentPage,
      currentLimit,
      total
    );

    return {
      jobs,
      pagination,
    };
  }

  async getAllJobsForAdmin(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      experience,
      status,
    } = query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);

    const currentLimit = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (currentPage - 1) * currentLimit;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (experience) {
      filter.experience = experience;
    }

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('recruiter', 'firstName lastName email')
        .sort('-createdAt')
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Job.countDocuments(filter),
    ]);

    const pagination = buildPagination(
      currentPage,
      currentLimit,
      total
    );

    return {
      jobs,
      pagination,
    };
  }

  async adminUpdateJob(jobId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw ApiError.badRequest('Invalid job ID');
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('recruiter', 'firstName lastName email')
      .lean();

    if (!job) {
      throw ApiError.notFound('Job not found');
    }

    return job;
  }

  async adminDeleteJob(jobId) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw ApiError.badRequest('Invalid job ID');
    }

    const job = await Job.findById(jobId);

    if (!job) {
      throw ApiError.notFound('Job not found');
    }

    await job.deleteOne();

    return job;
  }
}

export default new JobService();