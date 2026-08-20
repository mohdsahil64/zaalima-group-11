import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiDocumentText } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, Select, EmptyState, Badge, Skeleton } from '@/components/common';
import { formatDate, capitalize } from '@/utils';

const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
];
const statusVariant = { applied: 'info', shortlisted: 'primary', interview: 'warning', offered: 'success', rejected: 'error' };

const AdminApplications = () => {
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'applications', { status: statusFilter }],
    queryFn: () => AdminService.getApplications({ status: statusFilter, limit: 20 }),
  });

  const applications = data?.data || [];

  if (isLoading) return <Skeleton.Table rows={5} />;

  return (
    <div className="page-enter">
      <PageHeader title="Applications" subtitle="Monitor all applications" />
      <div className="mb-5">
        <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="All Status" className="w-full sm:w-40" />
      </div>
      <Card padding="none">
        {applications.length === 0 ? (
          <EmptyState icon={HiDocumentText} title="No applications" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Applicant</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Job</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Company</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Score</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Applied</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-text">{app.applicant?.firstName} {app.applicant?.lastName}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{app.job?.title || '-'}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{app.company?.name || '-'}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant[app.status]} dot>{capitalize(app.status)}</Badge></td>
                    <td className="px-4 py-3 text-xs font-medium text-text">{app.aiScore != null ? `${app.aiScore}%` : '-'}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{formatDate(app.createdAt)}</td>
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
