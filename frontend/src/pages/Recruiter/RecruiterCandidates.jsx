import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiUserGroup, HiSparkles } from 'react-icons/hi2';
import api from '@/services/api';
import AIService from '@/services/ai.service';
import { PageHeader, Card, SearchBox, Select, EmptyState, Badge, Button, Loader } from '@/components/common';
import { formatDate, capitalize } from '@/utils';
import toast from 'react-hot-toast';

const sortOptions = [
  { value: '-aiScore', label: 'Highest Score' },
  { value: 'aiScore', label: 'Lowest Score' },
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
];

const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
];

const recommendationColors = {
  strong_match: 'text-success',
  good_match: 'text-primary',
  partial_match: 'text-warning',
  weak_match: 'text-error',
};

const RecruiterCandidates = () => {
  const [sort, setSort] = useState('-aiScore');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['ranking', 'candidates', { sort, status, search }],
    queryFn: () => api.get('/ranking/candidates', { params: { sort, status, search, limit: 30 } }),
  });

  const { data: statsData } = useQuery({
    queryKey: ['ranking', 'stats'],
    queryFn: () => api.get('/ranking/stats'),
  });

  const analyzeMutation = useMutation({
    mutationFn: (appId) => AIService.analyzeApplication(appId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      toast.success('AI analysis complete');
    },
    onError: (err) => toast.error(err.message || 'Analysis failed'),
  });

  const candidates = data?.data || [];
  const stats = statsData?.data?.stats || {};

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Candidate Ranking" subtitle="AI-powered candidate matching and ranking" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Total</p>
          <p className="text-xl font-bold text-text">{stats.total || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Analyzed</p>
          <p className="text-xl font-bold text-primary">{stats.analyzed || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Avg Score</p>
          <p className="text-xl font-bold text-text">{stats.averageScore || 0}%</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-text-secondary">Strong Matches</p>
          <p className="text-xl font-bold text-success">{stats.strongMatch || 0}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox value={search} onChange={setSearch} placeholder="Search candidates..." className="flex-1 max-w-md" />
        <Select options={sortOptions} value={sort} onChange={(e) => setSort(e.target.value)} placeholder="Sort by" className="w-full sm:w-48" />
        <Select options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value)} placeholder="All Status" className="w-full sm:w-44" />
      </div>

      {/* Candidates Table */}
      <Card padding="none">
        {candidates.length === 0 ? (
          <EmptyState icon={HiUserGroup} title="No candidates" description="Candidates will appear here after they apply and their resumes are analyzed." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Job</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">AI Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Recommendation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Skills Matched</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {candidates.map((app) => (
                  <tr key={app._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-text">{app.applicant?.firstName} {app.applicant?.lastName}</p>
                      <p className="text-xs text-text-secondary">{app.applicant?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.job?.title || '-'}</td>
                    <td className="px-4 py-3">
                      {app.aiScore != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 rounded-full bg-border overflow-hidden">
                            <div
                              className={`h-full rounded-full ${app.aiScore >= 70 ? 'bg-success' : app.aiScore >= 40 ? 'bg-warning' : 'bg-error'}`}
                              style={{ width: `${app.aiScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-text">{app.aiScore}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-secondary">{app.aiStatus === 'processing' ? 'Processing...' : 'Pending'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {app.aiAnalysis?.recommendation ? (
                        <span className={`text-xs font-medium ${recommendationColors[app.aiAnalysis.recommendation] || 'text-text-secondary'}`}>
                          {app.aiAnalysis.recommendation.replace('_', ' ')}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(app.aiAnalysis?.skillsMatched || []).slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="success" size="sm">{skill}</Badge>
                        ))}
                        {(app.aiAnalysis?.skillsMatched?.length || 0) > 3 && (
                          <Badge variant="default" size="sm">+{app.aiAnalysis.skillsMatched.length - 3}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={app.status === 'applied' ? 'info' : app.status === 'shortlisted' ? 'primary' : 'default'}>
                        {capitalize(app.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {app.aiStatus !== 'analyzed' && app.parsedResume?.rawText && (
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={HiSparkles}
                          onClick={() => analyzeMutation.mutate(app._id)}
                          loading={analyzeMutation.isPending}
                        >
                          Analyze
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecruiterCandidates;
