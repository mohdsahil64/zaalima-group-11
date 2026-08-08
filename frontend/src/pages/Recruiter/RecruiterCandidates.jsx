import { useState } from 'react';
import { HiUserGroup } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, EmptyState } from '@/components/common';

const RecruiterCandidates = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle="Browse and manage your candidate pool"
      />

      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search candidates by name, skills..."
          className="max-w-md"
        />
      </div>

      <Card padding="none">
        <EmptyState
          icon={HiUserGroup}
          title="No candidates yet"
          description="Candidates who apply to your jobs will appear here."
        />
      </Card>
    </div>
  );
};

export default RecruiterCandidates;
