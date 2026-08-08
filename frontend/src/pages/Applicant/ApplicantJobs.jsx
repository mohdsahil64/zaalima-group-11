import { useState } from 'react';
import { HiBriefcase } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, Select, EmptyState } from '@/components/common';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';

const ApplicantJobs = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  return (
    <div>
      <PageHeader
        title="Browse Jobs"
        subtitle="Find your next opportunity"
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search by title, company, or skills..."
          className="flex-1 max-w-md"
        />
        <Select
          options={JOB_TYPES}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="Job Type"
          className="w-full sm:w-44"
        />
        <Select
          options={EXPERIENCE_LEVELS}
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
          placeholder="Experience"
          className="w-full sm:w-44"
        />
      </div>

      <Card padding="none">
        <EmptyState
          icon={HiBriefcase}
          title="No jobs available"
          description="Check back later for new opportunities."
        />
      </Card>
    </div>
  );
};

export default ApplicantJobs;
