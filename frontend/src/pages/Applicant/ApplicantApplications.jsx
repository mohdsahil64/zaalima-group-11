import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  HiDocumentText,
  HiBriefcase,
  HiSparkles,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiCalendarDays,
  HiGift,
  HiMagnifyingGlass,
  HiFunnel,
} from 'react-icons/hi2';
import ApplicationService from '@/services/application.service';
import { Badge, Loader } from '@/components/common';
import { formatDate, capitalize } from '@/utils';

const STATUS_CONFIG = {
  applied: {
    variant: 'info',
    icon: HiClock,
    label: 'Applied',
    desc: 'Application submitted, awaiting review',
    step: 1,
    color: 'bg-info',
    border: 'border-info/30',
    bg: 'bg-info/8',
  },
  shortlisted: {
    variant: 'primary',
    icon: HiCheckCircle,
    label: 'Shortlisted',
    desc: "You've been shortlisted by the recruiter",
    step: 2,
    color: 'bg-primary',
    border: 'border-primary/30',
    bg: 'bg-primary/8',
  },
  interview: {
    variant: 'warning',
    icon: HiCalendarDays,
    label: 'Interview',
    desc: 'Interview scheduled — check your email',
    step: 3,
    color: 'bg-warning',
    border: 'border-warning/30',
    bg: 'bg-warning/8',
  },
  offered: {
    variant: 'success',
    icon: HiGift,
    label: 'Offered',
    desc: "Congratulations! You've received an offer",
    step: 4,
    color: 'bg-success',
    border: 'border-success/30',
    bg: 'bg-success/8',
  },
  rejected: {
    variant: 'error',
    icon: HiXCircle,
    label: 'Rejected',
    desc: 'Application was not selected this time',
    step: 0,
    color: 'bg-error',
    border: 'border-error/30',
    bg: 'bg-error/8',
  },
  withdrawn: {
    variant: 'default',
    icon: HiXCircle,
    label: 'Withdrawn',
    desc: 'You withdrew this application',
    step: 0,
    color: 'bg-text-muted',
    border: 'border-border',
    bg: 'bg-surface-elevated',
  },
};

const PIPELINE = ['applied', 'shortlisted', 'interview', 'offered'];

const StatusStepper = ({ status }) => {
  const currentStep = STATUS_CONFIG[status]?.step || 0;
  const isRejected = status === 'rejected' || status === 'withdrawn';

  if (isRejected) {
    return (
      <div className="flex items-center gap-1.5 mt-2">
        <HiXCircle className="w-3.5 h-3.5 text-error" />
        <span className="text-[11px] text-error">Not selected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-2.5">
      {PIPELINE.map((stage, i) => {
        const isCurrent = PIPELINE.indexOf(status) === i;
        const isPast = PIPELINE.indexOf(status) > i;
        return (
          <div key={stage} className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                isPast ? 'bg-success' : isCurrent ? 'bg-primary animate-pulse' : 'bg-border'
              }`}
            />
            {i < PIPELINE.length - 1 && (
              <div className={`w-6 h-px ${isPast ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
      <span className="text-[11px] text-text-muted ml-1">
        Step {currentStep}/{PIPELINE.length}
      </span>
    </div>
  );
};

const ApplicantApplications = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'table'

  const { data, isLoading } = useQuery({
    queryKey: ['applicant', 'applications', { status: statusFilter }],
    queryFn: () => ApplicationService.getApplications({ status: statusFilter, limit: 50 }),
  });

  const applications = (data?.data || []).filter((app) => {
    if (!search) return true;
    return (
      app.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.company?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]"><Loader /></div>
  );

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text">My Applications</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Track the status of all your job applications
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-text-muted px-3 py-1.5 rounded-lg bg-surface border border-border">
            {applications.length} total
          </span>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by job title or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-10 text-sm"
          />
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {['', 'applied', 'shortlisted', 'interview', 'offered', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                statusFilter === s
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-border bg-surface text-text-muted hover:text-text hover:border-border-light'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
            <HiDocumentText className="w-8 h-8 text-text-muted" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">No applications found</p>
            <p className="text-xs text-text-muted mt-1">
              {statusFilter ? 'Try a different filter' : 'Browse jobs and start applying!'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app, i) => {
            const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
            const StatusIcon = sc.icon;
            return (
              <div
                key={app._id}
                className={`p-4 rounded-2xl bg-surface border ${sc.border} hover:shadow-card-hover hover:-translate-y-px transition-all duration-300 animate-fade-up`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* Company icon */}
                  <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                    <HiBriefcase className="w-5 h-5 text-text-muted" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-text">
                          {app.job?.title || 'Job Position'}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">
                          {app.company?.name || app.job?.company?.name || 'Company'}
                          {' · '}Applied {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {app.aiScore != null && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated border border-border">
                            <HiSparkles className="w-3 h-3 text-primary" />
                            <span
                              className={`text-xs font-bold ${
                                app.aiScore >= 70
                                  ? 'text-success'
                                  : app.aiScore >= 40
                                  ? 'text-warning'
                                  : 'text-error'
                              }`}
                            >
                              {app.aiScore}%
                            </span>
                          </div>
                        )}
                        <Badge variant={sc.variant} size="sm" dot>
                          {capitalize(app.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Stepper */}
                    <StatusStepper status={app.status} />

                    {/* Status message */}
                    <div className={`flex items-center gap-2 mt-3 px-3 py-2 rounded-lg ${sc.bg} border ${sc.border}`}>
                      <StatusIcon className={`w-3.5 h-3.5 shrink-0 ${
                        sc.variant === 'success' ? 'text-success' :
                        sc.variant === 'error' ? 'text-error' :
                        sc.variant === 'warning' ? 'text-warning' :
                        sc.variant === 'primary' ? 'text-primary' : 'text-info'
                      }`} />
                      <p className="text-xs text-text-secondary">{sc.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicantApplications;
