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
import { Card, PageHeader, Loader } from '@/components/common';

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: AdminService.getStats,
  });

  const stats = data?.data?.stats || {};

  const cards = [
    { label: 'Total Companies', value: stats.totalCompanies || 0, icon: HiBuildingOffice2, color: 'text-primary' },
    { label: 'Pending Companies', value: stats.pendingCompanies || 0, icon: HiClock, color: 'text-warning' },
    { label: 'Approved Companies', value: stats.approvedCompanies || 0, icon: HiCheckCircle, color: 'text-success' },
    { label: 'Total Recruiters', value: stats.totalRecruiters || 0, icon: HiUsers, color: 'text-info' },
    { label: 'Total Applicants', value: stats.totalApplicants || 0, icon: HiUserGroup, color: 'text-purple-400' },
    { label: 'Total Jobs', value: stats.totalJobs || 0, icon: HiBriefcase, color: 'text-indigo-400' },
    { label: 'Active Jobs', value: stats.activeJobs || 0, icon: HiRocketLaunch, color: 'text-success' },
    { label: 'Total Applications', value: stats.totalApplications || 0, icon: HiDocumentText, color: 'text-warning' },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Overview of the entire platform" />

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
    </div>
  );
};

export default AdminDashboard;
