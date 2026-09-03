import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiArrowRight, HiXCircle, HiSparkles, HiCheckCircle, HiCalendarDays, HiGift, HiClock, HiMagnifyingGlass } from 'react-icons/hi2';
import api from '@/services/api';
import { Avatar } from '@/components/common';
import { capitalize } from '@/utils';
import toast from 'react-hot-toast';

const STAGES = [
  {key:'applied',     label:'Applied',     icon:HiClock,        color:'text-info',    headerBg:'bg-info/10',     dot:'bg-info',    border:'border-info/20'},
  {key:'shortlisted', label:'Shortlisted', icon:HiCheckCircle,  color:'text-primary', headerBg:'bg-primary/10',  dot:'bg-primary', border:'border-primary/20'},
  {key:'interview',   label:'Interview',   icon:HiCalendarDays, color:'text-warning', headerBg:'bg-warning/10',  dot:'bg-warning', border:'border-warning/20'},
  {key:'offered',     label:'Offered',     icon:HiGift,         color:'text-success', headerBg:'bg-success/10',  dot:'bg-success', border:'border-success/20'},
  {key:'rejected',    label:'Rejected',    icon:HiXCircle,      color:'text-error',   headerBg:'bg-error/10',    dot:'bg-error',   border:'border-error/20'},
];
const ORDER = ['applied','shortlisted','interview','offered'];
const getNext = (cur) => { const i=ORDER.indexOf(cur); return i>=0&&i<ORDER.length-1?ORDER[i+1]:null; };

const RecruiterPipeline = () => {
  const [jobFilter, setJobFilter] = useState('');
  const [search, setSearch]       = useState('');
  const queryClient = useQueryClient();

  const { data: jobsData }     = useQuery({ queryKey:['pipeline','jobs'], queryFn:()=>api.get('/pipeline/jobs') });
  const { data: pipelineData, isLoading } = useQuery({ queryKey:['pipeline',{jobId:jobFilter}], queryFn:()=>api.get('/pipeline',{params:jobFilter?{jobId:jobFilter}:{}}) });

  const moveMutation = useMutation({
    mutationFn:({appId,status})=>api.put(`/pipeline/${appId}/move`,{status}),
    onSuccess:()=>{ queryClient.invalidateQueries({queryKey:['pipeline']}); queryClient.invalidateQueries({queryKey:['recruiter']}); toast.success('Moved'); },
    onError:e=>toast.error(e.message||'Failed'),
  });

  const jobs     = jobsData?.data?.jobs||[];
  const pipeline = pipelineData?.data?.pipeline||{};
  const total    = STAGES.reduce((a,s)=>a+(pipeline[s.key]?.length||0),0);

  const filter = (apps) => {
    if(!search)return apps;
    const q=search.toLowerCase();
    return apps.filter(a=>a.applicant?.firstName?.toLowerCase().includes(q)||a.applicant?.lastName?.toLowerCase().includes(q)||a.job?.title?.toLowerCase().includes(q));
  };

  return (
    <div className="page-enter space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Hiring Pipeline</h1>
          <p className="text-xs text-text-secondary mt-0.5">{total} candidates across all stages</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted"/>
          <input type="text" placeholder="Search candidate…" value={search} onChange={e=>setSearch(e.target.value)} className="input-base pl-9 text-xs"/>
        </div>
        <select value={jobFilter} onChange={e=>setJobFilter(e.target.value)} className="input-base text-xs w-auto min-w-[160px]">
          <option value="">All Jobs</option>
          {jobs.map(j=><option key={j._id} value={j._id}>{j.title} ({j.totalApplications})</option>)}
        </select>
      </div>

      {/* Kanban — horizontal scroll on mobile */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STAGES.map(s=><div key={s.key} className="h-48 bg-surface rounded-xl border border-border skeleton-pulse"/>)}
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-[900px] lg:min-w-0 lg:grid lg:grid-cols-5">
            {STAGES.map(stage=>{
              const apps=filter(pipeline[stage.key]||[]);
              const SIcon=stage.icon;
              return (
                <div key={stage.key} className="flex flex-col w-44 sm:w-auto lg:w-auto shrink-0 lg:shrink">
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-2 ${stage.headerBg} border ${stage.border}`}>
                    <div className="flex items-center gap-1.5">
                      <SIcon className={`w-3.5 h-3.5 ${stage.color}`}/>
                      <span className={`text-xs font-bold ${stage.color}`}>{stage.label}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-background/50 ${stage.color}`}>{apps.length}</span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2 flex-1 min-h-[120px]">
                    {apps.length===0 ? (
                      <div className="flex flex-col items-center justify-center flex-1 min-h-[80px] rounded-xl border border-dashed border-border">
                        <div className={`w-1.5 h-1.5 rounded-full ${stage.dot} opacity-40 mb-1`}/>
                        <p className="text-[10px] text-text-muted">Empty</p>
                      </div>
                    ) : (
                      apps.map((app,i)=>(
                        <div key={app._id} className="p-2.5 rounded-xl bg-surface border border-border hover:border-border-light hover:shadow-card transition-all card-shimmer animate-fade-up" style={{animationDelay:`${i*0.04}s`}}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Avatar firstName={app.applicant?.firstName} lastName={app.applicant?.lastName} size="sm"/>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-semibold text-text truncate">{app.applicant?.firstName} {app.applicant?.lastName}</p>
                              <p className="text-[10px] text-text-muted truncate">{app.job?.title}</p>
                            </div>
                          </div>
                          {/* Score bar */}
                          {app.aiScore!=null&&(
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${app.aiScore>=70?'bg-success':app.aiScore>=40?'bg-warning':'bg-error'}`} style={{width:`${app.aiScore}%`}}/>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                <HiSparkles className="w-2.5 h-2.5 text-primary"/>
                                <span className={`text-[10px] font-bold ${app.aiScore>=70?'text-success':app.aiScore>=40?'text-warning':'text-error'}`}>{app.aiScore}%</span>
                              </div>
                            </div>
                          )}
                          {/* Actions */}
                          {stage.key!=='rejected'&&stage.key!=='offered'&&(
                            <div className="flex flex-col gap-1">
                              {getNext(stage.key)&&(
                                <button onClick={()=>moveMutation.mutate({appId:app._id,status:getNext(stage.key)})} disabled={moveMutation.isPending}
                                  className={`w-full flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded-lg transition-all ${stage.key==='applied'?'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20':stage.key==='shortlisted'?'bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20':'bg-success/10 text-success hover:bg-success/20 border border-success/20'}`}>
                                  → {capitalize(getNext(stage.key))}
                                </button>
                              )}
                              <button onClick={()=>moveMutation.mutate({appId:app._id,status:'rejected'})} disabled={moveMutation.isPending}
                                className="w-full text-[10px] text-error/70 hover:text-error hover:bg-error/10 py-0.5 rounded-lg transition-all">
                                Reject
                              </button>
                            </div>
                          )}
                          {stage.key==='offered'&&(
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-success/10 border border-success/20">
                              <HiGift className="w-3 h-3 text-success"/><span className="text-[10px] font-semibold text-success">Offered</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default RecruiterPipeline;
