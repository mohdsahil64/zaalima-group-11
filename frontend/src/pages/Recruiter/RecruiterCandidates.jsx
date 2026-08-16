import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiUserGroup } from 'react-icons/hi2';
import ApplicationService from '@/services/application.service';
import { PageHeader, Card, EmptyState, Badge, Loader, Select } from '@/components/common';
import { formatDate, capitalize } from '@/utils';

const sortOptions = [
  { value: '-aiScore', label: 'Highest Score' },
  { value: 'aiScore', label: 'Lowest Score' },
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
];

const statusVariant = {
  applied: 'info',
  shortlisted: 'primary',
  interview: 'warning',
  offered: 'success',
  rejected: 'error',
};

const RecruiterCandidates = () => {
  const [sort, setSort] = useState('-createdAt');

  const { data, isLoading } = useQuery({
    queryKey: ['recruiter', 'candidates', { sort }],
    queryFn: () => ApplicationService.getApplications({ sort, limit: 50 }),
  });

  const applications = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Candidates" subtitle="Browse and rank your candidate pool" />

      <div className="mb-6">
        <Select
          options={sortOptions}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          placeholder="Sort by"
          className="w-full sm:w-56"
        />
      </div>

      <Card padding="none">
        {applications.length === 0 ? (
          <EmptyState icon={HiUserGroup} title="No candidates yet" description="Candidates who apply to your jobs will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Job</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Match Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-text">{app.applicant?.firstName} {app.applicant?.lastName}</p>
                      <p className="text-xs text-text-secondary">{app.applicant?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.job?.title || '-'}</td>
                    <td className="px-4 py-3">
                      {app.aiScore != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-border overflow-hidden">
                            <div
                              className={`h-full rounded-full ${app.aiScore >= 70 ? 'bg-success' : app.aiScore >= 40 ? 'bg-warning' : 'bg-error'}`}
                              style={{ width: `${app.aiScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-text">{app.aiScore}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-secondary">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[app.status]}>{capitalize(app.status)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatDate(app.createdAt)}</td>
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
