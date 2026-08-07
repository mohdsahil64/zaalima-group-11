import { HiDocumentText, HiClipboardDocumentCheck, HiCalendar, HiEye } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader } from '@/components/common';

const stats = [
  { label: 'Applications', value: '0', icon: HiDocumentText, color: 'text-primary' },
  { label: 'Shortlisted', value: '0', icon: HiClipboardDocumentCheck, color: 'text-success' },
  { label: 'Interviews', value: '0', icon: HiCalendar, color: 'text-warning' },
  { label: 'Profile Views', value: '0', icon: HiEye, color: 'text-info' },
];

const ApplicantDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName}!`}
        subtitle="Track your job applications and interviews"
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

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">My Applications</h3>
          <p className="text-sm text-text-secondary">No applications yet. Start applying to jobs!</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Recommended Jobs</h3>
          <p className="text-sm text-text-secondary">Complete your profile to get job recommendations</p>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
