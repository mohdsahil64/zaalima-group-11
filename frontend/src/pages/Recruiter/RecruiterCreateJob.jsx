import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import { Card, PageHeader, Input, Textarea, Select, Button } from '@/components/common';
import { JOB_TYPES, EXPERIENCE_LEVELS, JOB_STATUS } from '@/constants';

const RecruiterCreateJob = () => {
  return (
    <div>
      <PageHeader
        title="Create Job"
        subtitle="Post a new job opening"
        actions={
          <Link to="/recruiter/jobs">
            <Button variant="ghost" icon={HiArrowLeft}>Back to Jobs</Button>
          </Link>
        }
      />

      <Card>
        <form className="space-y-6">
          <Input label="Job Title" placeholder="e.g. Senior Frontend Developer" />
          <Textarea label="Description" placeholder="Describe the role, responsibilities, and expectations..." rows={5} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Location" placeholder="e.g. San Francisco, CA or Remote" />
            <Select label="Employment Type" options={JOB_TYPES} placeholder="Select type" />
            <Select label="Experience Level" options={EXPERIENCE_LEVELS} placeholder="Select level" />
            <Select label="Status" options={JOB_STATUS} placeholder="Select status" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Salary Range</label>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Min (e.g. 80000)" type="number" />
              <Input placeholder="Max (e.g. 120000)" type="number" />
            </div>
          </div>

          <Textarea label="Required Skills" placeholder="Enter skills separated by commas (e.g. React, Node.js, TypeScript)" rows={3} />
          <Textarea label="Requirements" placeholder="Enter job requirements..." rows={4} />

          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button">Save as Draft</Button>
            <Button type="button">Publish Job</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterCreateJob;
