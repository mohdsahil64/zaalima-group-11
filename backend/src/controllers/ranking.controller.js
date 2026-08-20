import rankingService from '../services/ranking.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get ranked candidates for recruiter
 * @route   GET /api/v1/ranking/candidates
 * @access  Private (Recruiter)
 */
export const getRankedCandidates = asyncHandler(async (req, res) => {
  const { candidates, pagination } = await rankingService.getRankedCandidates(
    req.user._id,
    req.query
  );
  ApiResponse.paginated(res, candidates, pagination, 'Ranked candidates retrieved');
});

/**
 * @desc    Get ranking stats summary
 * @route   GET /api/v1/ranking/stats
 * @access  Private (Recruiter)
 */
export const getRankingStats = asyncHandler(async (req, res) => {
  const stats = await rankingService.getRankingStats(req.user._id);
  ApiResponse.success(res, { stats }, 'Ranking stats retrieved');
});
