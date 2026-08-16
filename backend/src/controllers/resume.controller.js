import s3Service from '../services/s3.service.js';
import parserService from '../services/parser.service.js';
import aiService from '../services/ai.service.js';
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

  // Parse the resume in background (non-blocking for the response)
  if (mimetype === 'application/pdf') {
    parserService.parseFromBuffer(buffer).then((parsed) => {
      // Save skills to applicant profile
      if (parsed.skills.length > 0) {
        Applicant.findOneAndUpdate(
          { user: req.user._id },
          { skills: parsed.skills }
        ).catch(() => {});
      }
    }).catch(() => {});
  }

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
  application.aiStatus = 'pending';
  await application.save();

  // Parse resume asynchronously — then trigger AI analysis
  if (mimetype === 'application/pdf') {
    parserService.parseAndSave(applicationId, buffer).then(() => {
      // After parsing, trigger AI if configured
      if (aiService.isConfigured()) {
        aiService.analyzeAndSave(applicationId).catch((err) => {
          console.error('[AI] Auto-analysis failed:', err.message);
        });
      }
    }).catch((err) => {
      console.error('[Resume] Async parse failed:', err.message);
    });
  }

  ApiResponse.success(res, {
    resume: {
      url: result.url,
      key: result.key,
      filename: result.filename,
    },
  }, 'Resume uploaded to application');
});

/**
 * @desc    Parse resume for an existing application (trigger manually or retry)
 * @route   POST /api/v1/resumes/parse/:applicationId
 * @access  Private (Recruiter, Admin)
 */
export const parseApplicationResume = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId);
  if (!application) throw ApiError.notFound('Application not found');
  if (!application.resume?.key) throw ApiError.badRequest('No resume uploaded for this application');

  // Trigger parsing from S3
  const parsed = await parserService.parseFromS3(application.resume.key);

  if (parsed && parsed.rawText) {
    application.parsedResume = {
      rawText: parsed.rawText.substring(0, 50000),
      skills: parsed.skills,
      experience: parsed.experience,
      education: parsed.education,
      parsedAt: new Date(),
    };
    await application.save();

    ApiResponse.success(res, { parsedResume: application.parsedResume }, 'Resume parsed successfully');
  } else {
    ApiResponse.success(res, null, 'Resume could not be parsed. File may not be a valid PDF.');
  }
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
