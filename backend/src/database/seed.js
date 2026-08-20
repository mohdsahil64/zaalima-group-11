import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Recruiter from '../models/Recruiter.js';
import Applicant from '../models/Applicant.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ats_database';

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    await Recruiter.deleteMany({});
    await Applicant.deleteMany({});
    console.log('Cleared existing data');

    // 1. Super Admin
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

    // 2. Recruiter + Company
    const recruiterUser = await User.create({
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'recruiter@ats.com',
      password: 'recruiter123',
      role: 'recruiter',
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
      description: 'Leading technology solutions company specializing in enterprise software.',
      status: 'approved',
      owner: recruiterUser._id,
      approvedAt: new Date(),
    });

    await Recruiter.create({
      user: recruiterUser._id,
      company: company._id,
      position: 'HR Manager',
    });
    console.log('✓ Recruiter + Company created (approved)');

    // 3. Applicant
    const applicantUser = await User.create({
      firstName: 'Priya',
      lastName: 'Singh',
      email: 'applicant@ats.com',
      password: 'applicant123',
      role: 'applicant',
      isActive: true,
      isVerified: true,
    });

    await Applicant.create({
      user: applicantUser._id,
      headline: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript'],
      location: 'Delhi, India',
      bio: 'Passionate developer with 3 years of experience in full-stack web development.',
    });
    console.log('✓ Applicant created');

    console.log('\n========================================');
    console.log('  TEST LOGIN CREDENTIALS');
    console.log('========================================');
    console.log('');
    console.log('  Super Admin:');
    console.log('  Email:    admin@ats.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('  Recruiter:');
    console.log('  Email:    recruiter@ats.com');
    console.log('  Password: recruiter123');
    console.log('  Company:  TechCorp India (approved)');
    console.log('');
    console.log('  Applicant:');
    console.log('  Email:    applicant@ats.com');
    console.log('  Password: applicant123');
    console.log('');
    console.log('========================================');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedUsers();
