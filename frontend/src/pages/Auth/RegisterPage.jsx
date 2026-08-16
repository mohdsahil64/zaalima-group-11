import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiUser, HiEnvelope, HiLockClosed, HiBuildingOffice2 } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Select } from '@/components/common';
import { APP_NAME } from '@/constants';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await registerUser(data);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/applicant/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">{APP_NAME[0]}</span>
        </div>
        <span className="text-base font-semibold text-text">{APP_NAME}</span>
      </div>

      <h2 className="text-xl font-semibold text-text tracking-tight">Create your account</h2>
      <p className="text-[13px] text-text-muted mt-1 mb-6">Start your recruitment journey</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" icon={HiUser} placeholder="John" error={errors.firstName?.message}
            {...register('firstName', { required: 'Required' })} />
          <Input label="Last Name" placeholder="Doe" error={errors.lastName?.message}
            {...register('lastName', { required: 'Required' })} />
        </div>

        <Input label="Email" type="email" icon={HiEnvelope} placeholder="you@example.com" error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />

        <Input label="Password" type="password" icon={HiLockClosed} placeholder="Min 6 characters" error={errors.password?.message}
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />

        <Select label="I am a" error={errors.role?.message}
          options={[{ value: 'applicant', label: 'Job Seeker' }, { value: 'recruiter', label: 'Recruiter / Employer' }]}
          {...register('role', { required: 'Select your role' })} />

        {selectedRole === 'recruiter' && (
          <Input label="Company Name" icon={HiBuildingOffice2} placeholder="Your company" error={errors.companyName?.message}
            {...register('companyName', { required: selectedRole === 'recruiter' ? 'Company name is required' : false })} />
        )}

        <Button type="submit" fullWidth loading={loading}>Create Account</Button>
      </form>

      <p className="mt-6 text-center text-xs text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-light transition-colors font-medium">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
