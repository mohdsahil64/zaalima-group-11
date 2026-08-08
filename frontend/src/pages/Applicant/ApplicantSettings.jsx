import { Card, PageHeader, Button } from '@/components/common';

const ApplicantSettings = () => {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-text">Email Notifications</p>
                <p className="text-xs text-text-secondary">Receive updates about your applications</p>
              </div>
              <Button variant="secondary" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-text">Change Password</p>
                <p className="text-xs text-text-secondary">Update your password for security</p>
              </div>
              <Button variant="secondary" size="sm">Update</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-text">Delete Account</p>
                <p className="text-xs text-text-secondary">Permanently delete your account and data</p>
              </div>
              <Button variant="danger" size="sm">Delete</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantSettings;
