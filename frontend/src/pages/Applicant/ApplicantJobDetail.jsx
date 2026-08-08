import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiMapPin, HiBriefcase, HiAcademicCap } from 'react-icons/hi2';
import { Card, PageHeader, Button, Badge } from '@/components/common';

const ApplicantJobDetail = () => {
  const { id } = useParams();

  // Placeholder - will be replaced with API fetch
  return (
    <div>
      <PageHeader
        title="Job Details"
        actions={
          <Link to="/applicant/jobs">
            <Button variant="ghost" icon={HiArrowLeft}>Back to Jobs</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-text mb-2">Job Title</h2>
            <p className="text-text-secondary mb-4">Company Name</p>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="info"><HiMapPin className="w-3 h-3 mr-1 inline" />Location</Badge>
              <Badge variant="primary"><HiBriefcase className="w-3 h-3 mr-1 inline" />Full Time</Badge>
              <Badge variant="default"><HiAcademicCap className="w-3 h-3 mr-1 inline" />Mid Level</Badge>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Description</h3>
            <p className="text-sm text-text-secondary mb-6">Job description will appear here once loaded from the API.</p>
            <h3 className="text-lg font-semibold text-text mb-2">Requirements</h3>
            <p className="text-sm text-text-secondary mb-6">Job requirements will appear here.</p>
            <h3 className="text-lg font-semibold text-text mb-2">Skills</h3>
            <p className="text-sm text-text-secondary">Required skills will appear here.</p>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <h3 className="text-lg font-semibold text-text mb-4">Apply Now</h3>
            <p className="text-sm text-text-secondary mb-4">Submit your application for this position.</p>
            <Button fullWidth>Apply for this Job</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantJobDetail;
