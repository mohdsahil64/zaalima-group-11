import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import CompanyService from '@/services/company.service';
import { Card, PageHeader, Input, Textarea, Select, Button, Badge, Loader } from '@/components/common';
import { COMPANY_SIZES } from '@/constants';
import toast from 'react-hot-toast';

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' },
];

const statusVariant = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  suspended: 'default',
};

const RecruiterCompany = () => {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['recruiter', 'company'],
    queryFn: CompanyService.getMyCompany,
  });

  const company = data?.data?.company;

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: company ? {
      name: company.name || '',
      email: company.email || '',
      website: company.website || '',
      industry: company.industry || '',
      size: company.size || '',
      location: company.location || '',
      description: company.description || '',
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => CompanyService.updateMyCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'company'] });
      toast.success('Company profile updated');
      setEditing(false);
    },
    onError: (err) => toast.error(err.message || 'Failed to update'),
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Company Profile"
        subtitle="Manage your company information"
        actions={
          company && (
            <Badge variant={statusVariant[company.status]} size="lg">
              {company.status === 'pending' ? 'Pending Approval' : company.status}
            </Badge>
          )
        }
      />

      {company?.status === 'pending' && (
        <Card className="mb-6 border-warning/30 bg-warning/5">
          <p className="text-sm text-warning">
            Your company is pending admin approval. You won&apos;t be able to publish jobs until approved.
          </p>
        </Card>
      )}

      {company?.status === 'rejected' && (
        <Card className="mb-6 border-error/30 bg-error/5">
          <p className="text-sm text-error">
            Your company registration was rejected. {company.rejectionReason && `Reason: ${company.rejectionReason}`}
          </p>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text">Company Details</h3>
          {!editing && (
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Company Name"
              placeholder="Enter company name"
              disabled={!editing}
              error={errors.name?.message}
              {...register('name', { required: 'Company name is required' })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="company@example.com"
              disabled={!editing}
              {...register('email')}
            />
            <Input
              label="Website"
              placeholder="https://company.com"
              disabled={!editing}
              {...register('website')}
            />
            <Select
              label="Industry"
              options={industryOptions}
              placeholder="Select industry"
              disabled={!editing}
              {...register('industry')}
            />
            <Select
              label="Company Size"
              options={COMPANY_SIZES}
              placeholder="Select size"
              disabled={!editing}
              {...register('size')}
            />
            <Input
              label="Location"
              placeholder="City, Country"
              disabled={!editing}
              {...register('location')}
            />
          </div>
          <Textarea
            label="Description"
            placeholder="Tell us about your company..."
            rows={4}
            disabled={!editing}
            {...register('description')}
          />
          {editing && (
            <div className="flex justify-end gap-3">
              <Button variant="secondary" type="button" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={updateMutation.isPending}>
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default RecruiterCompany;
