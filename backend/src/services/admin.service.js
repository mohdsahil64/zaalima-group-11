import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import ApiError from '../utils/ApiError.js';
import { buildPagination } from '../utils/helpers.js';

class AdminService {
  async getStats() {
    const [
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      totalRecruiters,
      totalApplicants,
      totalJobs,
      activeJobs,
      totalApplications,
    ] = await Promise.all([
      Company.countDocuments(),
      Company.countDocuments({ status: 'pending' }),
      Company.countDocuments({ status: 'approved' }),
      User.countDocuments({ role: 'recruiter' }),
      User.countDocuments({ role: 'applicant' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'open' }),
      Application.countDocuments(),
    ]);

    return {
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      totalRecruiters,
      totalApplicants,
      totalJobs,
      activeJobs,
      totalApplications,
    };
  }

  async getCompanies(query = {}) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .populate('owner', 'firstName lastName email')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Company.countDocuments(filter),
    ]);

    return { companies, pagination: buildPagination(parseInt(page), parseInt(limit), total) };
  }

  async getCompanyById(companyId) {
    const company = await Company.findById(companyId)
      .populate('owner', 'firstName lastName email phone')
      .lean();
    if (!company) throw ApiError.notFound('Company not found');
    return company;
  }

  async approveCompany(companyId) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found');
    if (company.status === 'approved') throw ApiError.badRequest('Company already approved');

    company.status = 'approved';
    company.approvedAt = new Date();
    company.rejectedAt = null;
    company.rejectionReason = null;
    await company.save();
    return company;
  }

  async rejectCompany(companyId, reason) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found');

    company.status = 'rejected';
    company.rejectedAt = new Date();
    company.rejectionReason = reason || null;
    await company.save();
    return company;
  }

  async suspendCompany(companyId) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found');

    company.status = 'suspended';
    await company.save();

    // Also pause all open jobs for this company
    await Job.updateMany(
      { company: companyId, status: 'open' },
      { status: 'paused' }
    );

    return company;
  }

  async reactivateCompany(companyId) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found');

    company.status = 'approved';
    company.approvedAt = new Date();
    await company.save();
    return company;
  }

  async getRecruiters(query = {}) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter = { role: 'recruiter' };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [recruiters, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    return { recruiters, pagination: buildPagination(parseInt(page), parseInt(limit), total) };
  }

  async getApplicants(query = {}) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter = { role: 'applicant' };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [applicants, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    return { applicants, pagination: buildPagination(parseInt(page), parseInt(limit), total) };
  }

  async toggleUserStatus(userId) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    if (user.role === 'super_admin') throw ApiError.forbidden('Cannot modify admin accounts');

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    return user;
  }

  async getJobs(query = {}) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('company', 'name')
        .populate('recruiter', 'firstName lastName')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Job.countDocuments(filter),
    ]);

    return { jobs, pagination: buildPagination(parseInt(page), parseInt(limit), total) };
  }

  async getApplications(query = {}) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('job', 'title')
        .populate('applicant', 'firstName lastName email')
        .populate('company', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Application.countDocuments(filter),
    ]);

    return { applications, pagination: buildPagination(parseInt(page), parseInt(limit), total) };
  }
}

export default new AdminService();
