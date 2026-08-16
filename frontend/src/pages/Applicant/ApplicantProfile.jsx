import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/services/user.service';
import { Card, PageHeader, Input, Textarea, Button, Avatar } from '@/components/common';
import toast from 'react-hot-toast';

const ApplicantProfile = () => {
  const { user, loadUser } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => UserService.updateProfile(data),
    onSuccess: () => {
      loadUser();
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update'),
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information" />

      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <Avatar src={user?.avatar} firstName={user?.firstName} lastName={user?.lastName} size="xl" />
            <div>
              <h2 className="text-xl font-semibold text-text">{user?.firstName} {user?.lastName}</h2>
              <p className="text-text-secondary">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="First Name"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'Required' })}
              />
              <Input
                label="Last Name"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Required' })}
              />
              <Input label="Phone" placeholder="+1 (555) 000-0000" {...register('phone')} />
              <Input label="Email" value={user?.email} disabled />
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={updateMutation.isPending}>Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantProfile;
