import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import UserService from '@/services/user.service';
import { Card, PageHeader, Input, Button } from '@/components/common';
import toast from 'react-hot-toast';

const ApplicantSettings = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const changePwMutation = useMutation({
    mutationFn: (data) => UserService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
      reset();
    },
    onError: (err) => toast.error(err.message || 'Failed to change password'),
  });

  const onSubmit = (data) => changePwMutation.mutate(data);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">Change Password</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: 'Required' })}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Min 6 characters"
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'Required',
              minLength: { value: 6, message: 'Min 6 characters' },
            })}
          />
          <Button type="submit" loading={changePwMutation.isPending}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ApplicantSettings;
