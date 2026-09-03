import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiUser, HiPhone, HiMapPin, HiBriefcase, HiSparkles, HiCheckCircle, HiPencil, HiXMark, HiPlus, HiDocumentArrowUp, HiArrowRight, HiGlobeAlt } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/services/user.service';
import { Avatar } from '@/components/common';
import { calcProfileCompletion, extractApplicantProfile } from '@/utils/profileCompletion';
import toast from 'react-hot-toast';

const ApplicantProfile = () => {
  const { user, loadUser } = useAuth();
  const queryClient = useQueryClient();
  const [editBasic, setEditBasic] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const { data: profileData, isLoading } = useQuery({ queryKey:['applicant','profile'], queryFn:()=>UserService.getProfile() });
  const applicant = extractApplicantProfile(profileData);
  const hasResume = !!(applicant?.resume||applicant?.resumeUrl);
  const { pct, steps } = calcProfileCompletion(user, applicant, hasResume);
  const pctColor = pct>=80?'text-success':pct>=50?'text-warning':'text-error';
  const barColor = pct>=80?'bg-success':pct>=50?'bg-warning':'bg-error';

  const { register, handleSubmit, reset, formState:{errors} } = useForm({
    values: { firstName:user?.firstName||'', lastName:user?.lastName||'', phone:applicant?.phone||user?.phone||'', location:applicant?.location||'', headline:applicant?.headline||'', bio:applicant?.bio||'', experienceLevel:applicant?.experienceLevel||'', linkedin:applicant?.linkedin||'', portfolio:applicant?.portfolio||'' },
  });

  const updateMutation = useMutation({
    mutationFn: d=>UserService.updateProfile(d),
    onSuccess:()=>{ queryClient.invalidateQueries({queryKey:['applicant','profile']}); loadUser(); toast.success('Profile updated'); setEditBasic(false); },
    onError: e=>toast.error(e.message||'Failed'),
  });

  const addSkill = (s) => {
    const sk=s.trim(); if(!sk)return;
    const cur=applicant?.skills||[];
    if(cur.includes(sk)){toast.error('Already added');return;}
    updateMutation.mutate({skills:[...cur,sk]}); setNewSkill('');
  };
  const removeSkill = (s) => updateMutation.mutate({skills:(applicant?.skills||[]).filter(x=>x!==s)});

  if(isLoading) return <div className="space-y-3 animate-pulse">{[...Array(3)].map((_,i)=><div key={i} className="h-28 bg-surface rounded-xl border border-border"/>)}</div>;

  return (
    <div className="page-enter space-y-4 max-w-2xl">
      {/* Profile header */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-start gap-3 mb-3">
          <Avatar firstName={user?.firstName} lastName={user?.lastName} size="lg" ring/>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-text truncate">{user?.firstName} {user?.lastName}</h1>
                {applicant?.headline && <p className="text-xs text-primary mt-0.5 truncate">{applicant.headline}</p>}
                <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
              </div>
              <button onClick={()=>setEditBasic(p=>!p)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-[11px] text-text-secondary hover:text-text hover:border-border-light transition-all shrink-0">
                <HiPencil className="w-3 h-3"/>{editBasic?'Cancel':'Edit'}
              </button>
            </div>
            {/* Completion bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-text-muted">Profile Strength</span>
                <span className={`text-[10px] font-bold ${pctColor}`}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{width:`${pct}%`}}/>
              </div>
            </div>
          </div>
        </div>

        {editBasic && (
          <form onSubmit={handleSubmit(d=>updateMutation.mutate(d))} className="space-y-3 pt-3 border-t border-border animate-fade-down">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">First Name <span className="text-error">*</span></label>
                <input className={`input-base ${errors.firstName?'error':''}`} {...register('firstName',{required:'Required'})}/>
                {errors.firstName&&<p className="mt-1 text-[11px] text-error">⚠ {errors.firstName.message}</p>}
              </div>
              <div>
                <label className="form-label">Last Name <span className="text-error">*</span></label>
                <input className={`input-base ${errors.lastName?'error':''}`} {...register('lastName',{required:'Required'})}/>
                {errors.lastName&&<p className="mt-1 text-[11px] text-error">⚠ {errors.lastName.message}</p>}
              </div>
              <div>
                <label className="form-label">Phone <span className="text-error">*</span></label>
                <div className="relative"><HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
                <input placeholder="+92 300 0000000" className={`input-base pl-9 ${errors.phone?'error':''}`} {...register('phone',{required:'Required'})}/>
                </div>
                {errors.phone&&<p className="mt-1 text-[11px] text-error">⚠ {errors.phone.message}</p>}
              </div>
              <div>
                <label className="form-label">Location</label>
                <div className="relative"><HiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
                <input placeholder="City, Country" className="input-base pl-9" {...register('location')}/></div>
              </div>
              <div className="col-span-2">
                <label className="form-label">Headline</label>
                <div className="relative"><HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
                <input placeholder="e.g. Senior React Developer" className="input-base pl-9" {...register('headline')}/></div>
              </div>
              <div>
                <label className="form-label">LinkedIn</label>
                <div className="relative"><HiGlobeAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
                <input placeholder="linkedin.com/in/you" className="input-base pl-9" {...register('linkedin')}/></div>
              </div>
              <div>
                <label className="form-label">Portfolio</label>
                <div className="relative"><HiGlobeAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
                <input placeholder="yoursite.com" className="input-base pl-9" {...register('portfolio')}/></div>
              </div>
              <div>
                <label className="form-label">Experience Level</label>
                <select className="input-base" {...register('experienceLevel')}>
                  <option value="">Select…</option>
                  {['entry','mid','senior','lead','executive'].map(l=><option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Bio / Summary</label>
                <textarea rows={2} placeholder="Short professional summary…" className="input-base resize-none" {...register('bio')}/>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={()=>{setEditBasic(false);reset();}} className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:bg-surface-hover transition-all">Cancel</button>
              <button type="submit" disabled={updateMutation.isPending} className="px-4 py-1.5 rounded-lg bg-gradient-primary text-white text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-all">
                {updateMutation.isPending?'Saving…':'Save'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Checklist */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <p className="text-xs font-bold text-text mb-3 flex items-center gap-1.5"><HiSparkles className="w-3.5 h-3.5 text-primary"/>Profile Checklist</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {steps.map(s=>(
            <div key={s.key} className="flex items-center gap-2">
              {s.done?<HiCheckCircle className="w-3.5 h-3.5 text-success shrink-0"/>:<div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${s.required?'border-error':'border-border'}`}/>}
              <span className={`text-[11px] ${s.done?'text-text-muted line-through':'text-text'}`}>{s.label}</span>
              {s.required&&!s.done&&<span className="text-[9px] font-bold text-error ml-auto">Req</span>}
              {s.key==='resume'&&!s.done&&<Link to="/applicant/resume" className="text-[10px] text-primary hover:underline ml-auto">Upload</Link>}
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-text flex items-center gap-1.5"><HiSparkles className="w-3.5 h-3.5 text-primary"/>Skills
            {(applicant?.skills?.length||0)<3&&<span className="text-[9px] font-bold text-error bg-error/10 border border-error/20 px-1.5 py-0.5 rounded-full ml-1">Add 3+</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(applicant?.skills||[]).map(s=>(
            <span key={s} className="skill-chip gap-1.5">{s}
              <button onClick={()=>removeSkill(s)} className="hover:text-error transition-colors"><HiXMark className="w-3 h-3"/></button>
            </span>
          ))}
          {!(applicant?.skills?.length)&&<p className="text-[11px] text-text-muted">No skills added</p>}
        </div>
        <div className="flex gap-2">
          <input value={newSkill} onChange={e=>setNewSkill(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();addSkill(newSkill);}}}
            placeholder="Type skill + Enter…" className="input-base flex-1 text-xs"/>
          <button onClick={()=>addSkill(newSkill)} disabled={!newSkill.trim()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium hover:bg-primary/20 disabled:opacity-50 transition-all">
            <HiPlus className="w-3.5 h-3.5"/>Add
          </button>
        </div>
      </div>

      {/* Resume */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${hasResume?'bg-success/5 border-success/20':'bg-error/5 border-error/20'}`}>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${hasResume?'bg-success/15':'bg-error/10'}`}>
          <HiDocumentArrowUp className={`w-4 h-4 ${hasResume?'text-success':'text-error'}`}/>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-text">Resume</p>
          <p className="text-[11px] text-text-muted">{hasResume?`Uploaded · ${applicant?.resumeOriginalName||'resume.pdf'}`:'Required to apply for jobs'}</p>
        </div>
        <Link to="/applicant/resume" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-primary text-white text-[11px] font-bold shadow-glow-sm hover:opacity-90 transition-all shrink-0">
          {hasResume?'Replace':'Upload'}<HiArrowRight className="w-3 h-3"/>
        </Link>
      </div>
    </div>
  );
};
export default ApplicantProfile;
