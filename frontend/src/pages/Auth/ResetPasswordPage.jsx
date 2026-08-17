import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiLockClosed } from 'react-icons/hi2';
import AuthService from '@/services/auth.service';
import { Button, Input } from '@/components/common';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await AuthService.resetPassword(token, data.password);
      toast.success('Password reset successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Reset failed. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter">
      <h2 className="text-2xl font-bold text-text mb-1">Reset your password</h2>
      <p className="text-sm text-text-secondary mb-8">Enter your new password below.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="New Password"
          type="password"
          icon={HiLockClosed}
          placeholder="Min 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Min 6 characters' },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          icon={HiLockClosed}
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === watch('password') || 'Passwords do not match',
          })}
        />

        <Button type="submit" fullWidth loading={loading} size="lg">
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
