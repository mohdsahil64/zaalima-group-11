import { useState } from 'react';
import { HiDocumentText } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, Select, EmptyState } from '@/components/common';
import { APPLICATION_STATUS } from '@/constants';

const RecruiterApplications = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Review and manage candidate applications"
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search by candidate or job..."
          className="flex-1 max-w-md"
        />
        <Select
          options={APPLICATION_STATUS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Status"
          className="w-full sm:w-48"
        />
      </div>

      <Card padding="none">
        <EmptyState
          icon={HiDocumentText}
          title="No applications yet"
          description="Applications will appear here once candidates apply to your jobs."
        />
      </Card>
    </div>
  );
};

export default RecruiterApplications;
