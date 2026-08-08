import { useState } from 'react';
import { HiBriefcase } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, EmptyState } from '@/components/common';

const AdminJobs = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Monitor all job postings across the platform"
      />

      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search jobs..."
          className="max-w-md"
        />
      </div>

      <Card padding="none">
        <EmptyState
          icon={HiBriefcase}
          title="No jobs posted"
          description="Jobs will appear here once recruiters start posting."
        />
      </Card>
    </div>
  );
};

export default AdminJobs;
