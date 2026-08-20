import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiBriefcase } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, SearchBox, Select, EmptyState, Badge, Skeleton } from '@/components/common';
import { formatDate, capitalize } from '@/utils';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'paused', label: 'Paused' },
];
const statusVariant = { open: 'success', draft: 'default', closed: 'error', paused: 'warning', archived: 'default' };

const AdminJobs = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'jobs', { search, status: statusFilter }],
    queryFn: () => AdminService.getJobs({ search, status: statusFilter, limit: 20 }),
  });

  const jobs = data?.data || [];

  if (isLoading) return <Skeleton.Table rows={5} />;

  return (
    <div className="page-enter">
      <PageHeader title="Jobs" subtitle="Monitor all job postings" />
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search..." className="flex-1 max-w-sm" />
        <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="All Status" className="w-full sm:w-40" />
      </div>
      <Card padding="none">
        {jobs.length === 0 ? (
          <EmptyState icon={HiBriefcase} title="No jobs found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Title</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Company</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Type</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Apps</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Posted</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-text">{job.title}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{job.company?.name || '-'}</td>
                    <td className="px-4 py-3 text-xs text-text-secondary">{capitalize(job.type)}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant[job.status]} dot>{job.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-text">{job.totalApplications}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{formatDate(job.createdAt)}</td>
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

export default AdminJobs;
