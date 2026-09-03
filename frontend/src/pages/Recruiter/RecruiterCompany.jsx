import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiBuildingOffice2, HiEnvelope, HiGlobeAlt, HiMapPin, HiPencil, HiCheckCircle, HiClock, HiXCircle, HiLockClosed, HiExclamationTriangle, HiInformationCircle, HiSparkles, HiArrowRight } from 'react-icons/hi2';
import CompanyService from '@/services/company.service';
import { COMPANY_SIZES } from '@/constants';
import toast from 'react-hot-toast';

const INDUSTRIES = ['Technology','Finance','Healthcare','Education','Retail','Manufacturing','Consulting','Media','E-Commerce','Other'];
const REQUIRED = ['name','email','industry','size','location','description'];

const STATUS_CFG = {
  pending:  {icon:HiClock,     label:'Pending Approval', color:'text-warning', bg:'bg-warning/10', border:'border-warning/20'},
  approved: {icon:HiCheckCircle,label:'Approved',         color:'text-success', bg:'bg-success/10', border:'border-success/20'},
  rejected: {icon:HiXCircle,   label:'Rejected',          color:'text-error',   bg:'bg-error/10',   border:'border-error/20'},
  suspended:{icon:HiExclamationTriangle,label:'Suspended',color:'text-text-muted',bg:'bg-surface-elevated',border:'border-border'},
};

