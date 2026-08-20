import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiBriefcase, HiMapPin, HiAcademicCap } from 'react-icons/hi2';
import JobService from '@/services/job.service';
import { PageHeader, Card, SearchBox, Select, EmptyState, Badge, Button, Loader } from '@/components/common';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';
import { capitalize, formatSalary } from '@/utils';

const ApplicantJobs = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', { search, type: typeFilter, experience: experienceFilter }],
    queryFn: () => JobService.getJobs({ search, type: typeFilter, experience: experienceFilter, limit: 20 }),
  });

  const jobs = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Browse Jobs" subtitle="Find your next opportunity" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search by title, skills..."
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

      {jobs.length === 0 ? (
        <Card>
          <EmptyState icon={HiBriefcase} title="No jobs found" description="Try adjusting your filters or check back later." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Card key={job._id} hover padding="md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-text">{job.title}</h3>
                  <p className="text-sm text-text-secondary">{job.company?.name || 'Company'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="info" size="sm">
                  <HiMapPin className="w-3 h-3 mr-1 inline" />{job.location}
                </Badge>
                <Badge variant="primary" size="sm">
                  <HiBriefcase className="w-3 h-3 mr-1 inline" />{capitalize(job.type)}
                </Badge>
                <Badge variant="default" size="sm">
                  <HiAcademicCap className="w-3 h-3 mr-1 inline" />{capitalize(job.experience)}
                </Badge>
              </div>
              {job.salary?.min && (
                <p className="text-sm text-text-secondary mb-3">
                  {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                </p>
              )}
              <Link to={`/applicant/jobs/${job._id}`}>
                <Button variant="outline" size="sm" fullWidth>View & Apply</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantJobs;
