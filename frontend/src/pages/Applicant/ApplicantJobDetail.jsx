import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiArrowLeft, HiMapPin, HiBriefcase, HiAcademicCap, HiCurrencyDollar } from 'react-icons/hi2';
import JobService from '@/services/job.service';
import ApplicationService from '@/services/application.service';
import { Card, PageHeader, Button, Badge, Loader, Textarea } from '@/components/common';
import { capitalize, formatSalary } from '@/utils';
import toast from 'react-hot-toast';

const ApplicantJobDetail = () => {
  const { id } = useParams();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => JobService.getJob(id),
  });

  const applyMutation = useMutation({
    mutationFn: () => ApplicationService.createApplication({ job: id, coverLetter: coverLetter || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant'] });
      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
    },
    onError: (err) => toast.error(err.message || 'Failed to apply'),
  });

  const job = data?.data?.job;

  if (isLoading) return <Loader />;
  if (!job) return <div className="text-center py-12 text-text-secondary">Job not found</div>;

  return (
    <div>
      <PageHeader
        title={job.title}
        subtitle={job.company?.name}
        actions={
          <Link to="/applicant/jobs">
            <Button variant="ghost" icon={HiArrowLeft}>Back to Jobs</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="info" size="lg">
                <HiMapPin className="w-3.5 h-3.5 mr-1 inline" />{job.location}
              </Badge>
              <Badge variant="primary" size="lg">
                <HiBriefcase className="w-3.5 h-3.5 mr-1 inline" />{capitalize(job.type)}
              </Badge>
              <Badge variant="default" size="lg">
                <HiAcademicCap className="w-3.5 h-3.5 mr-1 inline" />{capitalize(job.experience)}
              </Badge>
              {job.salary?.min && (
                <Badge variant="success" size="lg">
                  <HiCurrencyDollar className="w-3.5 h-3.5 mr-1 inline" />
                  {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                </Badge>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text mb-2">Description</h3>
                <p className="text-sm text-text-secondary whitespace-pre-line">{job.description}</p>
              </div>

              {job.responsibilities && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Responsibilities</h3>
                  <p className="text-sm text-text-secondary whitespace-pre-line">{job.responsibilities}</p>
                </div>
              )}

              {job.requirements?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                    {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>
              )}

              {job.skills?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => <Badge key={i} variant="default">{skill}</Badge>)}
                  </div>
                </div>
              )}

              {job.education && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Education</h3>
                  <p className="text-sm text-text-secondary">{job.education}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <h3 className="text-lg font-semibold text-text mb-2">Apply Now</h3>
            <p className="text-sm text-text-secondary mb-4">
              Submit your application for this position.
            </p>

            {!showApplyForm ? (
              <Button fullWidth onClick={() => setShowApplyForm(true)}>
                Apply for this Job
              </Button>
            ) : (
              <div className="space-y-4">
                <Textarea
                  label="Cover Letter (Optional)"
                  placeholder="Tell them why you're a great fit..."
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <Button
                  fullWidth
                  onClick={() => applyMutation.mutate()}
                  loading={applyMutation.isPending}
                >
                  Submit Application
                </Button>
                <Button
                  fullWidth
                  variant="ghost"
                  onClick={() => setShowApplyForm(false)}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Company info */}
            {job.company && (
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-text mb-2">About the Company</h4>
                <p className="text-sm font-medium text-text">{job.company.name}</p>
                {job.company.location && (
                  <p className="text-xs text-text-secondary mt-1">{job.company.location}</p>
                )}
                {job.company.industry && (
                  <p className="text-xs text-text-secondary">{job.company.industry}</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantJobDetail;
