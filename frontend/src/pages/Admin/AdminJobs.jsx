import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiBriefcase } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, SearchBox, Select, EmptyState, Badge, Loader } from '@/components/common';
import { formatDate, capitalize } from '@/utils';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
];

const statusVariant = {
  open: 'success',
  draft: 'default',
  closed: 'error',
  paused: 'warning',
  archived: 'default',
};

const AdminJobs = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'jobs', { search, status: statusFilter }],
    queryFn: () => AdminService.getJobs({ search, status: statusFilter, limit: 20 }),
  });

  const jobs = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Jobs" subtitle="Monitor all job postings across the platform" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox value={search} onChange={setSearch} placeholder="Search jobs..." className="flex-1 max-w-md" />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Status"
          className="w-full sm:w-48"
        />
      </div>

      <Card padding="none">
        {jobs.length === 0 ? (
          <EmptyState icon={HiBriefcase} title="No jobs found" description="Jobs will appear here once recruiters post them." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Applications</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm font-medium text-text">{job.title}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{job.company?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{capitalize(job.type)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[job.status] || 'default'}>{job.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text">{job.totalApplications}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatDate(job.createdAt)}</td>
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
