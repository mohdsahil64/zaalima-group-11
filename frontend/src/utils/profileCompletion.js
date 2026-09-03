/**
 * Extracts the applicant profile from any shape the backend returns.
 * Backend now returns: { data: { user, applicantProfile } }
 * or legacy shape:     { data: { user: { applicantProfile: {...} } } }
 */
export const extractApplicantProfile = (profileData) => {
  if (!profileData?.data) return {};
  // New shape: data.applicantProfile at top level
  if (profileData.data.applicantProfile) return profileData.data.applicantProfile;
  // Legacy shape: nested inside user
  if (profileData.data.user?.applicantProfile) return profileData.data.user.applicantProfile;
  // Fallback: data.applicant
  if (profileData.data.applicant) return profileData.data.applicant;
  return {};
};

/**
 * Calculates applicant profile completion percentage and missing fields.
 */
export const calcProfileCompletion = (user = {}, applicant = {}, hasResume = false) => {
  const steps = [
    {
      key: 'basic',
      label: 'Basic Info',
      desc: 'First name, last name, phone',
      weight: 20,
      done: !!(user?.firstName && user?.lastName && (applicant?.phone || user?.phone)),
      required: true,
    },
    {
      key: 'resume',
      label: 'Resume Uploaded',
      desc: 'Upload your latest CV/resume',
      weight: 25,
      done: hasResume,
      required: true,
    },
    {
      key: 'headline',
      label: 'Professional Headline',
      desc: 'e.g. "Senior React Developer"',
      weight: 10,
      done: !!applicant?.headline,
      required: false,
    },
    {
      key: 'skills',
      label: 'Skills Added',
      desc: 'At least 3 skills',
      weight: 15,
      done: (applicant?.skills?.length || 0) >= 3,
      required: true,
    },
    {
      key: 'experience',
      label: 'Work Experience',
      desc: 'At least 1 work experience',
      weight: 15,
      done: (applicant?.experience?.length || 0) >= 1,
      required: false,
    },
    {
      key: 'education',
      label: 'Education',
      desc: 'Highest qualification',
      weight: 10,
      done: (applicant?.education?.length || 0) >= 1,
      required: false,
    },
    {
      key: 'bio',
      label: 'About / Summary',
      desc: 'Short professional bio',
      weight: 5,
      done: !!(applicant?.bio && applicant.bio.length >= 30),
      required: false,
    },
  ];

  const pct = steps.reduce((sum, s) => sum + (s.done ? s.weight : 0), 0);
  const missing = steps.filter((s) => !s.done).map((s) => s.label);

  return { pct, steps, missing };
};

/**
 * Calculates job match % based on applicant profile vs job requirements.
 */
export const calcJobMatch = (job = {}, applicantData = {}) => {
  if (!applicantData?.skills?.length) return 0;

  const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
  const profileSkills = (applicantData.skills || []).map((s) => s.toLowerCase());

  if (jobSkills.length === 0) return 60;

  const matched = jobSkills.filter((js) =>
    profileSkills.some((ps) => ps.includes(js) || js.includes(ps))
  ).length;

  const skillScore = Math.round((matched / jobSkills.length) * 60);

  let expBonus = 0;
  if (job.experience && applicantData.experienceLevel) {
    const levels = ['entry', 'mid', 'senior', 'lead', 'executive'];
    const jobLvl = levels.indexOf(job.experience);
    const userLvl = levels.indexOf(applicantData.experienceLevel);
    expBonus = (jobLvl >= 0 && userLvl >= 0)
      ? (userLvl >= jobLvl ? 20 : Math.max(0, 10 - (jobLvl - userLvl) * 5))
      : 10;
  } else {
    expBonus = 10;
  }

  const resumeBonus = applicantData.hasResume ? 20 : 0;
  return Math.min(100, skillScore + expBonus + resumeBonus);
};

/**
 * Returns color classes based on match percentage.
 */
export const matchColor = (pct) => {
  if (pct >= 75) return { text: 'text-success', bg: 'bg-success/10', border: 'border-success/25', bar: 'bg-success' };
  if (pct >= 50) return { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/25', bar: 'bg-warning' };
  return { text: 'text-error', bg: 'bg-error/10', border: 'border-error/25', bar: 'bg-error' };
};
