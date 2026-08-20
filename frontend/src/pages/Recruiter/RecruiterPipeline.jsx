import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiArrowRight } from 'react-icons/hi2';
import api from '@/services/api';
import { PageHeader, Card, Select, Badge, Avatar, Loader } from '@/components/common';
import { capitalize } from '@/utils';
import toast from 'react-hot-toast';

const stages = [
  { key: 'applied', label: 'Applied', color: 'border-info' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'border-primary' },
  { key: 'interview', label: 'Interview', color: 'border-warning' },
  { key: 'offered', label: 'Offered', color: 'border-success' },
  { key: 'rejected', label: 'Rejected', color: 'border-error' },
];

const RecruiterPipeline = () => {
  const [jobFilter, setJobFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: jobsData } = useQuery({
    queryKey: ['pipeline', 'jobs'],
    queryFn: () => api.get('/pipeline/jobs'),
  });

  const { data: pipelineData, isLoading } = useQuery({
    queryKey: ['pipeline', { jobId: jobFilter }],
    queryFn: () => api.get('/pipeline', { params: jobFilter ? { jobId: jobFilter } : {} }),
  });

  const moveMutation = useMutation({
    mutationFn: ({ appId, status }) => api.put(`/pipeline/${appId}/move`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter'] });
      toast.success('Application moved');
    },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const jobs = jobsData?.data?.jobs || [];
  const pipeline = pipelineData?.data?.pipeline || {};

  const jobOptions = jobs.map((j) => ({ value: j._id, label: `${j.title} (${j.totalApplications})` }));

  const getNextStage = (current) => {
    const order = ['applied', 'shortlisted', 'interview', 'offered'];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Application Pipeline" subtitle="Manage candidates through hiring stages" />

      <div className="mb-6">
        <Select
          options={jobOptions}
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          placeholder="All Jobs"
          className="w-full sm:w-72"
        />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.key} className="flex flex-col">
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-3 pb-2 border-b-2 ${stage.color}`}>
              <h3 className="text-sm font-semibold text-text">{stage.label}</h3>
              <span className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded-full">
                {(pipeline[stage.key] || []).length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 min-h-[200px]">
              {(pipeline[stage.key] || []).length === 0 ? (
                <p className="text-xs text-text-secondary text-center py-8">No candidates</p>
              ) : (
                (pipeline[stage.key] || []).map((app) => (
                  <Card key={app._id} padding="sm" className="!rounded-[8px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar
                        firstName={app.applicant?.firstName}
                        lastName={app.applicant?.lastName}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text truncate">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </p>
                        <p className="text-xs text-text-secondary truncate">{app.job?.title}</p>
                      </div>
                    </div>

                    {app.aiScore != null && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className={`h-full rounded-full ${app.aiScore >= 70 ? 'bg-success' : app.aiScore >= 40 ? 'bg-warning' : 'bg-error'}`}
                            style={{ width: `${app.aiScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-text">{app.aiScore}%</span>
                      </div>
                    )}

                    {/* Move buttons */}
                    {stage.key !== 'rejected' && getNextStage(stage.key) && (
                      <button
                        onClick={() => moveMutation.mutate({ appId: app._id, status: getNextStage(stage.key) })}
                        className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:bg-primary/10 rounded-[6px] py-1.5 transition-colors"
                      >
                        <span>{capitalize(getNextStage(stage.key))}</span>
                        <HiArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {stage.key !== 'rejected' && stage.key !== 'offered' && (
                      <button
                        onClick={() => moveMutation.mutate({ appId: app._id, status: 'rejected' })}
                        className="w-full text-xs text-error/70 hover:text-error hover:bg-error/10 rounded-[6px] py-1 transition-colors mt-1"
                      >
                        Reject
                      </button>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterPipeline;
