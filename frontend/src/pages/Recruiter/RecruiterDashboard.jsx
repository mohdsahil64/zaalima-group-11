import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiBriefcase, HiDocumentText, HiUsers, HiCalendarDays, HiGift, HiArrowRight, HiSparkles, HiPlus, HiViewColumns } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import ApplicationService from '@/services/application.service';
import JobService from '@/services/job.service';
import { Badge } from '@/components/common';
import { formatDate } from '@/utils';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const { data: statsData, isLoading } = useQuery({ queryKey:['recruiter','stats'], queryFn:()=>ApplicationService.getRecruiterStats() });
  const { data: jobsData } = useQuery({ queryKey:['recruiter','jobs',{limit:5}], queryFn:()=>JobService.getMyJobs({limit:5}) });

  const stats = statsData?.data?.stats || {};
  const jobs  = jobsData?.data || [];
  const activeJobs = jobs.filter(j=>j.status==='open').length;

  const funnel = [
    {label:'Applied',    value:stats.applied||0,    color:'bg-info',    text:'text-info'},
    {label:'Shortlisted',value:stats.shortlisted||0,color:'bg-primary',  text:'text-primary'},
    {label:'Interview',  value:stats.interview||0,  color:'bg-warning', text:'text-warning'},
    {label:'Offered',    value:stats.offered||0,    color:'bg-success', text:'text-success'},
    {label:'Rejected',   value:stats.rejected||0,   color:'bg-error',   text:'text-error'},
  ];

  if (isLoading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-surface-elevated rounded"/>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">{[...Array(5)].map((_,i)=><div key={i} className="h-20 bg-surface rounded-xl border border-border"/>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><div className="lg:col-span-2 h-52 bg-surface rounded-xl border border-border"/><div className="h-52 bg-surface rounded-xl border border-border"/></div>
    </div>
  );

  return (
    <div className="page-enter space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-text">
            {new Date().getHours()<12?'Good morning':new Date().getHours()<18?'Good afternoon':'Good evening'}, {user?.firstName}! 👋
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">Hiring pipeline overview</p>
        </div>
        <Link to="/recruiter/jobs/create" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-primary text-white text-xs font-semibold shadow-glow-sm hover:opacity-90 transition-all shrink-0">
          <HiPlus className="w-3.5 h-3.5"/> Post Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          {label:'Active Jobs',   value:activeJobs,          icon:HiBriefcase,    color:'text-primary', bg:'bg-primary/10', border:'border-primary/15'},
          {label:'Applications',  value:stats.total||0,      icon:HiDocumentText, color:'text-info',    bg:'bg-info/10',    border:'border-info/15'},
          {label:'Shortlisted',   value:stats.shortlisted||0,icon:HiUsers,        color:'text-accent',  bg:'bg-accent/10',  border:'border-accent/15'},
          {label:'Interviews',    value:stats.interview||0,  icon:HiCalendarDays, color:'text-warning', bg:'bg-warning/10', border:'border-warning/15'},
          {label:'Offers Sent',   value:stats.offered||0,    icon:HiGift,         color:'text-success', bg:'bg-success/10', border:'border-success/15'},
        ].map((c,i)=>(
          <div key={c.label} className={`stat-card p-3 rounded-xl bg-surface border ${c.border} hover:-translate-y-px transition-all animate-fade-up`} style={{animationDelay:`${i*0.05}s`}}>
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
        {/* Jobs list */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-text">Active Jobs</p>
            <Link to="/recruiter/jobs" className="text-xs text-primary hover:text-primary-light transition-colors">View all →</Link>
          </div>
          {jobs.length===0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HiBriefcase className="w-8 h-8 text-text-muted mb-2"/>
              <p className="text-xs text-text-muted mb-2">No jobs posted yet</p>
              <Link to="/recruiter/jobs/create" className="text-xs text-primary hover:underline">Post a job →</Link>
            </div>
          ) : (
            <div className="space-y-1">
              {jobs.map((job,i)=>(
                <Link key={job._id} to={`/recruiter/jobs/${job._id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors group animate-fade-up"
                  style={{animationDelay:`${i*0.04}s`}}>
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                    <HiBriefcase className="w-3.5 h-3.5 text-text-muted"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate group-hover:text-primary transition-colors">{job.title}</p>
                    <p className="text-[11px] text-text-muted">{job.totalApplications||0} applications · {formatDate(job.createdAt)}</p>
                  </div>
                  {/* mini bar */}
                  <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                    <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{width:`${Math.min(((job.totalApplications||0)/10)*100,100)}%`}}/>
                    </div>
                  </div>
                  <Badge variant={job.status==='open'?'success':'default'} size="sm" dot pulse={job.status==='open'}>
                    {job.status==='open'?'Live':'Draft'}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-3">
          {/* Funnel */}
          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-text">Hiring Funnel</p>
              <Link to="/recruiter/pipeline" className="text-[11px] text-primary hover:underline">Pipeline →</Link>
            </div>
            <div className="space-y-2">
              {funnel.map(item=>{
                const pct = stats.total>0 ? Math.round((item.value/stats.total)*100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}/>
                        <span className="text-[11px] text-text-secondary">{item.label}</span>
                      </div>
                      <span className={`text-[11px] font-bold ${item.text}`}>{item.value} <span className="text-text-muted font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{width:`${pct}%`}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="p-4 rounded-xl bg-surface border border-border">
            <p className="text-xs font-bold text-text mb-2">Quick Actions</p>
            <div className="space-y-1">
              {[
                {to:'/recruiter/jobs/create',  icon:HiPlus,         label:'Post New Job',       color:'text-primary', bg:'bg-primary/10'},
                {to:'/recruiter/applications', icon:HiDocumentText, label:'Review Applications', color:'text-info',    bg:'bg-info/10'},
                {to:'/recruiter/pipeline',     icon:HiViewColumns,  label:'Open Pipeline',      color:'text-warning', bg:'bg-warning/10'},
                {to:'/recruiter/candidates',   icon:HiUsers,        label:'Browse Candidates',  color:'text-success', bg:'bg-success/10'},
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

      {/* AI banner */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
          <HiSparkles className="w-4 h-4 text-primary"/>
        </div>
        <p className="text-xs text-text-secondary flex-1">
          <span className="font-semibold text-text">AI Insight: </span>
          {stats.shortlisted>0 ? `${stats.shortlisted} shortlisted candidates are waiting for your review.` : 'Once candidates apply, AI will automatically score and rank them.'}
        </p>
        <Link to="/recruiter/applications" className="text-xs text-primary font-semibold hover:underline shrink-0 whitespace-nowrap">Review →</Link>
      </div>
    </div>
  );
};
export default RecruiterDashboard;
