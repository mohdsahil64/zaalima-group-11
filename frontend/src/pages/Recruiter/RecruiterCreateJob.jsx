import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiArrowLeft } from 'react-icons/hi2';
import JobService from '@/services/job.service';
import { Card, PageHeader, Input, Textarea, Select, Button } from '@/components/common';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';
import toast from 'react-hot-toast';

const RecruiterCreateJob = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { status: 'draft' },
  });

  const createMutation = useMutation({
    mutationFn: (data) => JobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'jobs'] });
      toast.success('Job created successfully');
      navigate('/recruiter/jobs');
    },
    onError: (err) => toast.error(err.message || 'Failed to create job'),
  });

  const onSubmit = (data) => {
    // Process skills and requirements from comma-separated strings
    const processed = {
      ...data,
      skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      requirements: data.requirements ? data.requirements.split(',').map(s => s.trim()).filter(Boolean) : [],
      salary: {
        min: data.salaryMin ? Number(data.salaryMin) : null,
        max: data.salaryMax ? Number(data.salaryMax) : null,
      },
    };
    delete processed.salaryMin;
    delete processed.salaryMax;
    createMutation.mutate(processed);
  };

  return (
    <div>
      <PageHeader
        title="Create Job"
        subtitle="Post a new job opening"
        actions={
          <Link to="/recruiter/jobs">
            <Button variant="ghost" icon={HiArrowLeft}>Back to Jobs</Button>
          </Link>
        }
      />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Job Title"
            placeholder="e.g. Senior Frontend Developer"
            error={errors.title?.message}
            {...register('title', { required: 'Job title is required' })}
          />

          <Textarea
            label="Description"
            placeholder="Describe the role, responsibilities, and expectations..."
            rows={5}
            error={errors.description?.message}
            {...register('description', { required: 'Description is required' })}
          />

          <Textarea
            label="Responsibilities"
            placeholder="Key responsibilities for this role..."
            rows={4}
            {...register('responsibilities')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Location"
              placeholder="e.g. San Francisco, CA or Remote"
              error={errors.location?.message}
              {...register('location', { required: 'Location is required' })}
            />
            <Select
              label="Employment Type"
              options={JOB_TYPES}
              placeholder="Select type"
              error={errors.type?.message}
              {...register('type', { required: 'Employment type is required' })}
            />
            <Select
              label="Experience Level"
              options={EXPERIENCE_LEVELS}
              placeholder="Select level"
              {...register('experience')}
            />
            <Input
              label="Education"
              placeholder="e.g. Bachelor's in Computer Science"
              {...register('education')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Salary Range (USD)</label>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Min (e.g. 80000)" type="number" {...register('salaryMin')} />
              <Input placeholder="Max (e.g. 120000)" type="number" {...register('salaryMax')} />
            </div>
          </div>

          <Textarea
            label="Required Skills"
            placeholder="Enter skills separated by commas (e.g. React, Node.js, TypeScript)"
            rows={2}
            {...register('skills')}
          />

          <Textarea
            label="Requirements"
            placeholder="Enter requirements separated by commas"
            rows={3}
            {...register('requirements')}
          />

          <Select
            label="Status"
            options={[
              { value: 'draft', label: 'Save as Draft' },
              { value: 'open', label: 'Publish Immediately' },
            ]}
            {...register('status')}
          />

          <div className="flex justify-end gap-3">
            <Link to="/recruiter/jobs">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
            <Button type="submit" loading={createMutation.isPending}>
              Create Job
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterCreateJob;
