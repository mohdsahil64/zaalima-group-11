import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiMapPin, HiBriefcase, HiAcademicCap, HiCurrencyDollar } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Button, Badge } from '@/components/common';

const JobDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
    } else {
      // Will connect to application flow later
      navigate(`/applicant/jobs/${id}`);
    }
  };

  // Placeholder - will be replaced with API fetch
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text transition-colors">
          <HiArrowLeft className="w-4 h-4" />
          Back to Job Board
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h1 className="text-2xl font-bold text-text mb-2">Job Title</h1>
            <p className="text-lg text-text-secondary mb-4">Company Name</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="info" size="lg">
                <HiMapPin className="w-3.5 h-3.5 mr-1 inline" />Location
              </Badge>
              <Badge variant="primary" size="lg">
                <HiBriefcase className="w-3.5 h-3.5 mr-1 inline" />Full Time
              </Badge>
              <Badge variant="default" size="lg">
                <HiAcademicCap className="w-3.5 h-3.5 mr-1 inline" />Mid Level
              </Badge>
              <Badge variant="success" size="lg">
                <HiCurrencyDollar className="w-3.5 h-3.5 mr-1 inline" />$80k - $120k
              </Badge>
            </div>

            <div className="border-t border-border pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text mb-3">Description</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Job description will appear here once loaded from the API. This section will contain
                  details about the role, responsibilities, and what a typical day looks like.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text mb-3">Requirements</h3>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                  <li>Requirement details will appear here</li>
                  <li>Once the job data is loaded from the API</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">React</Badge>
                  <Badge variant="default">Node.js</Badge>
                  <Badge variant="default">TypeScript</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-24">
            <h3 className="text-lg font-semibold text-text mb-2">Interested?</h3>
            <p className="text-sm text-text-secondary mb-4">
              {isAuthenticated
                ? 'Submit your application for this position.'
                : 'Sign in or create an account to apply.'}
            </p>
            <Button fullWidth onClick={handleApply}>
              {isAuthenticated ? 'Apply Now' : 'Sign In to Apply'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
