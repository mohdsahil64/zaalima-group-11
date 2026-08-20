import Company from '../models/Company.js';
import Recruiter from '../models/Recruiter.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get recruiter's company
 * @route   GET /api/v1/companies/my-company
 * @access  Private (Recruiter)
 */
export const getMyCompany = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ user: req.user._id }).populate('company').lean();
  if (!recruiter || !recruiter.company) {
    throw ApiError.notFound('Company not found');
  }
  ApiResponse.success(res, { company: recruiter.company }, 'Company retrieved successfully');
});

/**
 * @desc    Update recruiter's company
 * @route   PUT /api/v1/companies/my-company
 * @access  Private (Recruiter)
 */
export const updateMyCompany = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ user: req.user._id }).lean();
  if (!recruiter) throw ApiError.notFound('Recruiter profile not found');

  const allowedFields = ['name', 'email', 'website', 'industry', 'size', 'location', 'description', 'logo'];
  const updateData = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updateData[key] = req.body[key];
    }
  });

  const company = await Company.findByIdAndUpdate(
    recruiter.company,
    updateData,
    { new: true, runValidators: true }
  );

  if (!company) throw ApiError.notFound('Company not found');
  ApiResponse.success(res, { company }, 'Company updated successfully');
});
