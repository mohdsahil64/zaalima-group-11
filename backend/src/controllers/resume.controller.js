import s3Service from '../services/s3.service.js';
import Application from '../models/Application.js';
import Applicant from '../models/Applicant.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Upload resume (general — stored on applicant profile)
 * @route   POST /api/v1/resumes/upload
 * @access  Private (Applicant)
 */
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No file uploaded');
  }

  const { buffer, originalname, mimetype } = req.file;

  // Validate MIME type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(mimetype)) {
    throw ApiError.badRequest('Invalid file type. Only PDF and DOCX are allowed.');
  }

  // Upload to S3
  const result = await s3Service.uploadFile(buffer, originalname, mimetype, 'resumes');

  // Update applicant profile with resume info
  await Applicant.findOneAndUpdate(
    { user: req.user._id },
    {
      resume: {
        url: result.url,
        filename: result.filename,
        uploadedAt: new Date(),
      },
    }
  );

  ApiResponse.success(res, {
    resume: {
      url: result.url,
      key: result.key,
      filename: result.filename,
    },
  }, 'Resume uploaded successfully');
});

/**
 * @desc    Upload resume for a specific application
 * @route   POST /api/v1/resumes/upload/:applicationId
 * @access  Private (Applicant)
 */
export const uploadResumeForApplication = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No file uploaded');
  }

  const { applicationId } = req.params;
  const { buffer, originalname, mimetype } = req.file;

  // Validate MIME type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(mimetype)) {
    throw ApiError.badRequest('Invalid file type. Only PDF and DOCX are allowed.');
  }

  // Verify application belongs to user
  const application = await Application.findOne({ _id: applicationId, applicant: req.user._id });
  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  // Upload to S3
  const result = await s3Service.uploadFile(buffer, originalname, mimetype, 'resumes');

  // Update application resume
  application.resume = {
    url: result.url,
    key: result.key,
    filename: result.filename,
  };
  application.aiStatus = 'pending'; // Reset AI status for re-processing
  await application.save();

  ApiResponse.success(res, {
    resume: {
      url: result.url,
      key: result.key,
      filename: result.filename,
    },
  }, 'Resume uploaded to application');
});

/**
 * @desc    Get signed URL for resume download
 * @route   GET /api/v1/resumes/download/:key
 * @access  Private
 */
export const getResumeUrl = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const signedUrl = await s3Service.getSignedUrl(decodeURIComponent(key));
  ApiResponse.success(res, { url: signedUrl }, 'Signed URL generated');
});
