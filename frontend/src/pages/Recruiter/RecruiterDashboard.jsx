import { useQuery } from '@tanstack/react-query';
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
import { Card, PageHeader, Loader, Badge } from '@/components/common';

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading: statsLoading } = useQuery({
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
    { label: 'Total Applications', value: stats.total || 0, icon: HiDocumentText, color: 'text-info' },
    { label: 'Shortlisted', value: stats.shortlisted || 0, icon: HiUsers, color: 'text-purple-400' },
    { label: 'Interviews', value: stats.interview || 0, icon: HiCalendarDays, color: 'text-warning' },
    { label: 'Offers', value: stats.offered || 0, icon: HiGift, color: 'text-success' },
  ];

  if (statsLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName}!`}
        subtitle="Here's an overview of your recruitment activity"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary">{stat.label}</p>
                <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-[12px] bg-surface ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Recent Jobs</h3>
          {recentJobs.length === 0 ? (
            <p className="text-sm text-text-secondary">No jobs posted yet</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.slice(0, 5).map((job) => (
                <div key={job._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text">{job.title}</p>
                    <p className="text-xs text-text-secondary">{job.totalApplications} applications</p>
                  </div>
                  <Badge variant={job.status === 'open' ? 'success' : 'default'}>{job.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Application Pipeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Applied</span>
              <span className="text-sm font-medium text-text">{stats.applied || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Shortlisted</span>
              <span className="text-sm font-medium text-text">{stats.shortlisted || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Interview</span>
              <span className="text-sm font-medium text-text">{stats.interview || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Offered</span>
              <span className="text-sm font-medium text-text">{stats.offered || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Rejected</span>
              <span className="text-sm font-medium text-text">{stats.rejected || 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
