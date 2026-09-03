import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheckCircle,
  HiBriefcase,
  HiDocumentText,
  HiCurrencyDollar,
  HiCog6Tooth,
  HiMapPin,
  HiPlus,
  HiXMark,
} from 'react-icons/hi2';
import JobService from '@/services/job.service';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 0, label: 'Basic Info', icon: HiBriefcase, desc: 'Job title, location, type' },
  { id: 1, label: 'Description', icon: HiDocumentText, desc: 'Role details & requirements' },
  { id: 2, label: 'Compensation', icon: HiCurrencyDollar, desc: 'Salary & benefits' },
  { id: 3, label: 'Review', icon: HiCog6Tooth, desc: 'Preview & publish' },
];

const RecruiterCreateJob = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { status: 'open', type: '', experience: '' } });

  const watchAll = watch();

  const createMutation = useMutation({
    mutationFn: (data) => JobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'jobs'] });
      toast.success('🎉 Job posted successfully!');
      navigate('/recruiter/jobs');
    },
    onError: (err) => toast.error(err.message || 'Failed to create job'),
  });

  const addSkill = (val) => {
    const s = val.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput('');
  };

  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s));

  const onSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const goNext = async () => {
    let valid = false;
    if (step === 0) valid = await trigger(['title', 'location', 'type']);
    if (step === 1) valid = await trigger(['description']);
    if (step === 2) valid = true;
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (data) => {
    const requirements = data.requirements
      ? data.requirements.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];
    const processed = {
      ...data,
      skills,
      requirements,
      salary: {
        min: data.salaryMin ? Number(data.salaryMin) : null,
        max: data.salaryMax ? Number(data.salaryMax) : null,
        currency: data.salaryCurrency || 'USD',
      },
    };
    delete processed.salaryMin;
    delete processed.salaryMax;
    delete processed.salaryCurrency;
    createMutation.mutate(processed);
  };

  return (
    <div className="page-enter max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/recruiter/jobs"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors mb-2"
          >
            <HiArrowLeft className="w-3.5 h-3.5" /> Back to Jobs
          </Link>
          <h1 className="text-xl font-bold text-text">Post a New Job</h1>
          <p className="text-sm text-text-secondary mt-0.5">Create a listing to start receiving applications</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex items-start gap-3 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const StepIcon = s.icon;
          const isDone = i < step;
          const isActive = i === step;
          return (
            <div key={s.id} className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? 'bg-success/15 border border-success/30'
                      : isActive
                      ? 'bg-primary/15 border border-primary/30 shadow-glow-sm'
                      : 'bg-surface-elevated border border-border'
                  }`}
                >
                  {isDone ? (
                    <HiCheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <StepIcon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${isActive ? 'text-primary' : isDone ? 'text-success' : 'text-text-muted'}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-text-muted">{s.desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px w-8 mt-[-14px] transition-all duration-500 ${i < step ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Step 0: Basic Info ── */}
        {step === 0 && (
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-5 animate-fade-up">
            <div>
              <label className="form-label">Job Title <span className="text-error">*</span></label>
              <input
                placeholder="e.g. Senior Frontend Developer"
                className={`input-base ${errors.title ? 'error' : ''}`}
                {...register('title', { required: 'Job title is required' })}
              />
              {errors.title && <p className="mt-1.5 text-xs text-error">⚠ {errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Location <span className="text-error">*</span></label>
                <div className="relative">
                  <HiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <input
                    placeholder="e.g. San Francisco or Remote"
                    className={`input-base pl-10 ${errors.location ? 'error' : ''}`}
                    {...register('location', { required: 'Location is required' })}
                  />
                </div>
                {errors.location && <p className="mt-1.5 text-xs text-error">⚠ {errors.location.message}</p>}
              </div>

              <div>
                <label className="form-label">Employment Type <span className="text-error">*</span></label>
                <select
                  className={`input-base ${errors.type ? 'error' : ''}`}
                  {...register('type', { required: 'Select employment type' })}
                >
                  <option value="">Select type…</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {errors.type && <p className="mt-1.5 text-xs text-error">⚠ {errors.type.message}</p>}
              </div>

              <div>
                <label className="form-label">Experience Level</label>
                <select className="input-base" {...register('experience')}>
                  <option value="">Any level</option>
                  {EXPERIENCE_LEVELS.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Education</label>
                <input
                  placeholder="e.g. Bachelor's in CS"
                  className="input-base"
                  {...register('education')}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Description ── */}
        {step === 1 && (
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-5 animate-fade-up">
            <div>
              <label className="form-label">Job Description <span className="text-error">*</span></label>
              <textarea
                rows={5}
                placeholder="Describe the role, responsibilities, team culture, and what makes this a great opportunity…"
                className={`input-base resize-none ${errors.description ? 'error' : ''}`}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p className="mt-1.5 text-xs text-error">⚠ {errors.description.message}</p>}
            </div>

            <div>
              <label className="form-label">Key Responsibilities</label>
              <textarea
                rows={4}
                placeholder="List the main day-to-day responsibilities of this role…"
                className="input-base resize-none"
                {...register('responsibilities')}
              />
            </div>

            <div>
              <label className="form-label">Requirements</label>
              <p className="text-xs text-text-muted mb-2">One requirement per line</p>
              <textarea
                rows={4}
                placeholder={"5+ years of React experience\nStrong TypeScript skills\nExperience with REST APIs"}
                className="input-base resize-none"
                {...register('requirements')}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="form-label">Required Skills</label>
              <p className="text-xs text-text-muted mb-2">Type a skill and press Enter or comma to add</p>
              <div className="input-base flex flex-wrap gap-2 min-h-[44px] !p-2.5 cursor-text" onClick={() => document.getElementById('skill-input').focus()}>
                {skills.map((skill) => (
                  <span key={skill} className="skill-chip gap-1.5">
                    {skill}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                      className="hover:text-error transition-colors"
                    >
                      <HiXMark className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  id="skill-input"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={onSkillKeyDown}
                  onBlur={() => addSkill(skillInput)}
                  placeholder={skills.length === 0 ? 'React, TypeScript, Node.js…' : ''}
                  className="bg-transparent outline-none text-sm text-text placeholder-text-muted min-w-[120px] flex-1"
                />
              </div>
              {skillInput && (
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="mt-1.5 flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors"
                >
                  <HiPlus className="w-3 h-3" /> Add "{skillInput}"
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Step 2: Compensation ── */}
        {step === 2 && (
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-5 animate-fade-up">
            <div>
              <label className="form-label">Salary Range</label>
              <p className="text-xs text-text-muted mb-3">
                Jobs with salary ranges get 35% more applications. This won't be shown to recruiters at other companies.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Min Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                    <input
                      type="number"
                      placeholder="80,000"
                      className="input-base pl-7"
                      {...register('salaryMin')}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Max Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                    <input
                      type="number"
                      placeholder="120,000"
                      className="input-base pl-7"
                      {...register('salaryMax')}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Currency</label>
                  <select className="input-base" {...register('salaryCurrency')}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="PKR">PKR</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Publish Status</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'open', label: 'Publish Now', desc: 'Go live immediately', icon: '🚀', color: 'border-success/30 bg-success/5' },
                  { value: 'draft', label: 'Save as Draft', desc: 'Review before publishing', icon: '📝', color: 'border-border bg-surface-elevated' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      watchAll.status === opt.value ? opt.color : 'border-border hover:border-border-light'
                    }`}
                  >
                    <input type="radio" value={opt.value} className="mt-0.5" {...register('status')} />
                    <div>
                      <p className="text-sm font-semibold text-text flex items-center gap-2">
                        {opt.icon} {opt.label}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-5 animate-fade-up">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <HiCheckCircle className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-text">Ready to post?</p>
                <p className="text-xs text-text-muted mt-0.5">Review your job details before publishing.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Job Title', value: watchAll.title },
                { label: 'Location', value: watchAll.location },
                { label: 'Type', value: watchAll.type },
                { label: 'Experience', value: watchAll.experience || 'Any level' },
                { label: 'Status', value: watchAll.status },
                { label: 'Skills', value: skills.length > 0 ? skills.join(', ') : 'None added' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-text-muted mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-text capitalize">{item.value || '—'}</p>
                </div>
              ))}
            </div>

            {watchAll.description && (
              <div>
                <p className="text-xs text-text-muted mb-1">Description Preview</p>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-4 bg-surface-elevated p-3 rounded-xl border border-border">
                  {watchAll.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className={`flex gap-3 mt-6 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-text hover:border-border-light hover:bg-surface-elevated transition-all"
            >
              <HiArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-bold shadow-glow hover:opacity-90 active:scale-[0.98] transition-all ml-auto"
            >
              Continue
              <HiArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-bold shadow-glow hover:opacity-90 active:scale-[0.98] disabled:opacity-60 transition-all ml-auto"
            >
              {createMutation.isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Publishing…
                </>
              ) : (
                <>
                  {watchAll.status === 'open' ? '🚀 Publish Job' : '💾 Save Draft'}
                  <HiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecruiterCreateJob;
