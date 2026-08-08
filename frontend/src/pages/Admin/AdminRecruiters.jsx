import { useState } from 'react';
import { HiUsers } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, EmptyState } from '@/components/common';

const AdminRecruiters = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <PageHeader
        title="Recruiters"
        subtitle="Manage all recruiters on the platform"
      />

      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search recruiters..."
          className="max-w-md"
        />
      </div>

      <Card padding="none">
        <EmptyState
          icon={HiUsers}
          title="No recruiters yet"
          description="Recruiters will appear here once they register on the platform."
        />
      </Card>
    </div>
  );
};

export default AdminRecruiters;
