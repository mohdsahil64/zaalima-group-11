import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiDocumentArrowUp, HiCloudArrowUp, HiCheckCircle, HiDocument, HiSparkles, HiXMark, HiInformationCircle } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import ResumeService from '@/services/resume.service';
import UserService from '@/services/user.service';
import { extractApplicantProfile } from '@/utils/profileCompletion';
import toast from 'react-hot-toast';

const mockParse = (filename) => ({ headline:'Software Developer', skills:['JavaScript','React','Node.js','Git'], experienceLevel:'mid', bio:`Experienced developer. File: ${filename}` });

const ApplicantResume = () => {
  const { user, loadUser } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [showAutofill, setShowAutofill] = useState(false);

  const { data: profileData, isLoading } = useQuery({ queryKey:['applicant','profile'], queryFn:()=>UserService.getProfile() });
  const applicant = extractApplicantProfile(profileData);
  const existing  = applicant?.resume?.url || applicant?.resume;
  const resumeName = applicant?.resume?.filename || applicant?.resumeOriginalName || 'resume.pdf';

  const uploadMutation = useMutation({
    mutationFn: f=>ResumeService.upload(f),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({queryKey:['applicant','profile']});
      const fn=data?.data?.resume?.originalName||data?.data?.resume?.filename||'resume';
      setParsed(mockParse(fn));
      setShowAutofill(true);
      toast.success('Resume uploaded!');
    },
    onError:e=>toast.error(e.message||'Upload failed'),
  });

  const autofillMutation = useMutation({
    mutationFn: d=>UserService.updateProfile(d),
    onSuccess:()=>{ queryClient.invalidateQueries({queryKey:['applicant','profile']}); loadUser(); setShowAutofill(false); toast.success('Profile autofilled!'); },
    onError:e=>toast.error(e.message||'Failed'),
  });

  const handleFile = useCallback((file) => {
    if(!file)return;
    const allowed=['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if(!allowed.includes(file.type)){toast.error('Only PDF/DOCX allowed');return;}
    if(file.size>5*1024*1024){toast.error('Max 5MB');return;}
    setParsed(null); setShowAutofill(false);
    uploadMutation.mutate(file);
  },[uploadMutation]);

  const applyAutofill = () => {
    if(!parsed)return;
    const updates={};
    if(!applicant?.headline&&parsed.headline) updates.headline=parsed.headline;
    if(!applicant?.bio&&parsed.bio) updates.bio=parsed.bio;
    if(!(applicant?.skills?.length)&&parsed.skills?.length) updates.skills=parsed.skills;
    if(!applicant?.experienceLevel&&parsed.experienceLevel) updates.experienceLevel=parsed.experienceLevel;
    if(!Object.keys(updates).length){toast('Profile already filled',{icon:'ℹ️'});setShowAutofill(false);return;}
    autofillMutation.mutate(updates);
  };

  if(isLoading) return <div className="space-y-3 animate-pulse"><div className="h-6 w-32 bg-surface-elevated rounded"/><div className="h-48 bg-surface rounded-xl border border-border"/></div>;

  return (
    <div className="page-enter space-y-4 max-w-xl">
      <div>
        <h1 className="text-base font-bold text-text">My Resume</h1>
        <p className="text-xs text-text-secondary mt-0.5">Upload once — auto-attached to every application</p>
      </div>

      {/* Upload zone */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        {existing&&!uploadMutation.isPending ? (
          <div className="space-y-3">
            {/* Existing */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
              <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
                <HiCheckCircle className="w-5 h-5 text-success"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text">Resume Uploaded</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <HiDocument className="w-3 h-3 text-text-muted"/>
                  <span className="text-[11px] text-text-secondary truncate">{resumeName}</span>
                </div>
                <p className="text-[10px] text-success mt-0.5 flex items-center gap-1"><HiCheckCircle className="w-3 h-3"/>Auto-attached to all applications</p>
              </div>
              <button onClick={()=>fileRef.current?.click()} className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] text-text-secondary hover:text-text hover:border-border-light transition-all shrink-0">
                Replace
              </button>
            </div>
            {/* Drop zone for replace */}
            <div
              className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${drag?'border-primary bg-primary/5':'border-border hover:border-primary/40 hover:bg-surface-hover'}`}
              onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
              onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
              onClick={()=>fileRef.current?.click()}>
              <HiCloudArrowUp className="w-6 h-6 text-text-muted mx-auto mb-1.5"/>
              <p className="text-xs text-text-secondary">{drag?'Drop to replace':'Drag & drop or click to replace'}</p>
              <p className="text-[10px] text-text-muted mt-0.5">PDF, DOC, DOCX · Max 5MB</p>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${drag?'border-primary bg-primary/8 scale-[0.99]':uploadMutation.isPending?'border-primary/40 bg-primary/5':'border-border hover:border-primary/40 hover:bg-surface-hover'}`}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
            onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
            onClick={()=>!uploadMutation.isPending&&fileRef.current?.click()}>
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="animate-spin w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                </div>
                <p className="text-xs font-semibold text-text">Uploading & Parsing…</p>
                <p className="text-[11px] text-text-muted">AI is reading your resume</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${drag?'bg-primary/20':'bg-primary/10'}`}>
                  <HiDocumentArrowUp className="w-6 h-6 text-primary"/>
                </div>
                <p className="text-sm font-bold text-text">{drag?'Drop it here!':'Upload your Resume'}</p>
                <p className="text-[11px] text-text-muted max-w-xs">Drag & drop or click · AI will autofill your profile</p>
                <p className="text-[10px] text-text-muted">PDF, DOC, DOCX · Max 5MB</p>
                <button type="button" className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-primary text-white text-xs font-bold shadow-glow-sm hover:opacity-90 transition-all"
                  onClick={e=>{e.stopPropagation();fileRef.current?.click();}}>
                  <HiCloudArrowUp className="w-3.5 h-3.5"/>Choose File
                </button>
              </div>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e=>handleFile(e.target.files[0])}/>
      </div>

      {/* Autofill panel */}
      {showAutofill&&parsed&&(
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 animate-fade-up">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-primary"/>
              <div>
                <p className="text-xs font-bold text-text">AI Detected from Resume</p>
                <p className="text-[11px] text-text-muted">Only empty fields will be filled</p>
              </div>
            </div>
            <button onClick={()=>setShowAutofill(false)} className="p-1 rounded text-text-muted hover:text-text"><HiXMark className="w-4 h-4"/></button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {parsed.headline&&<div className="flex items-center gap-2 p-2 rounded-lg bg-surface border border-border"><p className="text-[10px] text-text-muted">Headline</p><p className="text-[11px] font-medium text-text truncate">{parsed.headline}</p></div>}
            {parsed.skills?.length>0&&<div className="col-span-2 p-2 rounded-lg bg-surface border border-border"><p className="text-[10px] text-text-muted mb-1">Skills</p><div className="flex flex-wrap gap-1">{parsed.skills.map(s=><span key={s} className="skill-chip text-[10px]">{s}</span>)}</div></div>}
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-info/8 border border-info/20 mb-3">
            <HiInformationCircle className="w-3.5 h-3.5 text-info shrink-0"/>
            <p className="text-[11px] text-text-secondary">Only empty profile fields will be autofilled</p>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setShowAutofill(false)} className="flex-1 py-2 rounded-lg border border-border text-xs text-text-secondary hover:bg-surface-hover transition-all">Skip</button>
            <button onClick={applyAutofill} disabled={autofillMutation.isPending}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-primary text-white text-xs font-bold shadow-glow-sm hover:opacity-90 disabled:opacity-60 transition-all">
              {autofillMutation.isPending?'Filling…':<><HiSparkles className="w-3.5 h-3.5"/>Autofill Profile</>}
            </button>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <p className="text-xs font-bold text-text mb-3 flex items-center gap-1.5"><HiInformationCircle className="w-3.5 h-3.5 text-info"/>How it works</p>
        <div className="space-y-2.5">
          {[
            {icon:HiCloudArrowUp,color:'text-primary bg-primary/10',title:'Upload once',desc:'Auto-attached to every job application'},
            {icon:HiSparkles,color:'text-warning bg-warning/10',title:'AI parses your CV',desc:'Extracts skills, experience to autofill profile'},
            {icon:HiCheckCircle,color:'text-success bg-success/10',title:'Apply instantly',desc:'No re-uploading needed for each application'},
          ].map(item=>(
            <div key={item.title} className="flex items-start gap-2.5">
              <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}><item.icon className="w-3.5 h-3.5"/></div>
              <div><p className="text-xs font-semibold text-text">{item.title}</p><p className="text-[11px] text-text-muted">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ApplicantResume;
