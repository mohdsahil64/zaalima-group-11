import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiArrowLeft, HiMapPin, HiBriefcase, HiAcademicCap, HiCurrencyDollar } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import JobService from '@/services/job.service';
import { Card, Button, Badge, Loader } from '@/components/common';
import { capitalize, formatSalary } from '@/utils';

const JobDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => JobService.getJob(id),
  });

  const job = data?.data?.job;

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
    } else if (user?.role === 'applicant') {
      navigate(`/applicant/jobs/${id}`);
    } else {
      navigate('/login');
    }
  };

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-8"><Loader /></div>;
  if (!job) return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-text-secondary">Job not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text transition-colors">
          <HiArrowLeft className="w-4 h-4" /> Back to Job Board
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h1 className="text-2xl font-bold text-text mb-2">{job.title}</h1>
            <p className="text-lg text-text-secondary mb-4">{job.company?.name}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="info" size="lg"><HiMapPin className="w-3.5 h-3.5 mr-1 inline" />{job.location}</Badge>
              <Badge variant="primary" size="lg"><HiBriefcase className="w-3.5 h-3.5 mr-1 inline" />{capitalize(job.type)}</Badge>
              <Badge variant="default" size="lg"><HiAcademicCap className="w-3.5 h-3.5 mr-1 inline" />{capitalize(job.experience)}</Badge>
              {job.salary?.min && (
                <Badge variant="success" size="lg"><HiCurrencyDollar className="w-3.5 h-3.5 mr-1 inline" />{formatSalary(job.salary.min, job.salary.max, job.salary.currency)}</Badge>
              )}
            </div>

            <div className="border-t border-border pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text mb-3">Description</h3>
                <p className="text-sm text-text-secondary whitespace-pre-line">{job.description}</p>
              </div>
              {job.responsibilities && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Responsibilities</h3>
                  <p className="text-sm text-text-secondary whitespace-pre-line">{job.responsibilities}</p>
                </div>
              )}
              {job.requirements?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Requirements</h3>
                  <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                    {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>
              )}
              {job.skills?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => <Badge key={i} variant="default">{skill}</Badge>)}
                  </div>
                </div>
              )}
              {job.education && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Education</h3>
                  <p className="text-sm text-text-secondary">{job.education}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <h3 className="text-lg font-semibold text-text mb-2">Interested?</h3>
            <p className="text-sm text-text-secondary mb-4">
              {isAuthenticated ? 'Submit your application for this position.' : 'Sign in to apply for this job.'}
            </p>
            <Button fullWidth onClick={handleApply}>
              {isAuthenticated ? 'Apply Now' : 'Sign In to Apply'}
            </Button>

            {job.company && (
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-text mb-2">About the Company</h4>
                <p className="text-sm font-medium text-text">{job.company.name}</p>
                {job.company.location && <p className="text-xs text-text-secondary mt-1">{job.company.location}</p>}
                {job.company.industry && <p className="text-xs text-text-secondary">{capitalize(job.company.industry)}</p>}
                {job.company.size && <p className="text-xs text-text-secondary">{job.company.size} employees</p>}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
