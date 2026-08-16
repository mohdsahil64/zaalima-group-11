import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiDocumentText, HiClock, HiCalendarDays, HiGift } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import ApplicationService from '@/services/application.service';
import { Card, PageHeader, Loader, Badge, Button } from '@/components/common';
import { formatDate, capitalize } from '@/utils';

const statusVariant = { applied: 'info', shortlisted: 'primary', interview: 'warning', offered: 'success', rejected: 'error' };

const ApplicantDashboard = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['applicant', 'stats'],
    queryFn: () => ApplicationService.getApplicantStats(),
  });

  const { data: appsData } = useQuery({
    queryKey: ['applicant', 'applications', { limit: 5 }],
    queryFn: () => ApplicationService.getApplications({ limit: 5 }),
  });

  const stats = statsData?.data?.stats || {};
  const recentApps = appsData?.data || [];

  const cards = [
    { label: 'Applications', value: stats.total || 0, icon: HiDocumentText, color: 'text-primary' },
    { label: 'Pending', value: stats.applied || 0, icon: HiClock, color: 'text-warning' },
    { label: 'Interviews', value: stats.interview || 0, icon: HiCalendarDays, color: 'text-info' },
    { label: 'Offers', value: stats.offered || 0, icon: HiGift, color: 'text-success' },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName}!`}
        subtitle="Track your job applications and interviews"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">{stat.label}</p>
                <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-[12px] bg-surface ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Recent Applications</h3>
            <Link to="/applicant/applications">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="text-sm text-text-secondary">No applications yet. Start applying to jobs!</p>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div key={app._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text">{app.job?.title || 'Job'}</p>
                    <p className="text-xs text-text-secondary">{app.company?.name} • {formatDate(app.createdAt)}</p>
                  </div>
                  <Badge variant={statusVariant[app.status]}>{capitalize(app.status)}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/applicant/jobs" className="block">
              <Button variant="secondary" fullWidth className="justify-start">Browse Jobs</Button>
            </Link>
            <Link to="/applicant/resume" className="block">
              <Button variant="secondary" fullWidth className="justify-start">Upload Resume</Button>
            </Link>
            <Link to="/applicant/profile" className="block">
              <Button variant="secondary" fullWidth className="justify-start">Complete Profile</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
