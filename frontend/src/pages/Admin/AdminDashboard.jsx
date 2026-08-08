import {
  HiBuildingOffice2,
  HiUsers,
  HiBriefcase,
  HiDocumentText,
  HiClock,
  HiUserGroup,
} from 'react-icons/hi2';
import { Card, PageHeader } from '@/components/common';

const stats = [
  { label: 'Total Companies', value: '0', icon: HiBuildingOffice2, color: 'text-primary' },
  { label: 'Pending Companies', value: '0', icon: HiClock, color: 'text-warning' },
  { label: 'Total Recruiters', value: '0', icon: HiUsers, color: 'text-info' },
  { label: 'Total Applicants', value: '0', icon: HiUserGroup, color: 'text-success' },
  { label: 'Total Jobs', value: '0', icon: HiBriefcase, color: 'text-purple-400' },
  { label: 'Total Applications', value: '0', icon: HiDocumentText, color: 'text-indigo-400' },
];

const AdminDashboard = () => {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of the entire platform"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
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
          <h3 className="text-lg font-semibold text-text mb-4">Recent Registrations</h3>
          <p className="text-sm text-text-secondary">No recent registrations</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Pending Approvals</h3>
          <p className="text-sm text-text-secondary">No pending approvals</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
