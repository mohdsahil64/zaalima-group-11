import { useState } from 'react';
import { HiDocumentText } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, EmptyState } from '@/components/common';

const AdminApplications = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Monitor all job applications"
      />

      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search applications..."
          className="max-w-md"
        />
      </div>

      <Card padding="none">
        <EmptyState
          icon={HiDocumentText}
          title="No applications yet"
          description="Applications will appear here once applicants start applying."
        />
      </Card>
    </div>
  );
};

export default AdminApplications;
