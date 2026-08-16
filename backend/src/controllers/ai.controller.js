import aiService from '../services/ai.service.js';
import Application from '../models/Application.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Trigger AI analysis for an application
 * @route   POST /api/v1/ai/analyze/:applicationId
 * @access  Private (Recruiter, Admin)
 */
export const analyzeApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  if (!aiService.isConfigured()) {
    throw ApiError.badRequest('AI service not configured. Set GOOGLE_AI_API_KEY or OPENAI_API_KEY in environment.');
  }

  const application = await Application.findById(applicationId);
  if (!application) throw ApiError.notFound('Application not found');

  if (!application.parsedResume?.rawText) {
    throw ApiError.badRequest('Resume not parsed yet. Upload and parse the resume first.');
  }

  // Run analysis (non-blocking for the response if needed, but here we wait for result)
  const result = await aiService.analyzeAndSave(applicationId);

  if (result) {
    ApiResponse.success(res, { analysis: result }, 'AI analysis completed');
  } else {
    throw ApiError.internal('AI analysis failed. Please try again later.');
  }
});

/**
 * @desc    Get AI analysis for an application
 * @route   GET /api/v1/ai/analysis/:applicationId
 * @access  Private (Recruiter, Admin, Applicant-own)
 */
export const getAnalysis = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId)
    .select('aiScore aiAnalysis aiStatus')
    .lean();

  if (!application) throw ApiError.notFound('Application not found');

  ApiResponse.success(res, {
    aiScore: application.aiScore,
    aiAnalysis: application.aiAnalysis,
    aiStatus: application.aiStatus,
  }, 'Analysis retrieved');
});

/**
 * @desc    Bulk analyze all pending applications for a job
 * @route   POST /api/v1/ai/analyze-job/:jobId
 * @access  Private (Recruiter, Admin)
 */
export const analyzeJobApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!aiService.isConfigured()) {
    throw ApiError.badRequest('AI service not configured. Set GOOGLE_AI_API_KEY or OPENAI_API_KEY.');
  }

  // Find applications with parsed resumes but no AI analysis
  const applications = await Application.find({
    job: jobId,
    'parsedResume.rawText': { $ne: null },
    aiStatus: { $in: ['pending', 'failed'] },
  }).select('_id');

  if (applications.length === 0) {
    return ApiResponse.success(res, { processed: 0 }, 'No applications to analyze');
  }

  // Process asynchronously - don't block response
  const count = applications.length;

  // Fire and forget — process in background
  setImmediate(async () => {
    for (const app of applications) {
      try {
        await aiService.analyzeAndSave(app._id);
        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`[AI] Bulk analysis error for ${app._id}:`, err.message);
      }
    }
  });

  ApiResponse.success(res, { queued: count }, `${count} applications queued for AI analysis`);
});
