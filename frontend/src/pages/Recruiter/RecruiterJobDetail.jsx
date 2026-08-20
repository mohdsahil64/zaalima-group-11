import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiArrowLeft } from 'react-icons/hi2';
import JobService from '@/services/job.service';
import { Card, PageHeader, Input, Textarea, Select, Button, Loader } from '@/components/common';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';
import toast from 'react-hot-toast';

const RecruiterJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => JobService.getJob(id),
  });

  const job = data?.data?.job;

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: job ? {
      title: job.title,
      description: job.description,
      responsibilities: job.responsibilities || '',
      location: job.location,
      type: job.type,
      experience: job.experience,
      education: job.education || '',
      salaryMin: job.salary?.min || '',
      salaryMax: job.salary?.max || '',
      skills: job.skills?.join(', ') || '',
      requirements: job.requirements?.join(', ') || '',
      status: job.status,
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => JobService.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'jobs'] });
      toast.success('Job updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update'),
  });

  const onSubmit = (data) => {
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
    updateMutation.mutate(processed);
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Edit Job"
        subtitle={job?.title}
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
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <Textarea
            label="Description"
            rows={5}
            error={errors.description?.message}
            {...register('description', { required: 'Description is required' })}
          />
          <Textarea label="Responsibilities" rows={4} {...register('responsibilities')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Location"
              error={errors.location?.message}
              {...register('location', { required: 'Location is required' })}
            />
            <Select
              label="Employment Type"
              options={JOB_TYPES}
              error={errors.type?.message}
              {...register('type', { required: 'Type is required' })}
            />
            <Select label="Experience Level" options={EXPERIENCE_LEVELS} {...register('experience')} />
            <Input label="Education" {...register('education')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Salary Range (USD)</label>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Min" type="number" {...register('salaryMin')} />
              <Input placeholder="Max" type="number" {...register('salaryMax')} />
            </div>
          </div>

          <Textarea label="Skills (comma-separated)" rows={2} {...register('skills')} />
          <Textarea label="Requirements (comma-separated)" rows={3} {...register('requirements')} />

          <Select
            label="Status"
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'open', label: 'Open (Published)' },
              { value: 'paused', label: 'Paused' },
              { value: 'closed', label: 'Closed' },
              { value: 'archived', label: 'Archived' },
            ]}
            {...register('status')}
          />

          <div className="flex justify-end gap-3">
            <Link to="/recruiter/jobs">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
            <Button type="submit" loading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterJobDetail;
