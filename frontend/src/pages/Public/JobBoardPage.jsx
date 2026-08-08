import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBriefcase, HiMapPin, HiAcademicCap } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, Select, EmptyState, Badge, Button } from '@/components/common';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';

const JobBoardPage = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  // Placeholder - will be replaced with API data
  const jobs = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Job Board"
        subtitle="Find your next opportunity"
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Job title or keyword..."
          />
          <SearchBox
            value={location}
            onChange={setLocation}
            placeholder="Location..."
          />
          <Select
            options={JOB_TYPES}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            placeholder="Job Type"
          />
          <Select
            options={EXPERIENCE_LEVELS}
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            placeholder="Experience"
          />
        </div>
      </Card>

      {/* Job Listings */}
      {jobs.length === 0 ? (
        <Card>
          <EmptyState
            icon={HiBriefcase}
            title="No jobs posted yet"
            description="Check back later for new opportunities."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card key={job._id} hover padding="md">
              <h3 className="text-lg font-semibold text-text mb-1">{job.title}</h3>
              <p className="text-sm text-text-secondary mb-3">{job.company}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="info" size="sm">
                  <HiMapPin className="w-3 h-3 mr-1 inline" />{job.location}
                </Badge>
                <Badge variant="primary" size="sm">
                  <HiBriefcase className="w-3 h-3 mr-1 inline" />{job.type}
                </Badge>
                <Badge variant="default" size="sm">
                  <HiAcademicCap className="w-3 h-3 mr-1 inline" />{job.experience}
                </Badge>
              </div>
              <Link to={`/jobs/${job._id}`}>
                <Button variant="outline" size="sm" fullWidth>View Job</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoardPage;
