import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  HiLockClosed, HiEye, HiEyeSlash,
  HiBell, HiShieldCheck, HiTrash,
  HiCheckCircle, HiSparkles, HiArrowRight,
  HiExclamationTriangle,
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/services/user.service';
import { calcProfileCompletion, extractApplicantProfile } from '@/utils/profileCompletion';
import toast from 'react-hot-toast';

const Toggle = ({ defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn(p => !p)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${on ? 'bg-primary' : 'bg-border'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
};

const SectionHeader = ({ icon: Icon, iconBg, title, desc }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="text-xs text-text-muted">{desc}</p>
    </div>
  </div>
);

const ApplicantSettings = () => {
  const { user } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ['applicant', 'profile'],
    queryFn: () => UserService.getProfile(),
  });

  const applicant = extractApplicantProfile(profileData);
  const hasResume = !!(applicant?.resume || applicant?.resumeUrl);
  const { pct, steps } = calcProfileCompletion(user, applicant, hasResume);
  const pctColor = pct >= 80 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-error';
  const barColor = pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-error';

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const newPw = watch('newPassword');

  const changePwMutation = useMutation({
    mutationFn: (d) => UserService.changePassword(d),
    onSuccess: () => { toast.success('Password changed'); reset(); },
    onError: (e) => toast.error(e.message || 'Failed'),
  });

  return (
    <div className="page-enter space-y-4 max-w-xl">
      <div>
        <h1 className="text-lg font-bold text-text">Account Settings</h1>
        <p className="text-xs text-text-secondary mt-0.5">Manage your security and preferences</p>
      </div>

      {/* Profile completion */}
      <div className={`p-4 rounded-xl border ${pct === 100 ? 'bg-success/5 border-success/20' : pct >= 50 ? 'bg-warning/5 border-warning/20' : 'bg-error/5 border-error/20'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HiSparkles className={`w-3.5 h-3.5 ${pctColor}`} />
            <span className="text-xs font-semibold text-text">Profile Strength</span>
          </div>
          <span className={`text-xs font-bold ${pctColor}`}>{pct}%</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
        {pct < 100 ? (
          <div className="flex flex-wrap gap-1.5">
            {steps.filter(s => !s.done).slice(0, 3).map(s => (
              <span key={s.key} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${s.required ? 'bg-error/10 border-error/20 text-error' : 'bg-surface border-border text-text-muted'}`}>
                {s.required ? '⚠ ' : ''}{s.label}
              </span>
            ))}
            <Link to="/applicant/profile" className="text-[10px] text-primary font-semibold hover:underline ml-1 self-center">
              Complete →
            </Link>
          </div>
        ) : (
          <p className="text-[11px] text-success flex items-center gap-1"><HiCheckCircle className="w-3 h-3" /> Profile 100% complete</p>
        )}
      </div>

      {/* Change Password */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <SectionHeader icon={HiLockClosed} iconBg="bg-primary/10 text-primary" title="Change Password" desc="Keep your account secure" />
        <form onSubmit={handleSubmit(d => changePwMutation.mutate(d))} className="space-y-3">
          {[
            { name: 'currentPassword', label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(p => !p), rules: { required: 'Required' } },
            { name: 'newPassword', label: 'New Password', show: showNew, toggle: () => setShowNew(p => !p), rules: { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } } },
            { name: 'confirmPassword', label: 'Confirm Password', show: showConfirm, toggle: () => setShowConfirm(p => !p), rules: { required: 'Required', validate: v => v === newPw || "Passwords don't match" } },
          ].map(f => (
            <div key={f.name}>
              <label className="form-label">{f.label} <span className="text-error">*</span></label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input
                  type={f.show ? 'text' : 'password'}
                  className={`input-base pl-9 pr-9 ${errors[f.name] ? 'error' : ''}`}
                  {...register(f.name, f.rules)}
                />
                <button type="button" onClick={f.toggle} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
                  {f.show ? <HiEyeSlash className="w-3.5 h-3.5" /> : <HiEye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {f.name === 'newPassword' && newPw && (
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${newPw.length < 4 ? (i<=1?'bg-error':'bg-border') : newPw.length < 6 ? (i<=2?'bg-warning':'bg-border') : newPw.length < 10 ? (i<=3?'bg-info':'bg-border') : 'bg-success'}`} />
                  ))}
                </div>
              )}
              {errors[f.name] && <p className="mt-1 text-[11px] text-error">⚠ {errors[f.name].message}</p>}
            </div>
          ))}
          <button type="submit" disabled={changePwMutation.isPending}
            className="w-full py-2 rounded-lg bg-gradient-primary text-white text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-all mt-1">
            {changePwMutation.isPending ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <SectionHeader icon={HiBell} iconBg="bg-info/10 text-info" title="Notifications" desc="Choose what updates you receive" />
        <div className="space-y-2">
          {[
            { label: 'Application status updates', desc: 'When recruiter changes your status', on: true },
            { label: 'Interview invitations', desc: 'When you are invited for an interview', on: true },
            { label: 'New matching jobs', desc: 'Jobs that match your profile', on: false },
            { label: 'Offer letters', desc: 'When you receive a job offer', on: true },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <div className="min-w-0 mr-4">
                <p className="text-xs font-medium text-text">{n.label}</p>
                <p className="text-[11px] text-text-muted">{n.desc}</p>
              </div>
              <Toggle defaultOn={n.on} />
            </div>
          ))}
        </div>
      </div>

      {/* Account info */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <SectionHeader icon={HiShieldCheck} iconBg="bg-success/10 text-success" title="Account Info" desc="Read-only security details" />
        <div className="space-y-2">
          {[
            { label: 'Email', value: user?.email },
            { label: 'Account Type', value: 'Job Seeker' },
            { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
              <span className="text-[11px] text-text-muted">{item.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text">{item.value}</span>
                <HiLockClosed className="w-3 h-3 text-text-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="p-4 rounded-xl bg-error/5 border border-error/20">
        <SectionHeader icon={HiExclamationTriangle} iconBg="bg-error/10 text-error" title="Danger Zone" desc="Irreversible actions" />
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-error/30 text-xs font-medium text-error hover:bg-error/10 transition-all">
            <HiTrash className="w-3.5 h-3.5" /> Delete My Account
          </button>
        ) : (
          <div className="p-3 rounded-lg bg-error/10 border border-error/25 space-y-2">
            <p className="text-xs font-semibold text-error">This permanently deletes your account and all data.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:bg-surface-hover transition-all">Cancel</button>
              <button onClick={() => toast.error('Contact support to delete your account.')} className="flex-1 py-1.5 rounded-lg bg-error text-white text-xs font-bold hover:opacity-90 transition-all">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantSettings;
