import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiEnvelope, HiArrowLeft } from 'react-icons/hi2';
import AuthService from '@/services/auth.service';
import { Button, Input } from '@/components/common';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await AuthService.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Password reset instructions sent');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-success/20 mx-auto mb-4 flex items-center justify-center">
          <HiEnvelope className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text mb-2">Check your email</h2>
        <p className="text-text-secondary mb-6">
          We&apos;ve sent password reset instructions to your email address.
        </p>
        <Link to="/login">
          <Button variant="secondary" icon={HiArrowLeft}>
            Back to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-2">Forgot password?</h2>
      <p className="text-text-secondary mb-8">
        Enter your email and we&apos;ll send you reset instructions.
      </p>

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

        <Button type="submit" fullWidth loading={loading}>
          Send Reset Instructions
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link to="/login" className="text-primary hover:text-primary-light transition-colors font-medium inline-flex items-center gap-1">
          <HiArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
