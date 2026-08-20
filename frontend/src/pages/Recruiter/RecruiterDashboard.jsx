import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  HiBriefcase,
  HiDocumentText,
  HiUsers,
  HiCalendarDays,
  HiGift,
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import ApplicationService from '@/services/application.service';
import JobService from '@/services/job.service';
import { Card, PageHeader, Skeleton, Badge, Button } from '@/components/common';

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['recruiter', 'stats'],
    queryFn: () => ApplicationService.getRecruiterStats(),
  });

  const { data: jobsData } = useQuery({
    queryKey: ['recruiter', 'jobs', { limit: 5 }],
    queryFn: () => JobService.getMyJobs({ limit: 5 }),
  });

  const stats = statsData?.data?.stats || {};
  const recentJobs = jobsData?.data || [];

  const cards = [
    { label: 'Active Jobs', value: recentJobs.filter(j => j.status === 'open').length, icon: HiBriefcase, color: 'text-primary' },
    { label: 'Applications', value: stats.total || 0, icon: HiDocumentText, color: 'text-info' },
    { label: 'Shortlisted', value: stats.shortlisted || 0, icon: HiUsers, color: 'text-primary-light' },
    { label: 'Interviews', value: stats.interview || 0, icon: HiCalendarDays, color: 'text-warning' },
    { label: 'Offers', value: stats.offered || 0, icon: HiGift, color: 'text-success' },
  ];

  if (isLoading) return <Skeleton.Dashboard />;

  return (
    <div className="page-enter">
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        subtitle="Here's what's happening with your hiring"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="sm">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-medium text-text">Recent Jobs</h3>
            <Link to="/recruiter/jobs"><Button variant="ghost" size="xs">View all</Button></Link>
          </div>
          {recentJobs.length === 0 ? (
            <p className="text-xs text-text-muted px-1 py-4">No jobs posted yet</p>
          ) : (
            <div className="space-y-1">
              {recentJobs.slice(0, 5).map((job) => (
                <div key={job._id} className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-hover transition-colors">
                  <div>
                    <p className="text-xs font-medium text-text">{job.title}</p>
                    <p className="text-[11px] text-text-muted">{job.totalApplications} applications</p>
                  </div>
                  <Badge variant={job.status === 'open' ? 'success' : 'default'} size="sm" dot>{job.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding="sm">
          <h3 className="text-sm font-medium text-text mb-3 px-1">Pipeline Summary</h3>
          <div className="space-y-2.5 px-1">
            {[
              { label: 'Applied', value: stats.applied || 0, color: 'bg-info' },
              { label: 'Shortlisted', value: stats.shortlisted || 0, color: 'bg-primary' },
              { label: 'Interview', value: stats.interview || 0, color: 'bg-warning' },
              { label: 'Offered', value: stats.offered || 0, color: 'bg-success' },
              { label: 'Rejected', value: stats.rejected || 0, color: 'bg-error' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-text-secondary">{item.label}</span>
                </div>
                <span className="text-xs font-medium text-text">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
