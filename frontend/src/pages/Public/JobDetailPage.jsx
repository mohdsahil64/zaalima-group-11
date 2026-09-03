import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  HiArrowLeft,
  HiMapPin,
  HiBriefcase,
  HiAcademicCap,
  HiCurrencyDollar,
  HiClock,
  HiBuildingOffice2,
  HiCheckCircle,
  HiArrowRight,
  HiShare,
  HiBookmark,
  HiUsers,
  HiSparkles,
} from 'react-icons/hi2';
import JobService from '@/services/job.service';
import { Badge, Loader } from '@/components/common';
import { capitalize, formatSalary, formatDate } from '@/utils';
import { useAuth } from '@/context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['public-job', id],
    queryFn: () => JobService.getJob(id),
  });

  const job = data?.data?.job;

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    if (user?.role === 'applicant') {
      navigate(`/applicant/jobs/${id}`);
    } else {
      navigate('/register');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
          <HiBriefcase className="w-8 h-8 text-text-muted" />
        </div>
        <h2 className="text-lg font-bold text-text">Job not found</h2>
        <Link to="/jobs" className="text-sm text-primary hover:underline">
          ← Back to job board
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/jobs"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            All Jobs
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved((s) => !s)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                saved
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border text-text-secondary hover:border-border-light hover:text-text'
              }`}
            >
              <HiBookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-xs font-medium text-text-secondary hover:border-border-light hover:text-text transition-all">
              <HiShare className="w-3.5 h-3.5" />
              Share
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-glow-sm hover:opacity-90 transition-all"
            >
              Apply Now
              <HiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job hero card */}
            <div className="p-6 rounded-2xl bg-surface border border-border animate-fade-up">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                  <HiBuildingOffice2 className="w-8 h-8 text-text-muted" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-text mb-1">{job.title}</h1>
                  <p className="text-sm text-text-secondary">
                    {job.company?.name || 'Company'} · Posted {formatDate(job.createdAt)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <HiSparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-primary font-medium">AI Match Score available on apply</span>
                  </div>
                </div>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-xs bg-surface-elevated border border-border px-3 py-1.5 rounded-lg text-text-secondary">
                  <HiMapPin className="w-3.5 h-3.5 text-info" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5 text-xs bg-surface-elevated border border-border px-3 py-1.5 rounded-lg text-text-secondary">
                  <HiBriefcase className="w-3.5 h-3.5 text-primary" />
                  {capitalize(job.type)}
                </span>
                <span className="flex items-center gap-1.5 text-xs bg-surface-elevated border border-border px-3 py-1.5 rounded-lg text-text-secondary">
                  <HiAcademicCap className="w-3.5 h-3.5 text-warning" />
                  {capitalize(job.experience || 'Any level')}
                </span>
                {job.salary?.min && (
                  <span className="flex items-center gap-1.5 text-xs bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg text-success">
                    <HiCurrencyDollar className="w-3.5 h-3.5" />
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs bg-surface-elevated border border-border px-3 py-1.5 rounded-lg text-text-secondary">
                  <HiUsers className="w-3.5 h-3.5 text-text-muted" />
                  {job.totalApplications || 0} applicants
                </span>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div className="p-6 rounded-2xl bg-surface border border-border animate-fade-up" style={{ animationDelay: '0.05s' }}>
                <h2 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full" />
                  About this role
                </h2>
                <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="p-6 rounded-2xl bg-surface border border-border animate-fade-up" style={{ animationDelay: '0.08s' }}>
                <h2 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-info rounded-full" />
                  Responsibilities
                </h2>
                <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                  {job.responsibilities}
                </p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="p-6 rounded-2xl bg-surface border border-border animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-warning rounded-full" />
                  Requirements
                </h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <HiCheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="p-6 rounded-2xl bg-surface border border-border animate-fade-up" style={{ animationDelay: '0.12s' }}>
                <h2 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-accent rounded-full" />
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Apply card */}
            <div className="sticky top-24 space-y-4">
              <div className="p-6 rounded-2xl bg-surface-elevated border border-border animate-fade-up" style={{ animationDelay: '0.05s' }}>
                <h3 className="text-sm font-bold text-text mb-1">Ready to apply?</h3>
                <p className="text-xs text-text-muted mb-5 leading-relaxed">
                  Submit your application and our AI will instantly score your match with this role.
                </p>

                <button
                  onClick={handleApply}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-white text-sm font-bold shadow-glow hover:opacity-90 active:scale-[0.98] transition-all mb-3"
                >
                  Apply for this Job
                  <HiArrowRight className="w-4 h-4" />
                </button>

                {!isAuthenticated && (
                  <p className="text-center text-xs text-text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                )}

                <div className="mt-5 pt-4 border-t border-border space-y-2.5">
                  {[
                    { icon: HiClock, label: 'Posted', value: formatDate(job.createdAt) },
                    { icon: HiUsers, label: 'Applicants', value: `${job.totalApplications || 0} applied` },
                    { icon: HiBriefcase, label: 'Type', value: capitalize(job.type) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-text-muted">
                        <item.icon className="w-3.5 h-3.5" />
                        {item.label}
                      </span>
                      <span className="text-text font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company card */}
              {job.company && (
                <div className="p-5 rounded-2xl bg-surface border border-border animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">
                    About the Company
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                      <HiBuildingOffice2 className="w-6 h-6 text-text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">{job.company.name}</p>
                      {job.company.industry && (
                        <p className="text-xs text-text-muted">{job.company.industry}</p>
                      )}
                    </div>
                  </div>
                  {job.company.location && (
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <HiMapPin className="w-3.5 h-3.5" />
                      {job.company.location}
                    </div>
                  )}
                  {job.company.description && (
                    <p className="mt-3 text-xs text-text-muted leading-relaxed line-clamp-3">
                      {job.company.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
