import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Recruiter from '../models/Recruiter.js';
import ApiError from '../utils/ApiError.js';
import { buildPagination } from '../utils/helpers.js';

class JobService {
  async _getRecruiterCompany(recruiterId) {
    const recruiter = await Recruiter.findOne({ user: recruiterId }).populate('company').lean();
    if (!recruiter) throw ApiError.notFound('Recruiter profile not found');
    if (!recruiter.company) throw ApiError.badRequest('No company associated');
    return recruiter.company;
  }

  _getPagination(page, limit) {
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const currentLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    return { currentPage, currentLimit, skip: (currentPage - 1) * currentLimit };
  }

  async getJobs(query = {}) {
    const { page = 1, limit = 10, search, type, experience, location, status = 'open', sort = '-createdAt' } = query;
    const { currentPage, currentLimit, skip } = this._getPagination(page, limit);
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };
    if (type) filter.type = type;
    if (experience) filter.experience = experience;
    if (location) filter.location = { $regex: location, $options: 'i' };

    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('company', 'name logo location').populate('recruiter', 'firstName lastName').sort(sort).skip(skip).limit(currentLimit).lean(),
      Job.countDocuments(filter),
    ]);
    return { jobs, pagination: buildPagination(currentPage, currentLimit, total) };
  }

  async getJobById(jobId) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) throw ApiError.badRequest('Invalid job ID');
    const job = await Job.findById(jobId).populate('company', 'name logo location website industry size description').populate('recruiter', 'firstName lastName email').lean();
    if (!job) throw ApiError.notFound('Job not found');
    return job;
  }

  async createJob(recruiterId, jobData) {
    if (!mongoose.Types.ObjectId.isValid(recruiterId)) throw ApiError.badRequest('Invalid recruiter ID');
    const company = await this._getRecruiterCompany(recruiterId);
    if (company.status !== 'approved') throw ApiError.forbidden(`Your company must be approved before posting jobs. Current status: ${company.status}`);

    const job = await Job.create({ ...jobData, recruiter: recruiterId, company: company._id });
    await Recruiter.findOneAndUpdate({ user: recruiterId }, { $inc: { totalJobsPosted: 1 } });
    return Job.findById(job._id).populate('company', 'name logo location').populate('recruiter', 'firstName lastName email').lean();
  }

  async updateJob(jobId, recruiterId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) throw ApiError.badRequest('Invalid job ID');
    if (!mongoose.Types.ObjectId.isValid(recruiterId)) throw ApiError.badRequest('Invalid recruiter ID');
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) throw ApiError.notFound('Job not found or you are not authorized to modify it');
    if (updateData.status === 'open') {
      const company = await this._getRecruiterCompany(recruiterId);
      if (company.status !== 'approved') throw ApiError.forbidden('Your company must be approved before publishing jobs');
    }
    delete updateData.company;
    delete updateData.recruiter;
    Object.assign(job, updateData);
    await job.save();
    return Job.findById(job._id).populate('company', 'name logo location').populate('recruiter', 'firstName lastName email').lean();
  }

  async deleteJob(jobId, recruiterId) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) throw ApiError.badRequest('Invalid job ID');
    if (!mongoose.Types.ObjectId.isValid(recruiterId)) throw ApiError.badRequest('Invalid recruiter ID');
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) throw ApiError.notFound('Job not found or you are not authorized to delete it');
    await job.deleteOne();
    return job;
  }

  async getRecruiterJobs(recruiterId, query = {}) {
    if (!mongoose.Types.ObjectId.isValid(recruiterId)) throw ApiError.badRequest('Invalid recruiter ID');
    const { page = 1, limit = 10, status, search } = query;
    const { currentPage, currentLimit, skip } = this._getPagination(page, limit);
    const filter = { recruiter: recruiterId };
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };
    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('company', 'name').sort('-createdAt').skip(skip).limit(currentLimit).lean(),
      Job.countDocuments(filter),
    ]);
    return { jobs, pagination: buildPagination(currentPage, currentLimit, total) };
  }
}

export default new JobService();
