import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash, HiArrowRight } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { APP_NAME } from '@/constants';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text tracking-tight mb-1.5">Welcome back 👋</h2>
        <p className="text-sm text-text-secondary">
          Sign in to continue to{' '}
          <span className="text-primary font-medium">{APP_NAME}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label className="form-label">Email address</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <HiEnvelope className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              className={`input-base pl-10 ${errors.email ? 'error' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' },
              })}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-error flex items-center gap-1">
              <span>⚠</span> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="form-label !mb-0">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:text-primary-light transition-colors font-medium animated-underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <HiLockClosed className="w-4 h-4" />
            </div>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`input-base pl-10 pr-11 ${errors.password ? 'error' : ''}`}
              {...register('password', {
                required: 'Password is required',
              })}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              tabIndex={-1}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-error flex items-center gap-1">
              <span>⚠</span> {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded bg-surface-elevated border-border accent-primary cursor-pointer"
          />
          <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer select-none">
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-primary hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-glow disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <HiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 section-divider" />
        <span className="text-xs text-text-muted px-2">or continue with</span>
        <div className="flex-1 section-divider" />
      </div>

      {/* Demo accounts */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Recruiter Demo', role: 'recruiter', color: 'text-primary border-primary/20 hover:border-primary/40 hover:bg-primary/5' },
          { label: 'Applicant Demo', role: 'applicant', color: 'text-success border-success/20 hover:border-success/40 hover:bg-success/5' },
        ].map((demo) => (
          <button
            key={demo.role}
            type="button"
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-medium transition-all ${demo.color}`}
            onClick={() => {
              const creds = {
                recruiter: { email: 'recruiter@demo.com', password: 'demo123' },
                applicant: { email: 'applicant@demo.com', password: 'demo123' },
              };
              const { email, password } = creds[demo.role];
              login({ email, password })
                .then((u) => {
                  const routes = { recruiter: '/recruiter/dashboard', applicant: '/applicant/dashboard' };
                  navigate(routes[u.role] || '/');
                })
                .catch((e) => toast.error(e.message));
            }}
          >
            {demo.label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="text-primary hover:text-primary-light transition-colors font-semibold animated-underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
