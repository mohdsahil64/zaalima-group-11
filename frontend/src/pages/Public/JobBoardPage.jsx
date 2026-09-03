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
} from 'react-icons/hi2';
import JobService from '@/services/job.service';
import { Badge, Loader } from '@/components/common';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';
import { capitalize, formatSalary, formatDate } from '@/utils';

const typeColors = {
  'full-time': 'success',
  'part-time': 'warning',
  contract:   'info',
  internship: 'primary',
  remote:     'accent',
};

const JobBoardPage = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['public', 'jobs', { search, location, type: typeFilter, experience: experienceFilter }],
    queryFn: () =>
      JobService.getJobs({
        search,
        location,
        type: typeFilter,
        experience: experienceFilter,
        limit: 20,
      }),
  });

  const jobs = data?.data || [];
  const activeFilters = [typeFilter, experienceFilter, location].filter(Boolean).length;

  const clearFilters = () => {
    setTypeFilter('');
    setExperienceFilter('');
    setLocation('');
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Header ── */}
      <div className="relative border-b border-border bg-surface/50 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="orb w-80 h-80 bg-primary top-[-100px] right-[10%] opacity-10" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-4">
            <HiSparkles className="w-3.5 h-3.5" />
            {jobs.length > 0 ? `${jobs.length} open positions` : 'Open Positions'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-3">
            Find your next opportunity
          </h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Browse jobs from top companies. Apply in one click with your profile.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex gap-2 p-1.5 bg-surface border border-border rounded-2xl shadow-lg">
              <div className="flex-1 flex items-center gap-2 px-3">
                <HiMagnifyingGlass className="w-4 h-4 text-text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company…"
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
                  className="w-36 bg-transparent text-sm text-text placeholder-text-muted outline-none py-2"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow-sm hover:opacity-90 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                showFilters || activeFilters > 0
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-surface text-text-secondary hover:text-text hover:border-border-light'
              }`}
            >
              <HiAdjustmentsHorizontal className="w-4 h-4" />
              Filters
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            {/* Quick type filters */}
            {['full-time', 'remote', 'internship'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all capitalize ${
                  typeFilter === t
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-surface text-text-muted hover:text-text hover:border-border-light'
                }`}
              >
                {t}
              </button>
            ))}

            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-error transition-colors"
              >
                <HiXMark className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
          <p className="text-sm text-text-muted">
            {isLoading ? 'Loading…' : `${jobs.length} jobs found`}
          </p>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-2xl bg-surface border border-border animate-fade-down grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-base text-sm"
            >
              <option value="">All Types</option>
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="input-base text-sm"
            >
              <option value="">All Levels</option>
              {EXPERIENCE_LEVELS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Job grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <HiBriefcase className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-base font-semibold text-text mb-2">No jobs found</h3>
            <p className="text-sm text-text-muted mb-6">
              Try adjusting your search filters or check back later.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl border border-border text-sm text-text-secondary hover:text-text hover:bg-surface-elevated transition-all"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobs.map((job, i) => (
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
                    <p className="text-xs text-text-secondary mt-0.5">
                      {job.company?.name || 'Company'} · Posted {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant={typeColors[job.type] || 'default'}
                    size="sm"
                    dot
                  >
                    {capitalize(job.type)}
                  </Badge>
                </div>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 text-xs text-text-muted bg-surface-elevated px-2.5 py-1 rounded-lg border border-border">
                    <HiMapPin className="w-3 h-3 text-info" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted bg-surface-elevated px-2.5 py-1 rounded-lg border border-border">
                    <HiAcademicCap className="w-3 h-3 text-warning" />
                    {capitalize(job.experience || 'Any level')}
                  </span>
                  {job.salary?.min && (
                    <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">
                      <HiCurrencyDollar className="w-3 h-3" />
                      {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                    </span>
                  )}
                </div>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.slice(0, 4).map((skill, si) => (
                      <span key={si} className="skill-chip">{skill}</span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="skill-chip text-text-muted border-border bg-surface-elevated text-[11px]">
                        +{job.skills.length - 4} more
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
                    to={`/jobs/${job._id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors group-hover:gap-2.5"
                  >
                    View & Apply
                    <HiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoardPage;
