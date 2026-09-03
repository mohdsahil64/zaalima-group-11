import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HiDocumentText,
  HiSparkles,
  HiMagnifyingGlass,
  HiXMark,
  HiChevronDown,
  HiChevronUp,
  HiUser,
  HiEnvelope,
  HiArrowTopRightOnSquare,
  HiCheckCircle,
  HiClock,
  HiCalendarDays,
  HiGift,
  HiXCircle,
  HiBriefcase,
} from 'react-icons/hi2';
import ApplicationService from '@/services/application.service';
import { Badge, Avatar } from '@/components/common';
import { formatDate, capitalize } from '@/utils';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'applied',     label: 'Applied',     icon: HiClock,        color: 'text-info' },
  { value: 'shortlisted', label: 'Shortlisted',  icon: HiCheckCircle,  color: 'text-primary' },
  { value: 'interview',   label: 'Interview',   icon: HiCalendarDays, color: 'text-warning' },
  { value: 'offered',     label: 'Offered',     icon: HiGift,         color: 'text-success' },
  { value: 'rejected',    label: 'Rejected',    icon: HiXCircle,      color: 'text-error' },
];

const STATUS_VARIANT = {
  applied:     'info',
  shortlisted: 'primary',
  interview:   'warning',
  offered:     'success',
  rejected:    'error',
  withdrawn:   'default',
};

const ScoreBadge = ({ score }) => {
  if (score == null) return <span className="text-xs text-text-muted">—</span>;
  const color = score >= 70 ? 'text-success bg-success/10 border-success/20'
    : score >= 40 ? 'text-warning bg-warning/10 border-warning/20'
    : 'text-error bg-error/10 border-error/20';
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-bold ${color}`}>
      <HiSparkles className="w-3 h-3" />
      {score}%
    </div>
  );
};

const StatusDropdown = ({ appId, currentStatus, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const current = STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-border-light text-xs font-medium text-text transition-all"
      >
        <current.icon className={`w-3.5 h-3.5 ${current.color}`} />
        <span>{current.label}</span>
        {open ? <HiChevronUp className="w-3 h-3 text-text-muted" /> : <HiChevronDown className="w-3 h-3 text-text-muted" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-surface-elevated border border-border rounded-xl shadow-lg z-20 overflow-hidden animate-fade-down">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onUpdate(appId, opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-surface-hover ${
                opt.value === currentStatus ? 'text-primary bg-primary/5' : 'text-text-secondary'
              }`}
            >
              <opt.icon className={`w-3.5 h-3.5 ${opt.color}`} />
              {opt.label}
              {opt.value === currentStatus && <HiCheckCircle className="w-3.5 h-3.5 text-primary ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const RecruiterApplications = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['recruiter', 'applications', { status: statusFilter }],
    queryFn: () => ApplicationService.getApplications({ status: statusFilter, limit: 50 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => ApplicationService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'stats'] });
      toast.success('Status updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update'),
  });

  const applications = (data?.data || []).filter((app) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      app.applicant?.firstName?.toLowerCase().includes(q) ||
      app.applicant?.lastName?.toLowerCase().includes(q) ||
      app.applicant?.email?.toLowerCase().includes(q) ||
      app.job?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text">Applications</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Review candidates and manage their status
          </p>
        </div>
        <span className="text-xs text-text-muted px-3 py-1.5 rounded-lg bg-surface border border-border shrink-0">
          {applications.length} results
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or job title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-10 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
              <HiXMark className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[{ value: '', label: 'All' }, ...STATUS_OPTIONS].map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                statusFilter === s.value
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-border bg-surface text-text-muted hover:text-text hover:border-border-light'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-surface rounded-2xl border border-border skeleton-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
            <HiDocumentText className="w-8 h-8 text-text-muted" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">No applications found</p>
            <p className="text-xs text-text-muted mt-1">
              {statusFilter ? 'Try a different filter' : 'Applications will appear once candidates apply to your jobs.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {applications.map((app, i) => {
            const isExpanded = expandedId === app._id;
            return (
              <div
                key={app._id}
                className={`rounded-2xl bg-surface border transition-all duration-200 overflow-hidden animate-fade-up ${
                  isExpanded ? 'border-primary/25 shadow-glow-sm' : 'border-border hover:border-border-light'
                }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                {/* Row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : app._id)}
                >
                  <Avatar
                    firstName={app.applicant?.firstName}
                    lastName={app.applicant?.lastName}
                    size="md"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text">
                      {app.applicant?.firstName} {app.applicant?.lastName}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {app.job?.title || 'Position'} · Applied {formatDate(app.createdAt)}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <ScoreBadge score={app.aiScore} />
                    <Badge variant={STATUS_VARIANT[app.status]} size="sm" dot>
                      {capitalize(app.status)}
                    </Badge>
                  </div>

                  <StatusDropdown
                    appId={app._id}
                    currentStatus={app.status}
                    onUpdate={(id, status) => updateMutation.mutate({ id, status })}
                  />

                  <button className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors ml-1">
                    {isExpanded ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div className="border-t border-border/60 p-4 bg-surface-elevated/50 animate-fade-down">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Candidate info */}
                      <div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
                          Candidate
                        </p>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <HiUser className="w-4 h-4 text-text-muted shrink-0" />
                            <span className="text-sm text-text">
                              {app.applicant?.firstName} {app.applicant?.lastName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <HiEnvelope className="w-4 h-4 text-text-muted shrink-0" />
                            <a
                              href={`mailto:${app.applicant?.email}`}
                              className="text-sm text-primary hover:underline truncate"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {app.applicant?.email}
                            </a>
                          </div>
                          {app.applicant?.phone && (
                            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                              <span className="w-4 h-4 shrink-0 text-center text-xs">📞</span>
                              {app.applicant.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Application info */}
                      <div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
                          Application
                        </p>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <HiBriefcase className="w-4 h-4 text-text-muted shrink-0" />
                            <span className="text-sm text-text">{app.job?.title}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <HiCalendarDays className="w-4 h-4 text-text-muted shrink-0" />
                            <span className="text-sm text-text-secondary">Applied {formatDate(app.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <HiSparkles className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-sm">
                              AI Score: <ScoreBadge score={app.aiScore} />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cover letter + actions */}
                      <div>
                        {app.coverLetter ? (
                          <div>
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
                              Cover Letter
                            </p>
                            <p className="text-xs text-text-secondary leading-relaxed line-clamp-4 bg-surface rounded-xl p-3 border border-border">
                              {app.coverLetter}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
                              Actions
                            </p>
                            <div className="space-y-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); updateMutation.mutate({ id: app._id, status: 'shortlisted' }); }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium hover:bg-primary/20 transition-all"
                              >
                                <HiCheckCircle className="w-3.5 h-3.5" /> Shortlist Candidate
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); updateMutation.mutate({ id: app._id, status: 'interview' }); }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-warning/10 border border-warning/20 text-xs text-warning font-medium hover:bg-warning/20 transition-all"
                              >
                                <HiCalendarDays className="w-3.5 h-3.5" /> Move to Interview
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); updateMutation.mutate({ id: app._id, status: 'rejected' }); }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium hover:bg-error/20 transition-all"
                              >
                                <HiXCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;
