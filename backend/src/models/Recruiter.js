import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      trim: true,
      default: null,
    },
    department: {
      type: String,
      trim: true,
      default: null,
    },
    companyWebsite: {
      type: String,
      trim: true,
      default: null,
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: null,
    },
    industry: {
      type: String,
      trim: true,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: null,
    },
    totalJobsPosted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export default Recruiter;
