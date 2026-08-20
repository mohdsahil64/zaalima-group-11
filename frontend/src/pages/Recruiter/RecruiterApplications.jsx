import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiDocumentText } from 'react-icons/hi2';
import ApplicationService from '@/services/application.service';
import { PageHeader, Card, Select, EmptyState, Badge, Button, Loader } from '@/components/common';
import { formatDate, capitalize } from '@/utils';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
];

const statusVariant = {
  applied: 'info',
  shortlisted: 'primary',
  interview: 'warning',
  offered: 'success',
  rejected: 'error',
  withdrawn: 'default',
};

const RecruiterApplications = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['recruiter', 'applications', { status: statusFilter }],
    queryFn: () => ApplicationService.getApplications({ status: statusFilter, limit: 20 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => ApplicationService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'stats'] });
      toast.success('Status updated');
    },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const applications = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Applications" subtitle="Review and manage candidate applications" />

      <div className="mb-6">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Status"
          className="w-full sm:w-48"
        />
      </div>

      <Card padding="none">
        {applications.length === 0 ? (
          <EmptyState icon={HiDocumentText} title="No applications yet" description="Applications will appear once candidates apply to your jobs." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Job</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
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
                        <span className={`text-sm font-medium ${app.aiScore >= 70 ? 'text-success' : app.aiScore >= 40 ? 'text-warning' : 'text-error'}`}>
                          {app.aiScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-text-secondary">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[app.status]}>{capitalize(app.status)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatDate(app.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={app.status}
                        onChange={(e) => updateMutation.mutate({ id: app._id, status: e.target.value })}
                        className="text-xs bg-surface border border-border rounded-[8px] px-2 py-1 text-text"
                      >
                        {statusOptions.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
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

export default RecruiterApplications;
