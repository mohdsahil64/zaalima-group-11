import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  HiBriefcase,
  HiMapPin,
  HiAcademicCap,
  HiMagnifyingGlass,
  HiAdjustmentsHorizontal,
  HiCurrencyDollar,
  HiClock,
  HiXMark,
  HiArrowRight,
  HiBuildingOffice2,
  HiSparkles,
  HiExclamationTriangle,
  HiCheckCircle,
} from 'react-icons/hi2';
import JobService from '@/services/job.service';
import UserService from '@/services/user.service';
import { Badge, Loader } from '@/components/common';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';
import { capitalize, formatSalary, formatDate } from '@/utils';
import { calcJobMatch, matchColor, extractApplicantProfile } from '@/utils/profileCompletion';
import { useAuth } from '@/context/AuthContext';

const ApplicantJobs = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'recent'

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['applicant-jobs', { search, location, type: typeFilter, experience: experienceFilter }],
    queryFn: () => JobService.getJobs({ search, location, type: typeFilter, experience: experienceFilter, limit: 30 }),
  });

  const { data: profileData } = useQuery({
    queryKey: ['applicant', 'profile'],
    queryFn: () => UserService.getProfile(),
  });

  const applicant = extractApplicantProfile(profileData);
  const hasResume = !!(applicant?.resume?.url || applicant?.resume);
  const hasSkills = (applicant?.skills?.length || 0) >= 3;
  const profileReady = hasResume && hasSkills;

  const rawJobs = jobsData?.data || [];

  // Attach match scores + sort
  const jobs = rawJobs
    .map((job) => ({
      ...job,
      matchPct: calcJobMatch(job, { ...applicant, hasResume }),
    }))
    .sort((a, b) => {
      if (sortBy === 'match') return b.matchPct - a.matchPct;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setTypeFilter('');
    setExperienceFilter('');
  };
  const activeFilters = [typeFilter, experienceFilter, location].filter(Boolean).length;

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text">Browse Jobs</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {jobs.length > 0 ? `${jobs.length} open positions` : 'Find your next opportunity'}
            {profileReady && ' · Sorted by match score'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-base text-xs py-2 w-auto"
          >
            <option value="match">Best Match</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Profile incomplete warning */}
      {!profileReady && (
        <div className="p-4 rounded-2xl bg-warning/5 border border-warning/25 flex items-start gap-3">
          <HiExclamationTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-text">Complete your profile to see match scores</p>
            <p className="text-xs text-text-secondary mt-0.5">
              {!hasResume && !hasSkills
                ? 'Upload your resume and add at least 3 skills'
                : !hasResume
                ? 'Upload your resume to unlock AI match scoring'
                : 'Add at least 3 skills to your profile'}
            </p>
          </div>
          <Link
            to={!hasResume ? '/applicant/resume' : '/applicant/profile'}
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-warning hover:text-warning-dark transition-colors"
          >
            Fix now <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Search bar */}
      <div className="flex gap-2 p-1.5 bg-surface border border-border rounded-2xl shadow-sm">
        <div className="flex-1 flex items-center gap-2 px-3">
          <HiMagnifyingGlass className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Job title, keyword, or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text placeholder-text-muted outline-none py-2"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-text-muted hover:text-text">
              <HiXMark className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="w-px bg-border self-stretch my-1" />
        <div className="flex items-center gap-2 px-3">
          <HiMapPin className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Location or Remote…"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-32 bg-transparent text-sm text-text placeholder-text-muted outline-none py-2"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            showFilters || activeFilters > 0
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-surface-elevated text-text-secondary border border-border hover:text-text'
          }`}
        >
          <HiAdjustmentsHorizontal className="w-4 h-4" />
          {activeFilters > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface border border-border animate-fade-down">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-base text-sm">
            <option value="">All Types</option>
            {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} className="input-base text-sm">
            <option value="">All Levels</option>
            {EXPERIENCE_LEVELS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-error hover:text-error-dark transition-colors">
              <HiXMark className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Jobs grid */}
      {jobsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-surface rounded-2xl border border-border skeleton-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
            <HiBriefcase className="w-8 h-8 text-text-muted" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">No jobs found</p>
            <p className="text-xs text-text-muted mt-1">Try adjusting your filters or check back later.</p>
          </div>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="px-4 py-2 rounded-xl border border-border text-sm text-text-secondary hover:text-text transition-all">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job, i) => {
            const mc = matchColor(job.matchPct);
            return (
              <div
                key={job._id}
                className="group flex flex-col p-5 rounded-2xl bg-surface border border-border hover:border-border-light hover:-translate-y-px hover:shadow-card-hover card-shimmer transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                {/* Top row */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                    <HiBuildingOffice2 className="w-6 h-6 text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5 truncate">
                      {job.company?.name || 'Company'} · {formatDate(job.createdAt)}
                    </p>
                  </div>

                  {/* Match score badge */}
                  {profileReady && job.matchPct > 0 ? (
                    <div className={`flex flex-col items-center px-2.5 py-1.5 rounded-xl border shrink-0 ${mc.bg} ${mc.border}`}>
                      <HiSparkles className={`w-3 h-3 ${mc.text} mb-0.5`} />
                      <span className={`text-sm font-black leading-none ${mc.text}`}>{job.matchPct}%</span>
                      <span className={`text-[9px] font-semibold ${mc.text} opacity-80`}>match</span>
                    </div>
                  ) : (
                    <Badge variant={job.type === 'remote' ? 'success' : job.type === 'full-time' ? 'primary' : 'default'} size="sm">
                      {capitalize(job.type)}
                    </Badge>
                  )}
                </div>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="flex items-center gap-1 text-xs text-text-muted bg-surface-elevated px-2 py-1 rounded-lg border border-border">
                    <HiMapPin className="w-3 h-3 text-info" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted bg-surface-elevated px-2 py-1 rounded-lg border border-border">
                    <HiAcademicCap className="w-3 h-3 text-warning" /> {capitalize(job.experience || 'Any')}
                  </span>
                  {job.salary?.min && (
                    <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-lg border border-success/20">
                      <HiCurrencyDollar className="w-3 h-3" />
                      {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                    </span>
                  )}
                </div>

                {/* Skills with match highlight */}
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.slice(0, 4).map((skill, si) => {
                      const mySkills = (applicant?.skills || []).map((s) => s.toLowerCase());
                      const matched = mySkills.some((s) => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
                      return (
                        <span
                          key={si}
                          className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                            matched
                              ? 'bg-success/10 border-success/25 text-success'
                              : 'bg-surface-elevated border-border text-text-muted'
                          }`}
                        >
                          {matched && <HiCheckCircle className="w-2.5 h-2.5" />}
                          {skill}
                        </span>
                      );
                    })}
                    {job.skills.length > 4 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full border border-border text-text-muted bg-surface-elevated">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <HiClock className="w-3.5 h-3.5" />
                    {job.totalApplications || 0} applicants
                  </div>
                  <Link
                    to={`/applicant/jobs/${job._id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                  >
                    View & Apply
                    <HiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicantJobs;
