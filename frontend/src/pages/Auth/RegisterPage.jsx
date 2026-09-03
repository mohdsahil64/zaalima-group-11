import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  HiUser, HiEnvelope, HiLockClosed, HiBuildingOffice2,
  HiPhone, HiMapPin, HiGlobeAlt, HiEye, HiEyeSlash,
  HiArrowRight, HiArrowLeft, HiCheckCircle,
  HiBriefcase, HiMagnifyingGlass, HiIdentification,
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { APP_NAME } from '@/constants';
import toast from 'react-hot-toast';

/* ─── Step config ─── */
const APPLICANT_STEPS = ['Role', 'Personal Info', 'Professional', 'Password'];
const RECRUITER_STEPS = ['Role', 'Personal Info', 'Company Details', 'Password'];

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Education',
  'E-Commerce & Retail', 'Manufacturing', 'Consulting', 'Media & Entertainment',
  'Real Estate', 'Logistics & Supply Chain', 'Telecom', 'Other',
];
const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '501–1000', '1000+'];
const EXPERIENCE_LEVELS = ['Entry Level (0–1 yr)', 'Junior (1–3 yrs)', 'Mid Level (3–5 yrs)', 'Senior (5–8 yrs)', 'Lead / Manager (8+ yrs)', 'Executive / C-Level'];

const RegisterPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm();
  const role = watch('role');
  const password = watch('password');
  const STEPS = role === 'recruiter' ? RECRUITER_STEPS : APPLICANT_STEPS;

  const goNext = async () => {
    let fields = [];
    if (step === 0) fields = ['role'];
    if (step === 1) fields = ['firstName', 'lastName', 'email', 'phone'];
    if (step === 2 && role === 'recruiter')  fields = ['companyName', 'companyEmail', 'industry', 'companySize', 'companyLocation'];
    if (step === 2 && role === 'applicant')  fields = ['jobTitle', 'experienceLevel'];
    const ok = await trigger(fields);
    if (ok) setStep(s => s + 1);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await registerUser(data);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/applicant/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text tracking-tight mb-1">
          {step === 0 && 'Create your account'}
          {step === 1 && 'Personal Information'}
          {step === 2 && role === 'recruiter' && 'Company Details'}
          {step === 2 && role === 'applicant' && 'Professional Background'}
          {step === 3 && 'Set your Password'}
        </h2>
        <p className="text-xs text-text-secondary">
          {step === 0 && `Join ${APP_NAME} — choose how you want to use the platform`}
          {step === 1 && 'Fill in your basic contact information'}
          {step === 2 && role === 'recruiter' && 'Provide your company details for verification'}
          {step === 2 && role === 'applicant' && 'Help us match you with the right jobs'}
          {step === 3 && 'Create a strong password to protect your account'}
        </p>
      </div>

      {/* Step progress */}
      {role && (
        <div className="flex items-center gap-1 mb-6">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${done ? 'bg-success text-white' : active ? 'bg-primary text-white shadow-glow-sm' : 'bg-surface-elevated text-text-muted border border-border'}`}>
                    {done ? <HiCheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap ${active ? 'text-primary' : done ? 'text-success' : 'text-text-muted'}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mb-4 transition-all ${done ? 'bg-success' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── STEP 0: Role Selection ── */}
        {step === 0 && (
          <div className="space-y-3 animate-fade-up">
            {[
              {
                value: 'applicant',
                icon: HiMagnifyingGlass,
                title: 'Job Seeker / Applicant',
                desc: 'Browse jobs, upload resume, track applications, get AI match scores',
                color: 'text-info', bg: 'bg-info/10', border: 'border-info/30',
                badge: 'Free Forever',
              },
              {
                value: 'recruiter',
                icon: HiBriefcase,
                title: 'Recruiter / Employer',
                desc: 'Post jobs, review candidates, manage hiring pipeline, AI-powered screening',
                color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30',
                badge: 'Company Required',
              },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('role', opt.value)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${role === opt.value ? `${opt.border} bg-surface-elevated shadow-glow-sm` : 'border-border bg-surface hover:border-border-light hover:bg-surface-elevated'}`}
              >
                <div className={`w-9 h-9 rounded-lg ${opt.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <opt.icon className={`w-4 h-4 ${opt.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-text">{opt.title}</p>
                    {role === opt.value && <HiCheckCircle className={`w-4 h-4 ${opt.color} shrink-0`} />}
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">{opt.desc}</p>
                  <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${opt.bg} border ${opt.border} ${opt.color}`}>{opt.badge}</span>
                </div>
              </button>
            ))}
            <input type="hidden" {...register('role', { required: 'Select a role' })} />
            {errors.role && <p className="text-[11px] text-error">⚠ {errors.role.message}</p>}
          </div>
        )}

        {/* ── STEP 1: Personal Info (same for both roles) ── */}
        {step === 1 && (
          <div className="space-y-3 animate-fade-up">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">First Name <span className="text-error">*</span></label>
                <div className="relative">
                  <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                  <input placeholder="John" className={`input-base pl-9 ${errors.firstName ? 'error' : ''}`}
                    {...register('firstName', { required: 'Required' })} />
                </div>
                {errors.firstName && <p className="mt-1 text-[11px] text-error">⚠ {errors.firstName.message}</p>}
              </div>
              <div>
                <label className="form-label">Last Name <span className="text-error">*</span></label>
                <input placeholder="Doe" className={`input-base ${errors.lastName ? 'error' : ''}`}
                  {...register('lastName', { required: 'Required' })} />
                {errors.lastName && <p className="mt-1 text-[11px] text-error">⚠ {errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">Email Address <span className="text-error">*</span></label>
              <div className="relative">
                <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input type="email" placeholder={role === 'recruiter' ? 'you@company.com' : 'you@email.com'}
                  className={`input-base pl-9 ${errors.email ? 'error' : ''}`}
                  {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-error">⚠ {errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Phone Number <span className="text-error">*</span></label>
              <div className="relative">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input type="tel" placeholder="+92 300 0000000"
                  className={`input-base pl-9 ${errors.phone ? 'error' : ''}`}
                  {...register('phone', { required: 'Phone is required' })} />
              </div>
              {errors.phone && <p className="mt-1 text-[11px] text-error">⚠ {errors.phone.message}</p>}
            </div>

            <div>
              <label className="form-label">Country / City</label>
              <div className="relative">
                <HiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input placeholder="Karachi, Pakistan" className="input-base pl-9" {...register('location')} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2A: Recruiter — Company Details ── */}
        {step === 2 && role === 'recruiter' && (
          <div className="space-y-3 animate-fade-up">
            {/* Notice */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/8 border border-warning/20">
              <HiIdentification className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-warning">Company Verification Required</p>
                <p className="text-[11px] text-text-muted mt-0.5">Your company will be reviewed by our admin team before you can post jobs. Only real businesses should register here.</p>
              </div>
            </div>

            <div>
              <label className="form-label">Legal Company Name <span className="text-error">*</span></label>
              <div className="relative">
                <HiBuildingOffice2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input placeholder="Acme Corporation Pvt. Ltd."
                  className={`input-base pl-9 ${errors.companyName ? 'error' : ''}`}
                  {...register('companyName', { required: 'Company name is required', minLength: { value: 3, message: 'Min 3 characters' } })} />
              </div>
              {errors.companyName && <p className="mt-1 text-[11px] text-error">⚠ {errors.companyName.message}</p>}
              <p className="text-[10px] text-text-muted mt-1">⚠ Cannot be changed after admin approval</p>
            </div>

            <div>
              <label className="form-label">Official Company Email <span className="text-error">*</span></label>
              <div className="relative">
                <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input type="email" placeholder="hr@acmecorp.com"
                  className={`input-base pl-9 ${errors.companyEmail ? 'error' : ''}`}
                  {...register('companyEmail', {
                    required: 'Company email required',
                    pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Must be a business email' },
                    validate: v => !v.includes('@gmail') && !v.includes('@yahoo') && !v.includes('@hotmail')
                      ? true : 'Use a business email, not personal (Gmail/Yahoo not allowed)',
                  })} />
              </div>
              {errors.companyEmail && <p className="mt-1 text-[11px] text-error">⚠ {errors.companyEmail.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Industry <span className="text-error">*</span></label>
                <select className={`input-base ${errors.industry ? 'error' : ''}`}
                  {...register('industry', { required: 'Select industry' })}>
                  <option value="">Select…</option>
                  {INDUSTRIES.map(i => <option key={i} value={i.toLowerCase()}>{i}</option>)}
                </select>
                {errors.industry && <p className="mt-1 text-[11px] text-error">⚠ {errors.industry.message}</p>}
              </div>
              <div>
                <label className="form-label">Company Size <span className="text-error">*</span></label>
                <select className={`input-base ${errors.companySize ? 'error' : ''}`}
                  {...register('companySize', { required: 'Select size' })}>
                  <option value="">Select…</option>
                  {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                </select>
                {errors.companySize && <p className="mt-1 text-[11px] text-error">⚠ {errors.companySize.message}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">Company Headquarters <span className="text-error">*</span></label>
              <div className="relative">
                <HiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input placeholder="Karachi, Pakistan"
                  className={`input-base pl-9 ${errors.companyLocation ? 'error' : ''}`}
                  {...register('companyLocation', { required: 'Location required' })} />
              </div>
              {errors.companyLocation && <p className="mt-1 text-[11px] text-error">⚠ {errors.companyLocation.message}</p>}
            </div>

            <div>
              <label className="form-label">Company Website</label>
              <div className="relative">
                <HiGlobeAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input placeholder="https://acmecorp.com" className="input-base pl-9" {...register('companyWebsite')} />
              </div>
            </div>

            <div>
              <label className="form-label">Your Job Title at this Company <span className="text-error">*</span></label>
              <div className="relative">
                <HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input placeholder="e.g. HR Manager, Talent Acquisition Lead"
                  className={`input-base pl-9 ${errors.recruiterTitle ? 'error' : ''}`}
                  {...register('recruiterTitle', { required: 'Your job title is required' })} />
              </div>
              {errors.recruiterTitle && <p className="mt-1 text-[11px] text-error">⚠ {errors.recruiterTitle.message}</p>}
            </div>
          </div>
        )}

        {/* ── STEP 2B: Applicant — Professional Background ── */}
        {step === 2 && role === 'applicant' && (
          <div className="space-y-3 animate-fade-up">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-info/8 border border-info/20">
              <HiBriefcase className="w-4 h-4 text-info shrink-0 mt-0.5" />
              <p className="text-[11px] text-text-muted leading-relaxed">
                This helps us show you relevant jobs and calculate your match score. You can update this anytime in your profile.
              </p>
            </div>

            <div>
              <label className="form-label">Current / Desired Job Title <span className="text-error">*</span></label>
              <div className="relative">
                <HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input placeholder="e.g. Frontend Developer, Product Manager"
                  className={`input-base pl-9 ${errors.jobTitle ? 'error' : ''}`}
                  {...register('jobTitle', { required: 'Job title is required' })} />
              </div>
              {errors.jobTitle && <p className="mt-1 text-[11px] text-error">⚠ {errors.jobTitle.message}</p>}
            </div>

            <div>
              <label className="form-label">Experience Level <span className="text-error">*</span></label>
              <select className={`input-base ${errors.experienceLevel ? 'error' : ''}`}
                {...register('experienceLevel', { required: 'Select experience level' })}>
                <option value="">Select your level…</option>
                {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              {errors.experienceLevel && <p className="mt-1 text-[11px] text-error">⚠ {errors.experienceLevel.message}</p>}
            </div>

            <div>
              <label className="form-label">Primary Skills</label>
              <input placeholder="e.g. React, Python, Project Management (comma separated)"
                className="input-base" {...register('skillsRaw')} />
              <p className="text-[10px] text-text-muted mt-1">Separate skills with commas — you can add more later</p>
            </div>

            <div>
              <label className="form-label">LinkedIn Profile</label>
              <div className="relative">
                <HiGlobeAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input placeholder="linkedin.com/in/yourname" className="input-base pl-9" {...register('linkedin')} />
              </div>
            </div>

            <div>
              <label className="form-label">Portfolio / GitHub</label>
              <div className="relative">
                <HiGlobeAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input placeholder="github.com/yourusername or yoursite.com" className="input-base pl-9" {...register('portfolio')} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Password ── */}
        {step === 3 && (
          <div className="space-y-3 animate-fade-up">
            <div>
              <label className="form-label">Password <span className="text-error">*</span></label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                  className={`input-base pl-9 pr-9 ${errors.password ? 'error' : ''}`}
                  {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
                  {showPw ? <HiEyeSlash className="w-3.5 h-3.5" /> : <HiEye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {password && (
                <div className="flex gap-1 mt-1.5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${password.length < 4 ? (i<=1?'bg-error':'bg-border') : password.length < 6 ? (i<=2?'bg-warning':'bg-border') : password.length < 10 ? (i<=3?'bg-info':'bg-border') : 'bg-success'}`} />
                  ))}
                </div>
              )}
              {errors.password && <p className="mt-1 text-[11px] text-error">⚠ {errors.password.message}</p>}
            </div>

            <div>
              <label className="form-label">Confirm Password <span className="text-error">*</span></label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password"
                  className={`input-base pl-9 pr-9 ${errors.confirmPassword ? 'error' : ''}`}
                  {...register('confirmPassword', { required: 'Required', validate: v => v === password || 'Passwords do not match' })} />
                <button type="button" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
                  {showConfirm ? <HiEyeSlash className="w-3.5 h-3.5" /> : <HiEye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-[11px] text-error">⚠ {errors.confirmPassword.message}</p>}
            </div>

            {/* Summary box */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Registration Summary</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Role',    value: role === 'recruiter' ? 'Recruiter / Employer' : 'Job Seeker' },
                  { label: 'Name',    value: `${watch('firstName') || ''} ${watch('lastName') || ''}`.trim() },
                  { label: 'Email',   value: watch('email') },
                  ...(role === 'recruiter' ? [{ label: 'Company', value: watch('companyName') }] : []),
                  ...(role === 'applicant' ? [{ label: 'Job Title', value: watch('jobTitle') }] : []),
                ].map(item => item.value ? (
                  <div key={item.label} className="flex items-center gap-2">
                    <HiCheckCircle className="w-3 h-3 text-success shrink-0" />
                    <span className="text-[11px] text-text-muted">{item.label}:</span>
                    <span className="text-[11px] text-text font-medium truncate">{item.value}</span>
                  </div>
                ) : null)}
              </div>
            </div>

            <p className="text-[11px] text-text-muted">
              By registering you agree to our{' '}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{' '}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className={`flex gap-3 mt-5 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <button type="button" onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-xs font-medium text-text-secondary hover:text-text hover:bg-surface-elevated transition-all">
              <HiArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          {step < (STEPS.length - 1) ? (
            <button type="button" onClick={goNext}
              disabled={step === 0 && !role}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-glow-sm hover:opacity-90 disabled:opacity-50 transition-all ml-auto">
              Continue <HiArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-glow-sm hover:opacity-90 disabled:opacity-60 transition-all ml-auto">
              {loading ? (
                <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account…</>
              ) : (
                <>{role === 'recruiter' ? '🏢 Register Company' : '🚀 Create Account'}<HiArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}
        </div>
      </form>

      <p className="mt-5 text-center text-xs text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition-colors animated-underline">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
