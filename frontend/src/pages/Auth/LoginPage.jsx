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
      <div className="flex items-center gap-2.5 mb-10 lg:hidden">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold text-lg">{APP_NAME[0]}</span>
        </div>
        <span className="text-lg font-bold text-text">{APP_NAME}</span>
      </div>

      <h2 className="text-2xl font-bold text-text mb-1">Welcome back</h2>
      <p className="text-sm text-text-secondary mb-8">Sign in to your account to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-border bg-surface-elevated text-primary accent-primary" />
            <span className="text-sm text-text-secondary">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-light transition-colors font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg">
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary hover:text-primary-light transition-colors font-medium">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
