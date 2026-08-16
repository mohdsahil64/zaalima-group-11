import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiDocumentText, HiClock, HiCalendarDays, HiGift } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import ApplicationService from '@/services/application.service';
import { Card, PageHeader, Skeleton, Badge, Button } from '@/components/common';
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

  if (isLoading) return <Skeleton.Dashboard />;

  return (
    <div className="page-enter">
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        subtitle="Track your job applications"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {cards.map((stat) => (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-surface-elevated ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-semibold text-text leading-none">{stat.value}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card padding="sm" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-medium text-text">Recent Applications</h3>
            <Link to="/applicant/applications"><Button variant="ghost" size="xs">View all</Button></Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="text-xs text-text-muted px-1 py-4">No applications yet. Start applying!</p>
          ) : (
            <div className="space-y-1">
              {recentApps.map((app) => (
                <div key={app._id} className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-hover transition-colors">
                  <div>
                    <p className="text-xs font-medium text-text">{app.job?.title || 'Job'}</p>
                    <p className="text-[11px] text-text-muted">{app.company?.name} &middot; {formatDate(app.createdAt)}</p>
                  </div>
                  <Badge variant={statusVariant[app.status]} size="sm" dot>{capitalize(app.status)}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding="sm">
          <h3 className="text-sm font-medium text-text mb-3 px-1">Quick Actions</h3>
          <div className="space-y-2 px-1">
            <Link to="/applicant/jobs" className="block">
              <Button variant="outline" size="sm" fullWidth className="justify-start">Browse Jobs</Button>
            </Link>
            <Link to="/applicant/resume" className="block">
              <Button variant="outline" size="sm" fullWidth className="justify-start">Upload Resume</Button>
            </Link>
            <Link to="/applicant/profile" className="block">
              <Button variant="outline" size="sm" fullWidth className="justify-start">Complete Profile</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
