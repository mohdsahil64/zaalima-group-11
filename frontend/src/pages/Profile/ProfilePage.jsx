import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Avatar } from '@/components/common';
import { capitalize } from '@/utils';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your personal information" />

      <Card>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <Avatar
            src={user?.avatar}
            firstName={user?.firstName}
            lastName={user?.lastName}
            size="xl"
          />
          <div>
            <h2 className="text-xl font-semibold text-text">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-text-secondary">{user?.email}</p>
            <p className="text-sm text-text-secondary mt-1">{capitalize(user?.role)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
            <p className="text-text">{user?.firstName || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
            <p className="text-text">{user?.lastName || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <p className="text-text">{user?.email || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
            <p className="text-text">{user?.phone || 'Not provided'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
