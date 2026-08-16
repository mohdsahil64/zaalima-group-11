import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiEnvelope, HiLockClosed } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { Button, Input } from '@/components/common';
import { APP_NAME } from '@/constants';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await login(data);
      const routes = {
        recruiter: '/recruiter/dashboard',
        applicant: '/applicant/dashboard',
        super_admin: '/admin/dashboard',
      };
      navigate(routes[user.role] || '/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">{APP_NAME[0]}</span>
        </div>
        <span className="text-base font-semibold text-text">{APP_NAME}</span>
      </div>

      <h2 className="text-xl font-semibold text-text tracking-tight">Welcome back</h2>
      <p className="text-[13px] text-text-muted mt-1 mb-6">Sign in to your account to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          icon={HiEnvelope}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
          })}
        />

        <Input
          label="Password"
          type="password"
          icon={HiLockClosed}
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-border bg-surface text-primary accent-primary" />
            <span className="text-xs text-text-muted">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-light transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} size="md">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary hover:text-primary-light transition-colors font-medium">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
