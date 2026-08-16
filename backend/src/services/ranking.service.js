import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { buildPagination } from '../utils/helpers.js';

class RankingService {
  /**
   * Get ranked candidates for a specific job
   * Server-side sorting by AI score, with filtering
   */
  async getRankedCandidates(recruiterId, query = {}) {
    const {
      page = 1,
      limit = 20,
      jobId,
      status,
      minScore,
      maxScore,
      sort = '-aiScore',
      search,
    } = query;

    const skip = (page - 1) * limit;

    // Build filter — only show applications for this recruiter's jobs
    let filter = {};

    if (jobId) {
      // Specific job
      const job = await Job.findOne({ _id: jobId, recruiter: recruiterId }).select('_id').lean();
      if (!job) return { candidates: [], pagination: buildPagination(1, limit, 0) };
      filter.job = jobId;
    } else {
      // All recruiter's jobs
      const recruiterJobs = await Job.find({ recruiter: recruiterId }).select('_id').lean();
      filter.job = { $in: recruiterJobs.map((j) => j._id) };
    }

    if (status) filter.status = status;
    if (minScore || maxScore) {
      filter.aiScore = {};
      if (minScore) filter.aiScore.$gte = Number(minScore);
      if (maxScore) filter.aiScore.$lte = Number(maxScore);
    }

    // Search by applicant name
    let applicantFilter = {};
    if (search) {
      applicantFilter = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const [candidates, total] = await Promise.all([
      Application.find(filter)
        .populate({
          path: 'applicant',
          select: 'firstName lastName email avatar',
          match: search ? applicantFilter : undefined,
        })
        .populate('job', 'title')
        .populate('company', 'name')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Application.countDocuments(filter),
    ]);

    // Filter out null applicants (from search mismatch)
    const filtered = search ? candidates.filter((c) => c.applicant != null) : candidates;

    return {
      candidates: filtered,
      pagination: buildPagination(parseInt(page), parseInt(limit), total),
    };
  }

  /**
   * Get ranking summary stats for recruiter
   */
  async getRankingStats(recruiterId) {
    const recruiterJobs = await Job.find({ recruiter: recruiterId }).select('_id').lean();
    const jobIds = recruiterJobs.map((j) => j._id);

    const baseFilter = { job: { $in: jobIds } };

    const [total, analyzed, strongMatch, goodMatch, partialMatch, weakMatch] = await Promise.all([
      Application.countDocuments(baseFilter),
      Application.countDocuments({ ...baseFilter, aiStatus: 'analyzed' }),
      Application.countDocuments({ ...baseFilter, 'aiAnalysis.recommendation': 'strong_match' }),
      Application.countDocuments({ ...baseFilter, 'aiAnalysis.recommendation': 'good_match' }),
      Application.countDocuments({ ...baseFilter, 'aiAnalysis.recommendation': 'partial_match' }),
      Application.countDocuments({ ...baseFilter, 'aiAnalysis.recommendation': 'weak_match' }),
    ]);

    const avgScore = await Application.aggregate([
      { $match: { ...baseFilter, aiScore: { $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$aiScore' } } },
    ]);

    return {
      total,
      analyzed,
      pending: total - analyzed,
      strongMatch,
      goodMatch,
      partialMatch,
      weakMatch,
      averageScore: Math.round(avgScore[0]?.avg || 0),
    };
  }
}

export default new RankingService();
