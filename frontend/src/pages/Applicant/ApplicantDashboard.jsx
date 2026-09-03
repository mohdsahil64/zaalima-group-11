import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiDocumentText, HiClock, HiCalendarDays, HiGift, HiBriefcase, HiArrowRight, HiSparkles, HiCheckCircle, HiXCircle, HiDocumentArrowUp, HiUser, HiExclamationTriangle, HiChartBarSquare } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import ApplicationService from '@/services/application.service';
import UserService from '@/services/user.service';
import { Badge } from '@/components/common';
import { calcProfileCompletion, extractApplicantProfile } from '@/utils/profileCompletion';
import { formatDate, capitalize } from '@/utils';

const SC = { applied:{variant:'info',icon:HiClock}, shortlisted:{variant:'primary',icon:HiCheckCircle}, interview:{variant:'warning',icon:HiCalendarDays}, offered:{variant:'success',icon:HiGift}, rejected:{variant:'error',icon:HiXCircle}, withdrawn:{variant:'default',icon:HiXCircle} };

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const { data: statsData, isLoading } = useQuery({ queryKey:['applicant','stats'], queryFn:()=>ApplicationService.getApplicantStats() });
  const { data: appsData }  = useQuery({ queryKey:['applicant','applications',{limit:5}], queryFn:()=>ApplicationService.getApplications({limit:5}) });
  const { data: profileData } = useQuery({ queryKey:['applicant','profile'], queryFn:()=>UserService.getProfile() });

  const stats    = statsData?.data?.stats || {};
  const apps     = appsData?.data || [];
  const applicant = extractApplicantProfile(profileData);
  const hasResume = !!(applicant?.resume || applicant?.resumeUrl);
  const { pct, steps } = calcProfileCompletion(user, applicant, hasResume);
  const pctColor = pct>=80?'text-success':pct>=50?'text-warning':'text-error';
  const barColor = pct>=80?'bg-success':pct>=50?'bg-warning':'bg-error';

  if (isLoading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-surface-elevated rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[...Array(4)].map((_,i)=><div key={i} className="h-20 bg-surface rounded-xl border border-border"/>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{[...Array(2)].map((_,i)=><div key={i} className="h-52 bg-surface rounded-xl border border-border lg:col-span-2"/>)}</div>
    </div>
  );

  return (
    <div className="page-enter space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-xs text-text-secondary mt-0.5">Your job search overview</p>
        </div>
        <Link to="/applicant/jobs" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-primary text-white text-xs font-semibold shadow-glow-sm hover:opacity-90 transition-all shrink-0">
          <HiBriefcase className="w-3.5 h-3.5" /> Browse Jobs
        </Link>
      </div>

      {/* Resume missing banner */}
      {!hasResume && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-error/5 border border-error/20">
          <HiExclamationTriangle className="w-4 h-4 text-error shrink-0" />
          <p className="text-xs text-text-secondary flex-1">Upload your resume to apply for jobs</p>
          <Link to="/applicant/resume" className="flex items-center gap-1 text-xs font-semibold text-error hover:underline shrink-0">Upload <HiArrowRight className="w-3 h-3"/></Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Applied',    value:stats.total||0,     icon:HiDocumentText, color:'text-primary',  bg:'bg-primary/10',  border:'border-primary/15' },
          { label:'In Review',  value:(stats.applied||0)+(stats.shortlisted||0), icon:HiClock, color:'text-warning', bg:'bg-warning/10', border:'border-warning/15' },
          { label:'Interviews', value:stats.interview||0,  icon:HiCalendarDays, color:'text-info',    bg:'bg-info/10',    border:'border-info/15' },
          { label:'Offers',     value:stats.offered||0,   icon:HiGift,         color:'text-success',  bg:'bg-success/10',  border:'border-success/15' },
        ].map((c,i)=>(
          <div key={c.label} className={`stat-card p-3 rounded-xl bg-surface border ${c.border} hover:-translate-y-px hover:shadow-card transition-all animate-fade-up`} style={{animationDelay:`${i*0.05}s`}}>
            <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center mb-2`}>
              <c.icon className={`w-4 h-4 ${c.color}`}/>
            </div>
            <p className="text-xl font-bold text-text leading-none">{c.value}</p>
            <p className="text-[11px] text-text-secondary mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent apps */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-text">Recent Applications</p>
            <Link to="/applicant/applications" className="text-xs text-primary hover:text-primary-light transition-colors">View all →</Link>
          </div>
          {apps.length===0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HiBriefcase className="w-8 h-8 text-text-muted mb-2"/>
              <p className="text-xs text-text-muted">No applications yet</p>
              <Link to="/applicant/jobs" className="mt-2 text-xs text-primary hover:underline">Browse Jobs →</Link>
            </div>
          ) : (
            <div className="space-y-1">
              {apps.map((app,i)=>{
                const sc=SC[app.status]||SC.applied;
                return (
                  <div key={app._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors animate-fade-up" style={{animationDelay:`${i*0.04}s`}}>
                    <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                      <HiBriefcase className="w-3.5 h-3.5 text-text-muted"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text truncate">{app.job?.title||'Job'}</p>
                      <p className="text-[11px] text-text-muted truncate">{app.company?.name||'Company'} · {formatDate(app.createdAt)}</p>
                    </div>
                    {app.aiScore!=null && (
                      <span className={`text-[11px] font-bold shrink-0 ${app.aiScore>=70?'text-success':app.aiScore>=40?'text-warning':'text-error'}`}>
                        {app.aiScore}%
                      </span>
                    )}
                    <Badge variant={sc.variant} size="sm" dot>{capitalize(app.status)}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-3">
          {/* Profile completion */}
          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-bold text-text">Profile Strength</p>
              <span className={`text-xs font-bold ${pctColor}`}>{pct}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{width:`${pct}%`}}/>
            </div>
            <div className="space-y-1.5">
              {steps.map(s=>(
                <div key={s.key} className="flex items-center gap-2">
                  {s.done ? <HiCheckCircle className="w-3.5 h-3.5 text-success shrink-0"/> : <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${s.required?'border-error':'border-border'}`}/>}
                  <span className={`text-[11px] ${s.done?'text-text-muted line-through':'text-text'}`}>{s.label}</span>
                  {s.required&&!s.done&&<span className="ml-auto text-[9px] font-bold text-error">Req</span>}
                </div>
              ))}
            </div>
            <Link to="/applicant/profile" className="mt-2 flex items-center gap-1 text-[11px] text-primary font-medium hover:underline">Edit Profile <HiArrowRight className="w-3 h-3"/></Link>
          </div>

          {/* Quick actions */}
          <div className="p-4 rounded-xl bg-surface border border-border">
            <p className="text-xs font-bold text-text mb-2">Quick Actions</p>
            <div className="space-y-1">
              {[
                {to:'/applicant/jobs',        icon:HiBriefcase,       label:'Browse Jobs',       color:'text-primary',  bg:'bg-primary/10'},
                {to:'/applicant/resume',      icon:HiDocumentArrowUp, label:hasResume?'Replace Resume':'Upload Resume', color:hasResume?'text-success':'text-error', bg:hasResume?'bg-success/10':'bg-error/10'},
                {to:'/applicant/profile',     icon:HiUser,            label:'Edit Profile',      color:'text-info',     bg:'bg-info/10'},
                {to:'/applicant/applications',icon:HiChartBarSquare,  label:'My Applications',   color:'text-warning',  bg:'bg-warning/10'},
              ].map(a=>(
                <Link key={a.to} to={a.to} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-hover transition-colors group">
                  <div className={`w-7 h-7 rounded-lg ${a.bg} flex items-center justify-center shrink-0`}>
                    <a.icon className={`w-3.5 h-3.5 ${a.color}`}/>
                  </div>
                  <span className="text-xs text-text-secondary group-hover:text-text transition-colors">{a.label}</span>
                  <HiArrowRight className="w-3 h-3 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity"/>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApplicantDashboard;
