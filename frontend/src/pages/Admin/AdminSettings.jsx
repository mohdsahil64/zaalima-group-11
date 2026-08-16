import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/services/user.service';
import { Card, PageHeader, Input, Button } from '@/components/common';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { user } = useAuth();
  const [changingPassword, setChangingPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onChangePassword = async (data) => {
    try {
      setChangingPassword(true);
      await UserService.changePassword(data);
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <PageHeader title="Admin Settings" subtitle="Account & security settings" />

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
              <p className="text-text">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <p className="text-text">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Role</label>
              <p className="text-text capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Change Password</h3>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              error={errors.currentPassword?.message}
              {...register('currentPassword', { required: 'Current password is required' })}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min 6 characters"
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <Button type="submit" loading={changingPassword}>
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
