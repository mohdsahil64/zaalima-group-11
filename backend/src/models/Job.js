import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters'],
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },

    type: {
      type: String,
      enum: {
        values: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
        message: 'Invalid job type',
      },
      required: [true, 'Job type is required'],
    },

    experience: {
      type: String,
      enum: {
        values: ['entry', 'mid', 'senior', 'lead', 'executive'],
        message: 'Invalid experience level',
      },
      default: 'mid',
    },

    salary: {
      min: {
        type: Number,
        min: [0, 'Minimum salary cannot be negative'],
        default: null,
      },

      max: {
        type: Number,
        min: [0, 'Maximum salary cannot be negative'],
        default: null,
      },

      currency: {
        type: String,
        trim: true,
        uppercase: true,
        default: 'USD',
      },
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter is required'],
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ['open', 'closed', 'draft', 'paused'],
        message: 'Invalid job status',
      },
      default: 'open',
      index: true,
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },

    totalApplications: {
      type: Number,
      default: 0,
      min: [0, 'Total applications cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Ensure minimum salary is not greater than maximum salary.
jobSchema.pre('validate', function (next) {
  if (
    this.salary &&
    this.salary.min !== null &&
    this.salary.max !== null &&
    this.salary.min > this.salary.max
  ) {
    this.invalidate(
      'salary.max',
      'Maximum salary cannot be less than minimum salary'
    );
  }

  next();
});

// Search index
jobSchema.index({
  title: 'text',
  description: 'text',
  skills: 'text',
});

// Public job listing
jobSchema.index({
  status: 1,
  createdAt: -1,
});

// Deadline filtering
jobSchema.index({
  applicationDeadline: 1,
});

// Recruiter dashboard
jobSchema.index({
  recruiter: 1,
  status: 1,
  createdAt: -1,
});

const Job = mongoose.model('Job', jobSchema);

export default Job;