import { useState } from 'react';
import { Card, PageHeader, SearchBox, EmptyState } from '@/components/common';
import { HiBriefcase } from 'react-icons/hi2';

const JobBoardPage = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Job Board"
        subtitle="Find your next opportunity"
      />

      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search jobs by title, company, or skills..."
          className="max-w-lg"
        />
      </div>

      <Card>
        <EmptyState
          icon={HiBriefcase}
          title="No jobs posted yet"
          description="Check back later for new opportunities."
        />
      </Card>
    </div>
  );
};

export default JobBoardPage;
