import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    resume: {
      url: { type: String, default: null },
      key: { type: String, default: null },
      filename: { type: String, default: null },
    },
    coverLetter: {
      type: String,
      maxlength: [3000, 'Cover letter cannot exceed 3000 characters'],
      default: null,
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
      default: 'applied',
    },
    notes: {
      type: String,
      default: null,
    },
    // AI Analysis fields
    aiScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    aiAnalysis: {
      matchScore: { type: Number, default: null },
      skillsMatched: [String],
      skillsMissing: [String],
      experienceMatch: { type: Boolean, default: null },
      summary: { type: String, default: null },
      recommendation: { type: String, default: null },
    },
    aiStatus: {
      type: String,
      enum: ['pending', 'processing', 'analyzed', 'failed'],
      default: 'pending',
    },
    // Resume parsing
    parsedResume: {
      rawText: { type: String, default: null },
      skills: [String],
      experience: { type: String, default: null },
      education: { type: String, default: null },
      parsedAt: { type: Date, default: null },
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    interviewNotes: {
      type: String,
      default: null,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ company: 1 });
applicationSchema.index({ applicant: 1, createdAt: -1 });
applicationSchema.index({ aiScore: -1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
