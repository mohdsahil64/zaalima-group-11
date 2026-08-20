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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
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
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
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

recruiterSchema.index({ company: 1 });

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export default Recruiter;
