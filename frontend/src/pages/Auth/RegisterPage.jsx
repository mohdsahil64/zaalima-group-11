import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiUser, HiEnvelope, HiLockClosed } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Select } from '@/components/common';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await registerUser(data);
      const routes = {
        recruiter: '/recruiter/dashboard',
        applicant: '/applicant/dashboard',
      };
      navigate(routes[user.role] || '/');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-2">Create your account</h2>
      <p className="text-text-secondary mb-8">Start your recruitment journey today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            icon={HiUser}
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName', { required: 'First name is required' })}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName', { required: 'Last name is required' })}
          />
        </div>

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
          placeholder="Min 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <Select
          label="I am a"
          error={errors.role?.message}
          options={[
            { value: 'applicant', label: 'Job Seeker' },
            { value: 'recruiter', label: 'Recruiter / Employer' },
          ]}
          {...register('role', { required: 'Please select your role' })}
        />

        <Button type="submit" fullWidth loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-light transition-colors font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
