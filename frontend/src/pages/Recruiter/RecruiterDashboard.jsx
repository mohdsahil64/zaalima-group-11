import { HiBriefcase, HiDocumentText, HiUsers, HiChartBar } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader } from '@/components/common';

const stats = [
  { label: 'Active Jobs', value: '0', icon: HiBriefcase, color: 'text-primary' },
  { label: 'Applications', value: '0', icon: HiDocumentText, color: 'text-info' },
  { label: 'Candidates', value: '0', icon: HiUsers, color: 'text-success' },
  { label: 'Interviews', value: '0', icon: HiChartBar, color: 'text-warning' },
];

const RecruiterDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName}!`}
        subtitle="Here's an overview of your recruitment activity"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Recent Applications</h3>
          <p className="text-sm text-text-secondary">No applications yet</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Active Job Listings</h3>
          <p className="text-sm text-text-secondary">No active jobs</p>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
