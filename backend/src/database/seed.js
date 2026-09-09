import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Recruiter from '../models/Recruiter.js';
import Applicant from '../models/Applicant.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ats_database';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    await Recruiter.deleteMany({});
    await Applicant.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing data');

    /* ─────────────────────────────────────────────
       1. SUPER ADMIN
    ───────────────────────────────────────────── */
    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@ats.com',
      password: 'admin123',
      role: 'super_admin',
      isActive: true,
      isVerified: true,
    });
    console.log('✓ Super Admin created');

    /* ─────────────────────────────────────────────
       2. MAIN RECRUITER + APPROVED COMPANY
    ───────────────────────────────────────────── */
    const recruiterUser = await User.create({
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'recruiter@ats.com',
      password: 'recruiter123',
      role: 'recruiter',
      phone: '+91 98765 43210',
      isActive: true,
      isVerified: true,
    });

    const company = await Company.create({
      name: 'TechCorp India',
      email: 'hr@techcorp.com',
      website: 'https://techcorp.com',
      industry: 'Technology',
      size: '51-200',
      location: 'Bangalore, India',
      description: 'Leading technology solutions company specializing in enterprise software, cloud platforms, and AI-driven products for global clients.',
      status: 'approved',
      owner: recruiterUser._id,
      approvedAt: daysAgo(40),
    });

    await Recruiter.create({
      user: recruiterUser._id,
      company: company._id,
      position: 'HR Manager',
    });
    console.log('✓ Recruiter + Company created (approved)');

    /* ─────────────────────────────────────────────
       3. A SECOND COMPANY — PENDING APPROVAL (for admin demo)
    ───────────────────────────────────────────── */
    const recruiter2 = await User.create({
      firstName: 'Anjali',
      lastName: 'Verma',
      email: 'recruiter2@ats.com',
      password: 'recruiter123',
      role: 'recruiter',
      phone: '+91 91234 56789',
      isActive: true,
      isVerified: true,
    });

    const pendingCompany = await Company.create({
      name: 'InnovateX Labs',
      email: 'careers@innovatex.com',
      website: 'https://innovatex.com',
      industry: 'Finance',
      size: '11-50',
      location: 'Mumbai, India',
      description: 'Fintech startup building next-generation payment infrastructure.',
      status: 'pending',
      owner: recruiter2._id,
    });

    await Recruiter.create({
      user: recruiter2._id,
      company: pendingCompany._id,
      position: 'Talent Acquisition Lead',
    });
    console.log('✓ Second recruiter + pending company created');

    /* ─────────────────────────────────────────────
       4. MAIN APPLICANT (existing test account)
    ───────────────────────────────────────────── */
    const applicantUser = await User.create({
      firstName: 'Priya',
      lastName: 'Singh',
      email: 'applicant@ats.com',
      password: 'applicant123',
      role: 'applicant',
      phone: '+91 99887 76655',
      isActive: true,
      isVerified: true,
    });

    await Applicant.create({
      user: applicantUser._id,
      headline: 'Full Stack Developer | React & Node.js',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Express', 'Tailwind CSS'],
      experienceLevel: 'mid',
      location: 'Delhi, India',
      linkedin: 'https://linkedin.com/in/priyasingh',
      portfolio: 'https://priyasingh.dev',
      bio: 'Passionate full-stack developer with 3+ years building scalable web applications. Strong focus on clean code, performance, and great user experience.',
      resume: {
        url: 'https://demo-bucket.s3.amazonaws.com/resumes/priya-singh-resume.pdf',
        filename: 'priya-singh-resume.pdf',
        uploadedAt: daysAgo(20),
      },
      experience: [
        { title: 'Full Stack Developer', company: 'WebWorks Solutions', location: 'Delhi', startDate: daysAgo(730), current: true, description: 'Building MERN stack applications for enterprise clients.' },
        { title: 'Frontend Developer', company: 'Digital Craft', location: 'Noida', startDate: daysAgo(1460), endDate: daysAgo(730), current: false, description: 'Developed responsive UIs with React.' },
      ],
      education: [
        { degree: 'B.Tech Computer Science', institution: 'Delhi Technological University', field: 'CSE', startDate: daysAgo(2920), endDate: daysAgo(1460), gpa: '8.4' },
      ],
    });
    console.log('✓ Main applicant created (full profile)');

    /* ─────────────────────────────────────────────
       5. EXTRA APPLICANTS (to populate recruiter pipeline)
    ───────────────────────────────────────────── */
    const extraApplicantsData = [
      { firstName: 'Amit', lastName: 'Kumar', email: 'amit@ats.com', headline: 'Senior Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Redis'], level: 'senior', location: 'Pune, India' },
      { firstName: 'Sara', lastName: 'Khan', email: 'sara@ats.com', headline: 'Frontend Developer', skills: ['React', 'JavaScript', 'CSS', 'Figma'], level: 'mid', location: 'Hyderabad, India' },
      { firstName: 'Vikram', lastName: 'Rao', email: 'vikram@ats.com', headline: 'DevOps Engineer', skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'], level: 'senior', location: 'Bangalore, India' },
      { firstName: 'Neha', lastName: 'Gupta', email: 'neha@ats.com', headline: 'Junior Web Developer', skills: ['HTML', 'CSS', 'JavaScript', 'React'], level: 'entry', location: 'Chennai, India' },
      { firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@ats.com', headline: 'Full Stack Engineer', skills: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'TypeScript'], level: 'mid', location: 'Remote' },
    ];

    const extraApplicants = [];
    for (const a of extraApplicantsData) {
      const u = await User.create({
        firstName: a.firstName, lastName: a.lastName, email: a.email, password: 'applicant123',
        role: 'applicant', isActive: true, isVerified: true,
      });
      await Applicant.create({
        user: u._id, headline: a.headline, skills: a.skills, experienceLevel: a.level, location: a.location,
        bio: `${a.headline} based in ${a.location}.`,
        resume: { url: `https://demo-bucket.s3.amazonaws.com/resumes/${a.firstName.toLowerCase()}-resume.pdf`, filename: `${a.firstName.toLowerCase()}-resume.pdf`, uploadedAt: daysAgo(15) },
      });
      extraApplicants.push(u);
    }
    console.log(`✓ ${extraApplicants.length} extra applicants created`);

    /* ─────────────────────────────────────────────
       6. JOBS (posted by main recruiter's company)
    ───────────────────────────────────────────── */
    const jobsData = [
      {
        title: 'Senior Full Stack Developer',
        description: 'We are looking for an experienced full stack developer to build and scale our core products using the MERN stack.',
        responsibilities: 'Design, develop and maintain web applications. Collaborate with product and design teams. Mentor junior developers.',
        location: 'Bangalore, India', type: 'full-time', experience: 'senior', status: 'open',
        salary: { min: 1800000, max: 2800000, currency: 'INR' },
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
        requirements: ['5+ years full stack experience', 'Strong in React & Node.js', 'Experience with cloud platforms'],
        createdAt: daysAgo(30),
      },
      {
        title: 'Frontend Developer (React)',
        description: 'Join our UI team to craft beautiful, responsive interfaces for our SaaS platform.',
        responsibilities: 'Build reusable components, optimize performance, ensure accessibility.',
        location: 'Remote', type: 'remote', experience: 'mid', status: 'open',
        salary: { min: 1000000, max: 1600000, currency: 'INR' },
        skills: ['React', 'JavaScript', 'Tailwind CSS', 'Redux'],
        requirements: ['3+ years React experience', 'Strong CSS skills', 'Eye for design'],
        createdAt: daysAgo(20),
      },
      {
        title: 'DevOps Engineer',
        description: 'Own our cloud infrastructure and CI/CD pipelines.',
        responsibilities: 'Manage Kubernetes clusters, automate deployments, ensure uptime.',
        location: 'Bangalore, India', type: 'full-time', experience: 'senior', status: 'open',
        salary: { min: 2000000, max: 3000000, currency: 'INR' },
        skills: ['Kubernetes', 'AWS', 'Terraform', 'Docker', 'CI/CD'],
        requirements: ['4+ years DevOps', 'Strong AWS knowledge', 'IaC experience'],
        createdAt: daysAgo(15),
      },
      {
        title: 'Backend Engineer Intern',
        description: 'A 6-month internship for aspiring backend engineers.',
        location: 'Pune, India', type: 'internship', experience: 'entry', status: 'open',
        salary: { min: 25000, max: 40000, currency: 'INR' },
        skills: ['Node.js', 'JavaScript', 'SQL'],
        requirements: ['Basic backend knowledge', 'Eagerness to learn'],
        createdAt: daysAgo(10),
      },
      {
        title: 'Product Designer (Draft)',
        description: 'Draft posting — not yet published.',
        location: 'Mumbai, India', type: 'full-time', experience: 'mid', status: 'draft',
        skills: ['Figma', 'UI/UX', 'Prototyping'],
        requirements: ['3+ years product design'],
        createdAt: daysAgo(5),
      },
    ];

    const jobs = [];
    for (const j of jobsData) {
      const job = await Job.create({
        ...j,
        company: company._id,
        recruiter: recruiterUser._id,
      });
      jobs.push(job);
    }
    console.log(`✓ ${jobs.length} jobs created`);

    /* ─────────────────────────────────────────────
       7. APPLICATIONS — different stages (offered, rejected, etc.)
    ───────────────────────────────────────────── */
    const mkResume = (name) => ({
      url: `https://demo-bucket.s3.amazonaws.com/resumes/${name}-resume.pdf`,
      filename: `${name}-resume.pdf`,
    });

    const applicationsData = [
      // Priya (main applicant) — spread across stages so HER dashboard shows activity
      { applicant: applicantUser, job: jobs[0], status: 'interview',   aiScore: 88, days: 25, cover: 'I have 3+ years of MERN experience and would love to contribute to your core products.', interview: daysAgo(2) },
      { applicant: applicantUser, job: jobs[1], status: 'offered',     aiScore: 92, days: 18, cover: 'Frontend is my passion — I build clean, accessible React UIs.' },
      { applicant: applicantUser, job: jobs[3], status: 'applied',     aiScore: 70, days: 8,  cover: 'Excited to grow as a backend engineer through this internship.' },
      { applicant: applicantUser, job: jobs[2], status: 'rejected',    aiScore: 45, days: 12, cover: 'Interested in the DevOps role.' },

      // Other applicants — fill up the recruiter pipeline
      { applicant: extraApplicants[0], job: jobs[0], status: 'shortlisted', aiScore: 85, days: 22, cover: 'Senior backend engineer with strong Node.js and AWS background.' },
      { applicant: extraApplicants[2], job: jobs[2], status: 'offered',     aiScore: 94, days: 14, cover: 'DevOps is exactly my domain — Kubernetes and Terraform expert.' },
      { applicant: extraApplicants[1], job: jobs[1], status: 'interview',   aiScore: 79, days: 16, cover: 'Frontend developer passionate about pixel-perfect UIs.', interview: daysAgo(1) },
      { applicant: extraApplicants[3], job: jobs[1], status: 'applied',     aiScore: 58, days: 6,  cover: 'Junior developer eager to learn and contribute.' },
      { applicant: extraApplicants[4], job: jobs[0], status: 'shortlisted', aiScore: 82, days: 19, cover: 'Full stack engineer with GraphQL and TypeScript expertise.' },
      { applicant: extraApplicants[3], job: jobs[3], status: 'applied',     aiScore: 65, days: 4,  cover: 'Very interested in this internship opportunity.' },
      { applicant: extraApplicants[0], job: jobs[2], status: 'rejected',    aiScore: 50, days: 20, cover: 'Applying for the DevOps position.' },
      { applicant: extraApplicants[4], job: jobs[1], status: 'rejected',    aiScore: 48, days: 17, cover: 'Interested in the frontend role.' },
    ];

    let created = 0;
    const jobAppCounts = {};
    for (const a of applicationsData) {
      await Application.create({
        job: a.job._id,
        applicant: a.applicant._id,
        company: company._id,
        status: a.status,
        aiScore: a.aiScore,
        aiStatus: 'analyzed',
        coverLetter: a.cover,
        resume: mkResume(a.applicant.firstName.toLowerCase()),
        interviewDate: a.interview || null,
        appliedAt: daysAgo(a.days),
        createdAt: daysAgo(a.days),
      });
      jobAppCounts[a.job._id] = (jobAppCounts[a.job._id] || 0) + 1;
      created++;
    }

    // Update totalApplications count on each job
    for (const job of jobs) {
      const count = jobAppCounts[job._id] || 0;
      if (count > 0) {
        await Job.findByIdAndUpdate(job._id, { totalApplications: count });
      }
    }
    console.log(`✓ ${created} applications created (offered, rejected, interview, shortlisted, applied)`);

    /* ─────────────────────────────────────────────
       SUMMARY
    ───────────────────────────────────────────── */
    console.log('\n========================================');
    console.log('  SEED COMPLETE — TEST CREDENTIALS');
    console.log('========================================\n');
    console.log('  SUPER ADMIN');
    console.log('  admin@ats.com / admin123\n');
    console.log('  RECRUITER (TechCorp India - approved)');
    console.log('  recruiter@ats.com / recruiter123');
    console.log('  → 5 jobs, 12 applications across all stages\n');
    console.log('  RECRUITER 2 (InnovateX - PENDING approval)');
    console.log('  recruiter2@ats.com / recruiter123\n');
    console.log('  APPLICANT (Priya - full profile)');
    console.log('  applicant@ats.com / applicant123');
    console.log('  → 4 applications: 1 offered, 1 interview, 1 applied, 1 rejected\n');
    console.log('  OTHER APPLICANTS (all password: applicant123)');
    console.log('  amit@ats.com, sara@ats.com, vikram@ats.com,');
    console.log('  neha@ats.com, arjun@ats.com');
    console.log('========================================');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedUsers();
