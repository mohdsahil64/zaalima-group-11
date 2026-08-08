import { Card, PageHeader, Button } from '@/components/common';

const AdminSettings = () => {
  return (
    <div>
      <PageHeader title="Admin Settings" subtitle="Platform configuration" />

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Platform Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-text">Auto-approve Companies</p>
                <p className="text-xs text-text-secondary">Automatically approve new company registrations</p>
              </div>
              <Button variant="secondary" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-text">Email Notifications</p>
                <p className="text-xs text-text-secondary">Configure platform email notifications</p>
              </div>
              <Button variant="secondary" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-text">Maintenance Mode</p>
                <p className="text-xs text-text-secondary">Put the platform in maintenance mode</p>
              </div>
              <Button variant="secondary" size="sm">Toggle</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
