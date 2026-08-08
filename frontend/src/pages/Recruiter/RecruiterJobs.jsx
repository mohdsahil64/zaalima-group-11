import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBriefcase, HiPlus } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, Select, EmptyState, Button } from '@/components/common';
import { JOB_STATUS } from '@/constants';

const RecruiterJobs = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Manage your job postings"
        actions={
          <Link to="/recruiter/jobs/create">
            <Button icon={HiPlus}>Create Job</Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search jobs..."
          className="flex-1 max-w-md"
        />
        <Select
          options={JOB_STATUS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Status"
          className="w-full sm:w-48"
        />
      </div>

      <Card padding="none">
        <EmptyState
          icon={HiBriefcase}
          title="No jobs yet"
          description="Create your first job posting to start receiving applications."
          action={
            <Link to="/recruiter/jobs/create">
              <Button icon={HiPlus} size="sm">Create Job</Button>
            </Link>
          }
        />
      </Card>
    </div>
  );
};

export default RecruiterJobs;
