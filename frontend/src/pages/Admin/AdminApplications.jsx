import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiDocumentText } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, Select, EmptyState, Badge, Loader } from '@/components/common';
import { formatDate, capitalize } from '@/utils';

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

const AdminApplications = () => {
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'applications', { status: statusFilter }],
    queryFn: () => AdminService.getApplications({ status: statusFilter, limit: 20 }),
  });

  const applications = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Applications" subtitle="Monitor all job applications" />

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
          <EmptyState icon={HiDocumentText} title="No applications yet" description="Applications will appear once applicants start applying." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Applicant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Job</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">AI Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm text-text">
                      {app.applicant?.firstName} {app.applicant?.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.job?.title || '-'}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.company?.name || '-'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[app.status] || 'default'}>{capitalize(app.status)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text">
                      {app.aiScore != null ? `${app.aiScore}%` : '-'}
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

export default AdminApplications;
