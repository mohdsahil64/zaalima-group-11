import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HiArrowLeft,
  HiMapPin,
  HiBriefcase,
  HiAcademicCap,
  HiCurrencyDollar,
  HiCheckCircle,
  HiBuildingOffice2,
  HiArrowRight,
  HiSparkles,
  HiXMark,
  HiDocumentText,
  HiUsers,
  HiClock,
  HiBookmark,
  HiExclamationTriangle,
  HiLockClosed,
  HiDocumentArrowUp,
} from 'react-icons/hi2';
import JobService from '@/services/job.service';
import ApplicationService from '@/services/application.service';
import UserService from '@/services/user.service';
import { Badge, Loader } from '@/components/common';
import { calcJobMatch, matchColor, extractApplicantProfile } from '@/utils/profileCompletion';
import { capitalize, formatSalary, formatDate } from '@/utils';
import toast from 'react-hot-toast';

const ApplicantJobDetail = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobData, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => JobService.getJob(id),
  });

  const { data: profileData } = useQuery({
    queryKey: ['applicant', 'profile'],
    queryFn: () => UserService.getProfile(),
  });

  const applicant = extractApplicantProfile(profileData);
  const hasResume = !!(applicant?.resume?.url || applicant?.resume);

  const job = jobData?.data?.job;

  const matchPct = job && applicant ? calcJobMatch(job, { ...applicant, hasResume }) : 0;
  const mc = matchColor(matchPct);

  // Can apply only if resume exists AND cover letter filled
  const canApply = hasResume && coverLetter.trim().length >= 20;

  const applyMutation = useMutation({
    mutationFn: () =>
      ApplicationService.createApplication({
        job: id,
        coverLetter: coverLetter.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant'] });
      toast.success('🎉 Application submitted successfully!');
      setShowModal(false);
      setCoverLetter('');
    },
    onError: (err) => toast.error(err.message || 'Failed to apply'),
  });

  if (jobLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader /></div>;

  if (!job) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <HiBriefcase className="w-10 h-10 text-text-muted" />
      <p className="text-sm font-semibold text-text">Job not found</p>
      <Link to="/applicant/jobs" className="text-xs text-primary hover:underline">← Back to jobs</Link>
    </div>
  );

  return (
    <div className="page-enter">
      {/* Back nav */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/applicant/jobs" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors">
          <HiArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
        <button
          onClick={() => setSaved((s) => !s)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
            saved ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-text-muted hover:border-border-light hover:text-text'
          }`}
        >
          <HiBookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Job hero */}
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                <HiBuildingOffice2 className="w-7 h-7 text-text-muted" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-text mb-1">{job.title}</h1>
                <p className="text-sm text-text-secondary">
                  {job.company?.name || 'Company'} · Posted {formatDate(job.createdAt)}
                </p>
              </div>
              {/* Match score badge */}
              {matchPct > 0 && (
                <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border ${mc.bg} ${mc.border} shrink-0`}>
                  <HiSparkles className={`w-4 h-4 ${mc.text}`} />
                  <span className={`text-lg font-black ${mc.text} leading-none`}>{matchPct}%</span>
                  <span className={`text-[10px] font-semibold ${mc.text}`}>Match</span>
                </div>
              )}
            </div>

            {/* Match bar */}
            {matchPct > 0 && (
              <div className={`p-3 rounded-xl ${mc.bg} border ${mc.border} mb-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <HiSparkles className={`w-3.5 h-3.5 ${mc.text}`} />
                    <span className={`text-xs font-semibold ${mc.text}`}>Your Match Score</span>
                  </div>
                  <span className={`text-xs font-bold ${mc.text}`}>{matchPct}%</span>
                </div>
                <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${mc.bar} transition-all duration-700`} style={{ width: `${matchPct}%` }} />
                </div>
                <p className={`text-xs mt-1.5 ${mc.text} opacity-80`}>
                  {matchPct >= 75 ? 'Great match! Your skills align well with this role.' :
                   matchPct >= 50 ? 'Good match. Add more relevant skills to your profile to improve.' :
                   'Low match. Consider adding skills from the job requirements to your profile.'}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-xs bg-surface-elevated border border-border px-3 py-1.5 rounded-lg text-text-secondary">
                <HiMapPin className="w-3.5 h-3.5 text-info" />{job.location}
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-surface-elevated border border-border px-3 py-1.5 rounded-lg text-text-secondary">
                <HiBriefcase className="w-3.5 h-3.5 text-primary" />{capitalize(job.type)}
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-surface-elevated border border-border px-3 py-1.5 rounded-lg text-text-secondary">
                <HiAcademicCap className="w-3.5 h-3.5 text-warning" />{capitalize(job.experience || 'Any')}
              </span>
              {job.salary?.min && (
                <span className="flex items-center gap-1.5 text-xs bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg text-success font-medium">
                  <HiCurrencyDollar className="w-3.5 h-3.5" />
                  {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <h2 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" /> About this role
              </h2>
              <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">{job.description}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <h2 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-warning rounded-full" /> Requirements
              </h2>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <HiCheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />{req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <h2 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-accent rounded-full" /> Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => {
                  const mySkills = (applicant?.skills || []).map((s) => s.toLowerCase());
                  const matched = mySkills.some((s) => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
                  return (
                    <span key={i} className={`skill-chip ${matched ? 'bg-success/10 border-success/25 text-success' : ''}`}>
                      {matched && <HiCheckCircle className="w-3 h-3" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
              {(applicant?.skills?.length || 0) > 0 && (
                <p className="text-xs text-text-muted mt-3">
                  ✅ = skills you already have in your profile
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Apply card */}
            <div className="p-6 rounded-2xl bg-surface-elevated border border-border">
              <h3 className="text-base font-bold text-text mb-1">Apply Now</h3>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                Resume is auto-attached. Just write a cover letter and submit.
              </p>

              {/* Pre-checks */}
              <div className="space-y-2 mb-4">
                <div className={`flex items-center gap-2.5 p-2.5 rounded-lg ${hasResume ? 'bg-success/8 border border-success/20' : 'bg-error/8 border border-error/20'}`}>
                  {hasResume
                    ? <HiCheckCircle className="w-4 h-4 text-success shrink-0" />
                    : <HiExclamationTriangle className="w-4 h-4 text-error shrink-0" />}
                  <div>
                    <p className={`text-xs font-semibold ${hasResume ? 'text-success' : 'text-error'}`}>
                      {hasResume ? 'Resume ready' : 'Resume required'}
                    </p>
                    {!hasResume && (
                      <Link to="/applicant/resume" className="text-[11px] text-error underline">
                        Upload resume first →
                      </Link>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-2.5 p-2.5 rounded-lg ${coverLetter.trim().length >= 20 ? 'bg-success/8 border border-success/20' : 'bg-border/40 border border-border'}`}>
                  {coverLetter.trim().length >= 20
                    ? <HiCheckCircle className="w-4 h-4 text-success shrink-0" />
                    : <HiDocumentText className="w-4 h-4 text-text-muted shrink-0" />}
                  <p className={`text-xs font-semibold ${coverLetter.trim().length >= 20 ? 'text-success' : 'text-text-muted'}`}>
                    Cover letter {coverLetter.trim().length >= 20 ? 'written' : 'required (min 20 chars)'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!hasResume) { toast.error('Upload your resume first before applying!'); return; }
                  setShowModal(true);
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-glow transition-all ${
                  hasResume
                    ? 'bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98]'
                    : 'bg-surface border border-border text-text-muted cursor-not-allowed opacity-60'
                }`}
              >
                {!hasResume && <HiLockClosed className="w-4 h-4" />}
                Apply for this Job
                {hasResume && <HiArrowRight className="w-4 h-4" />}
              </button>

              <div className="mt-4 pt-4 border-t border-border space-y-2.5">
                {[
                  { icon: HiClock, label: 'Posted', value: formatDate(job.createdAt) },
                  { icon: HiUsers, label: 'Applicants', value: `${job.totalApplications || 0} applied` },
                  { icon: HiBriefcase, label: 'Type', value: capitalize(job.type) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-text-muted"><item.icon className="w-3.5 h-3.5" />{item.label}</span>
                    <span className="text-text font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Company */}
            {job.company && (
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Company</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                    <HiBuildingOffice2 className="w-5 h-5 text-text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{job.company.name}</p>
                    {job.company.industry && <p className="text-xs text-text-muted">{job.company.industry}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Apply Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-surface-elevated border border-border rounded-2xl shadow-xl animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-text">Submit Application</h3>
                <p className="text-xs text-text-muted mt-0.5">{job.title} · {job.company?.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Resume auto-attach notice */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-success/8 border border-success/20">
                <HiDocumentArrowUp className="w-4 h-4 text-success shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-success">Resume auto-attached</p>
                  <p className="text-[11px] text-text-muted">Your saved resume will be submitted automatically.</p>
                </div>
              </div>

              {/* AI match */}
              {matchPct > 0 && (
                <div className={`flex items-center gap-3 p-3 rounded-xl ${mc.bg} border ${mc.border}`}>
                  <HiSparkles className={`w-4 h-4 ${mc.text} shrink-0`} />
                  <div>
                    <p className={`text-xs font-semibold ${mc.text}`}>Your match: {matchPct}%</p>
                    <p className="text-[11px] text-text-muted">AI will re-score after full resume analysis.</p>
                  </div>
                </div>
              )}

              {/* Cover letter — REQUIRED */}
              <div>
                <label className="form-label">
                  Cover Letter <span className="text-error">*</span>
                  <span className="text-text-muted font-normal ml-1">(Required · min 20 characters)</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell the recruiter why you're a great fit. Mention relevant experience, your motivation, and what you'll bring to this role…"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className={`input-base resize-none ${coverLetter.trim().length > 0 && coverLetter.trim().length < 20 ? 'error' : ''}`}
                />
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-[11px] ${coverLetter.trim().length < 20 && coverLetter.trim().length > 0 ? 'text-error' : 'text-text-muted'}`}>
                    {coverLetter.trim().length < 20 && coverLetter.trim().length > 0
                      ? `⚠ Need ${20 - coverLetter.trim().length} more characters`
                      : 'A personalised cover letter increases your chances by 40%'}
                  </p>
                  <span className={`text-[11px] ${coverLetter.length > 900 ? 'text-warning' : 'text-text-muted'}`}>
                    {coverLetter.length}/1000
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-hover transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isPending || !canApply}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-bold shadow-glow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {applyMutation.isPending ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting…</>
                ) : (
                  <><HiDocumentText className="w-4 h-4" />Submit Application</>
                )}
              </button>
            </div>

            {!canApply && (
              <div className="px-5 pb-4">
                <p className="text-xs text-error text-center">
                  {!hasResume ? '⚠ Upload your resume first' : '⚠ Write a cover letter (min 20 characters) to apply'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantJobDetail;
