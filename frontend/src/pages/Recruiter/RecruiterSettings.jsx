import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  HiLockClosed, HiEye, HiEyeSlash,
  HiBell, HiShieldCheck, HiTrash,
  HiUser, HiPencil, HiExclamationTriangle,
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/services/user.service';
import { Avatar } from '@/components/common';
import toast from 'react-hot-toast';

const Toggle = ({ defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button type="button" onClick={() => setOn(p => !p)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${on ? 'bg-primary' : 'bg-border'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
};

const RecruiterSettings = () => {
  const { user, loadUser } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, reset: resetProfile, formState: { errors: pErr } } = useForm({
    values: { firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' },
  });

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, watch, formState: { errors: pwErr } } = useForm();
  const newPw = watch('newPassword');

  const updateMutation = useMutation({
    mutationFn: d => UserService.updateProfile(d),
    onSuccess: () => { loadUser(); toast.success('Profile updated'); setEditProfile(false); },
    onError: e => toast.error(e.message || 'Failed'),
  });

  const changePwMutation = useMutation({
    mutationFn: d => UserService.changePassword(d),
    onSuccess: () => { toast.success('Password changed'); resetPw(); },
    onError: e => toast.error(e.message || 'Failed'),
  });

  return (
    <div className="page-enter space-y-4 max-w-xl">
      <div>
        <h1 className="text-lg font-bold text-text">Account Settings</h1>
        <p className="text-xs text-text-secondary mt-0.5">Manage your profile, security and preferences</p>
      </div>

      {/* Profile card */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar firstName={user?.firstName} lastName={user?.lastName} size="md" ring />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">Recruiter</span>
          </div>
          <button onClick={() => setEditProfile(p => !p)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-[11px] text-text-secondary hover:text-text hover:border-border-light transition-all shrink-0">
            <HiPencil className="w-3 h-3" />{editProfile ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {!editProfile ? (
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'First Name', value: user?.firstName },
              { label: 'Last Name',  value: user?.lastName },
              { label: 'Phone',      value: user?.phone || 'Not set' },
              { label: 'Email',      value: user?.email },
            ].map(item => (
              <div key={item.label} className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                <p className="text-[10px] text-text-muted mb-0.5">{item.label}</p>
                <p className="text-xs font-medium text-text truncate">{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleProfile(d => updateMutation.mutate(d))} className="space-y-3 animate-fade-down">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">First Name <span className="text-error">*</span></label>
                <input className={`input-base ${pErr.firstName ? 'error' : ''}`} {...regProfile('firstName', { required: 'Required' })} />
                {pErr.firstName && <p className="mt-1 text-[11px] text-error">⚠ {pErr.firstName.message}</p>}
              </div>
              <div>
                <label className="form-label">Last Name <span className="text-error">*</span></label>
                <input className={`input-base ${pErr.lastName ? 'error' : ''}`} {...regProfile('lastName', { required: 'Required' })} />
                {pErr.lastName && <p className="mt-1 text-[11px] text-error">⚠ {pErr.lastName.message}</p>}
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input placeholder="+92 300 0000000" className="input-base" {...regProfile('phone')} />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input value={user?.email} disabled className="input-base opacity-50 cursor-not-allowed" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setEditProfile(false); resetProfile(); }}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:bg-surface-hover transition-all">Cancel</button>
              <button type="submit" disabled={updateMutation.isPending}
                className="px-4 py-1.5 rounded-lg bg-gradient-primary text-white text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-all">
                {updateMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <HiLockClosed className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text">Change Password</p>
            <p className="text-[11px] text-text-muted">Keep your account secure</p>
          </div>
        </div>
        <form onSubmit={handlePw(d => changePwMutation.mutate(d))} className="space-y-3">
          {[
            { name: 'currentPassword', label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(p => !p), rules: { required: 'Required' } },
            { name: 'newPassword',     label: 'New Password',     show: showNew,     toggle: () => setShowNew(p => !p),     rules: { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } } },
            { name: 'confirmPassword', label: 'Confirm Password', show: showConfirm, toggle: () => setShowConfirm(p => !p), rules: { required: 'Required', validate: v => v === newPw || "Don't match" } },
          ].map(f => (
            <div key={f.name}>
              <label className="form-label">{f.label} <span className="text-error">*</span></label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input type={f.show ? 'text' : 'password'}
                  className={`input-base pl-9 pr-9 ${pwErr[f.name] ? 'error' : ''}`}
                  {...regPw(f.name, f.rules)} />
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
              {pwErr[f.name] && <p className="mt-1 text-[11px] text-error">⚠ {pwErr[f.name].message}</p>}
            </div>
          ))}
          <button type="submit" disabled={changePwMutation.isPending}
            className="w-full py-2 rounded-lg bg-gradient-primary text-white text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-all">
            {changePwMutation.isPending ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
            <HiBell className="w-3.5 h-3.5 text-info" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text">Notifications</p>
            <p className="text-[11px] text-text-muted">Manage hiring alerts</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: 'New applications', desc: 'When candidate applies to your job', on: true },
            { label: 'AI scoring complete', desc: 'When AI finishes analysing a resume', on: true },
            { label: 'Weekly report', desc: 'Pipeline summary every Monday', on: false },
            { label: 'Company approval', desc: 'Status changes to company profile', on: true },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <div className="min-w-0 mr-3">
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
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <HiShieldCheck className="w-3.5 h-3.5 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text">Account Security</p>
            <p className="text-[11px] text-text-muted">Locked fields for security</p>
          </div>
        </div>
        {[
          { label: 'Email', value: user?.email },
          { label: 'Account Type', value: 'Recruiter / Employer' },
          { label: 'Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
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

      {/* Danger zone */}
      <div className="p-4 rounded-xl bg-error/5 border border-error/20">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
            <HiExclamationTriangle className="w-3.5 h-3.5 text-error" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text">Danger Zone</p>
            <p className="text-[11px] text-text-muted">Irreversible actions</p>
          </div>
        </div>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-error/30 text-xs font-medium text-error hover:bg-error/10 transition-all">
            <HiTrash className="w-3.5 h-3.5" /> Delete My Account
          </button>
        ) : (
          <div className="p-3 rounded-lg bg-error/10 border border-error/20 space-y-2">
            <p className="text-xs font-semibold text-error">This deletes your account and all job postings permanently.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:bg-surface-hover transition-all">Cancel</button>
              <button onClick={() => toast.error('Contact support to delete your account.')} className="flex-1 py-1.5 rounded-lg bg-error text-white text-xs font-bold">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterSettings;
