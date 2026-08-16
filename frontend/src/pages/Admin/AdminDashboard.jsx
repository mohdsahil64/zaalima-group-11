import { useQuery } from '@tanstack/react-query';
import {
  HiBuildingOffice2,
  HiUsers,
  HiBriefcase,
  HiDocumentText,
  HiClock,
  HiUserGroup,
  HiCheckCircle,
  HiRocketLaunch,
} from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { Card, PageHeader, Skeleton } from '@/components/common';

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: AdminService.getStats,
  });

  const stats = data?.data?.stats || {};

  const cards = [
    { label: 'Total Companies', value: stats.totalCompanies || 0, icon: HiBuildingOffice2, color: 'text-primary' },
    { label: 'Pending Approval', value: stats.pendingCompanies || 0, icon: HiClock, color: 'text-warning' },
    { label: 'Approved', value: stats.approvedCompanies || 0, icon: HiCheckCircle, color: 'text-success' },
    { label: 'Recruiters', value: stats.totalRecruiters || 0, icon: HiUsers, color: 'text-info' },
    { label: 'Applicants', value: stats.totalApplicants || 0, icon: HiUserGroup, color: 'text-primary-light' },
    { label: 'Total Jobs', value: stats.totalJobs || 0, icon: HiBriefcase, color: 'text-text-secondary' },
    { label: 'Active Jobs', value: stats.activeJobs || 0, icon: HiRocketLaunch, color: 'text-success' },
    { label: 'Applications', value: stats.totalApplications || 0, icon: HiDocumentText, color: 'text-warning' },
  ];

  if (isLoading) return <Skeleton.Dashboard />;

  return (
    <div className="page-enter">
      <PageHeader title="Dashboard" subtitle="Platform overview" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
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
    </div>
  );
};

export default AdminDashboard;
