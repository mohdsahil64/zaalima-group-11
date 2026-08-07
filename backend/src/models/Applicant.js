import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      trim: true,
      maxlength: [120, 'Headline cannot exceed 120 characters'],
      default: null,
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: null,
    },
    resume: {
      url: { type: String, default: null },
      filename: { type: String, default: null },
      uploadedAt: { type: Date, default: null },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        field: String,
        startDate: Date,
        endDate: Date,
        gpa: String,
      },
    ],
    location: {
      type: String,
      trim: true,
      default: null,
    },
    portfolio: {
      type: String,
      trim: true,
      default: null,
    },
    linkedin: {
      type: String,
      trim: true,
      default: null,
    },
    github: {
      type: String,
      trim: true,
      default: null,
    },
    totalApplications: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Applicant = mongoose.model('Applicant', applicantSchema);

export default Applicant;