const RecruiterCompany = () => {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey:['recruiter','company'], queryFn:CompanyService.getMyCompany });
  const company = data?.data?.company;
  const isApproved = company?.status==='approved';
  const sc = STATUS_CFG[company?.status]||STATUS_CFG.pending;
  const SIcon = sc.icon;

  const completionSteps = [
    {key:'name',        label:'Company name',   done:!!company?.name,                            required:true},
    {key:'email',       label:'Company email',  done:!!company?.email,                           required:true},
    {key:'industry',    label:'Industry',       done:!!company?.industry,                        required:true},
    {key:'size',        label:'Company size',   done:!!company?.size,                            required:true},
    {key:'location',    label:'Location',       done:!!company?.location,                        required:true},
    {key:'description', label:'Description',    done:!!(company?.description?.length>=30),       required:true},
    {key:'website',     label:'Website',        done:!!company?.website,                         required:false},
  ];
  const pct = Math.round((completionSteps.filter(s=>s.done).length/completionSteps.length)*100);
  const requiredMissing = completionSteps.filter(s=>s.required&&!s.done);

  const { register, handleSubmit, formState:{errors} } = useForm({
    values: company ? { name:company.name||'', email:company.email||'', website:company.website||'', industry:company.industry||'', size:company.size||'', location:company.location||'', description:company.description||'' } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: d=>CompanyService.updateMyCompany(d),
    onSuccess:()=>{ queryClient.invalidateQueries({queryKey:['recruiter','company']}); toast.success('Company updated'); setEditing(false); },
    onError: e=>toast.error(e.message||'Failed'),
  });

  const onSubmit = (data) => {
    const missing=REQUIRED.filter(f=>!data[f]?.trim());
    if(missing.length){toast.error(`Fill required fields: ${missing.join(', ')}`);return;}
    if(data.description?.length<30){toast.error('Description min 30 characters');return;}
    updateMutation.mutate(data);
  };

  if(isLoading) return <div className="space-y-3 animate-pulse">{[...Array(3)].map((_,i)=><div key={i} className="h-24 bg-surface rounded-xl border border-border"/>)}</div>;

  return (
    <div className="page-enter space-y-4 max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Company Profile</h1>
          <p className="text-xs text-text-secondary mt-0.5">Manage your company details and approval status</p>
        </div>
        {!editing&&<button onClick={()=>setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-text hover:border-border-light transition-all"><HiPencil className="w-3.5 h-3.5"/>Edit</button>}
      </div>

      {/* Status */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${sc.bg} ${sc.border}`}>
        <div className={`w-9 h-9 rounded-lg ${sc.bg} border ${sc.border} flex items-center justify-center shrink-0`}>
          <SIcon className={`w-4 h-4 ${sc.color}`}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold ${sc.color}`}>{sc.label}</span>
            {isApproved&&<span className="text-[9px] font-bold text-success bg-success/15 border border-success/20 px-1.5 py-0.5 rounded-full">✓ VERIFIED</span>}
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {company?.status==='pending'&&'Under review by admin team. Usually 1–2 business days.'}
            {company?.status==='approved'&&'Verified and approved. You can now post jobs.'}
            {company?.status==='rejected'&&`Registration rejected. ${company.rejectionReason?`Reason: ${company.rejectionReason}`:''}`}
            {company?.status==='suspended'&&'Account suspended. Contact support.'}
          </p>
          {!isApproved&&company?.status!=='rejected'&&(
            <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1"><HiInformationCircle className="w-3 h-3"/>Cannot post jobs until approved</p>
          )}
        </div>
      </div>

      {/* Completion */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-text flex items-center gap-1.5"><HiSparkles className="w-3.5 h-3.5 text-primary"/>Profile Completeness</p>
          <span className={`text-xs font-bold ${pct===100?'text-success':pct>=70?'text-warning':'text-error'}`}>{pct}%</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
          <div className={`h-full rounded-full transition-all duration-700 ${pct===100?'bg-success':pct>=70?'bg-warning':'bg-error'}`} style={{width:`${pct}%`}}/>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {completionSteps.map(s=>(
            <div key={s.key} className="flex items-center gap-1.5">
              {s.done?<HiCheckCircle className="w-3.5 h-3.5 text-success shrink-0"/>:<div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${s.required?'border-error':'border-border'}`}/>}
              <span className={`text-[11px] ${s.done?'text-text-muted line-through':'text-text'}`}>{s.label}</span>
              {s.required&&!s.done&&<span className="text-[9px] font-bold text-error ml-auto">Req</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shrink-0">
            <HiBuildingOffice2 className="w-5 h-5 text-text-muted"/>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text truncate">{company?.name||'Your Company'}</p>
            <p className="text-[11px] text-text-muted">{company?.industry||'Industry not set'}</p>
          </div>
        </div>

        {isApproved&&(
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-warning/8 border border-warning/15 mb-4">
            <HiLockClosed className="w-3.5 h-3.5 text-warning shrink-0"/>
            <p className="text-[11px] text-warning">Company name and email are <strong>locked after approval</strong> for security</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Company Name <span className="text-error">*</span>{isApproved&&<HiLockClosed className="w-3 h-3 text-warning inline ml-1"/>}</label>
              <div className="relative"><HiBuildingOffice2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
              <input placeholder="Acme Corporation" disabled={!editing||isApproved} className={`input-base pl-9 ${!editing||isApproved?'opacity-60 cursor-not-allowed':''} ${errors.name?'error':''}`} {...register('name',{required:'Required'})}/>
              </div>
              {errors.name&&<p className="mt-1 text-[11px] text-error">⚠ {errors.name.message}</p>}
            </div>
            <div>
              <label className="form-label">Company Email <span className="text-error">*</span>{isApproved&&<HiLockClosed className="w-3 h-3 text-warning inline ml-1"/>}</label>
              <div className="relative"><HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
              <input type="email" placeholder="hr@company.com" disabled={!editing||isApproved} className={`input-base pl-9 ${!editing||isApproved?'opacity-60 cursor-not-allowed':''} ${errors.email?'error':''}`} {...register('email',{required:'Required',pattern:{value:/^\S+@\S+$/i,message:'Invalid'}})}/>
              </div>
              {errors.email&&<p className="mt-1 text-[11px] text-error">⚠ {errors.email.message}</p>}
            </div>
            <div>
              <label className="form-label">Website</label>
              <div className="relative"><HiGlobeAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
              <input placeholder="https://yourcompany.com" disabled={!editing} className={`input-base pl-9 ${!editing?'opacity-60 cursor-not-allowed':''}`} {...register('website')}/>
              </div>
            </div>
            <div>
              <label className="form-label">Industry <span className="text-error">*</span></label>
              <select disabled={!editing} className={`input-base ${!editing?'opacity-60 cursor-not-allowed':''} ${errors.industry?'error':''}`} {...register('industry',{required:'Required'})}>
                <option value="">Select…</option>
                {INDUSTRIES.map(i=><option key={i} value={i.toLowerCase()}>{i}</option>)}
              </select>
              {errors.industry&&<p className="mt-1 text-[11px] text-error">⚠ {errors.industry.message}</p>}
            </div>
            <div>
              <label className="form-label">Company Size <span className="text-error">*</span></label>
              <select disabled={!editing} className={`input-base ${!editing?'opacity-60 cursor-not-allowed':''} ${errors.size?'error':''}`} {...register('size',{required:'Required'})}>
                <option value="">Select…</option>
                {COMPANY_SIZES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {errors.size&&<p className="mt-1 text-[11px] text-error">⚠ {errors.size.message}</p>}
            </div>
            <div>
              <label className="form-label">Location <span className="text-error">*</span></label>
              <div className="relative"><HiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"/>
              <input placeholder="City, Country" disabled={!editing} className={`input-base pl-9 ${!editing?'opacity-60 cursor-not-allowed':''} ${errors.location?'error':''}`} {...register('location',{required:'Required'})}/>
              </div>
              {errors.location&&<p className="mt-1 text-[11px] text-error">⚠ {errors.location.message}</p>}
            </div>
          </div>
          <div>
            <label className="form-label">Description <span className="text-error">*</span> <span className="text-text-muted font-normal">(min 30 chars)</span></label>
            <textarea rows={3} placeholder="Tell candidates about your company culture and mission…" disabled={!editing}
              className={`input-base resize-none ${!editing?'opacity-60 cursor-not-allowed':''} ${errors.description?'error':''}`}
              {...register('description',{required:'Required',minLength:{value:30,message:'Min 30 characters'}})}/>
            {errors.description&&<p className="mt-1 text-[11px] text-error">⚠ {errors.description.message}</p>}
          </div>
          {editing&&(
            <>
              {requiredMissing.length>0&&(
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-error/8 border border-error/15">
                  <HiExclamationTriangle className="w-3.5 h-3.5 text-error shrink-0"/>
                  <p className="text-[11px] text-error">Missing: {requiredMissing.map(f=>f.label).join(', ')}</p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={()=>setEditing(false)} className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:bg-surface-hover transition-all">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-primary text-white text-xs font-semibold shadow-glow-sm hover:opacity-90 disabled:opacity-60 transition-all">
                  {updateMutation.isPending?'Saving…':<>Save Changes<HiArrowRight className="w-3.5 h-3.5"/></>}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
export default RecruiterCompany;
