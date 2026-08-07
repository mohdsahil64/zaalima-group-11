export const APP_NAME = 'ATS';
export const APP_DESCRIPTION = 'AI-Powered Applicant Tracking System';

export const ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  APPLICANT: 'applicant',
};

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
];

export const APPLICATION_STATUS = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-400' },
  { value: 'reviewing', label: 'Reviewing', color: 'text-blue-400' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'text-purple-400' },
  { value: 'interview', label: 'Interview', color: 'text-indigo-400' },
  { value: 'offered', label: 'Offered', color: 'text-green-400' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-400' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'text-gray-400' },
];

export const JOB_STATUS = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
  { value: 'paused', label: 'Paused' },
];

export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];
