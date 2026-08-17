import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiEnvelope, HiArrowLeft, HiCheckCircle } from 'react-icons/hi2';
import AuthService from '@/services/auth.service';
import { Button, Input } from '@/components/common';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await AuthService.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Reset instructions sent');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="page-enter text-center">
        <div className="w-14 h-14 rounded-full bg-success/10 border border-success/20 mx-auto mb-5 flex items-center justify-center">
          <HiCheckCircle className="w-7 h-7 text-success" />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">Check your email</h2>
        <p className="text-sm text-text-secondary mb-6">
          We&apos;ve sent password reset instructions to your email address.
        </p>
        <Link to="/login">
          <Button variant="secondary" icon={HiArrowLeft}>Back to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <h2 className="text-2xl font-bold text-text mb-1">Forgot password?</h2>
      <p className="text-sm text-text-secondary mb-8">Enter your email and we&apos;ll send you reset instructions.</p>

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

        <Button type="submit" fullWidth loading={loading} size="lg">
          Send Reset Instructions
        </Button>
      </form>

      <p className="mt-8 text-center">
        <Link to="/login" className="text-sm text-primary hover:text-primary-light transition-colors font-medium inline-flex items-center gap-1.5">
          <HiArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
