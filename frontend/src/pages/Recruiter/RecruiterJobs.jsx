import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiBriefcase, HiPlus, HiTrash } from 'react-icons/hi2';
import JobService from '@/services/job.service';
import { PageHeader, Card, SearchBox, Select, EmptyState, Badge, Button, Loader } from '@/components/common';
import { JOB_STATUS } from '@/constants';
import { formatDate, capitalize } from '@/utils';
import toast from 'react-hot-toast';

const statusVariant = { open: 'success', draft: 'default', closed: 'error', paused: 'warning', archived: 'default' };

const RecruiterJobs = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['recruiter', 'jobs', { search, status: statusFilter }],
    queryFn: () => JobService.getMyJobs({ search, status: statusFilter, limit: 20 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => JobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'jobs'] });
      toast.success('Job deleted');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete'),
  });

  const jobs = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Manage your job postings"
        actions={
          <Link to="/recruiter/jobs/create">
            <Button icon={HiPlus}>Create Job</Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox value={search} onChange={setSearch} placeholder="Search jobs..." className="flex-1 max-w-md" />
        <Select
          options={[...JOB_STATUS, { value: 'archived', label: 'Archived' }]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Status"
          className="w-full sm:w-48"
        />
      </div>

      <Card padding="none">
        {jobs.length === 0 ? (
          <EmptyState
            icon={HiBriefcase}
            title="No jobs yet"
            description="Create your first job posting to start receiving applications."
            action={<Link to="/recruiter/jobs/create"><Button icon={HiPlus} size="sm">Create Job</Button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Applications</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Posted</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <Link to={`/recruiter/jobs/${job._id}`} className="text-sm font-medium text-text hover:text-primary">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{capitalize(job.type)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text">{job.totalApplications}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatDate(job.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/recruiter/jobs/${job._id}`}>
                          <Button size="sm" variant="ghost">Edit</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-error hover:text-error"
                          onClick={() => {
                            if (confirm('Delete this job?')) deleteMutation.mutate(job._id);
                          }}
                        >
                          <HiTrash className="w-4 h-4" />
                        </Button>
                      </div>
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

export default RecruiterJobs;
