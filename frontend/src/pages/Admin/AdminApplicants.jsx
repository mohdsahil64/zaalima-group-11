import { useState } from 'react';
import { HiUserGroup } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, EmptyState } from '@/components/common';

const AdminApplicants = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <PageHeader
        title="Applicants"
        subtitle="View all registered applicants"
      />

      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search applicants..."
          className="max-w-md"
        />
      </div>

      <Card padding="none">
        <EmptyState
          icon={HiUserGroup}
          title="No applicants yet"
          description="Applicants will appear here once they register."
        />
      </Card>
    </div>
  );
};

export default AdminApplicants;
