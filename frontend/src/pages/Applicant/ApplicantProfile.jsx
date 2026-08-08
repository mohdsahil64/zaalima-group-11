import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Input, Textarea, Button } from '@/components/common';

const ApplicantProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information"
      />

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Personal Information</h3>
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="First Name" placeholder="John" defaultValue={user?.firstName} />
              <Input label="Last Name" placeholder="Doe" defaultValue={user?.lastName} />
              <Input label="Email" type="email" placeholder="you@example.com" defaultValue={user?.email} disabled />
              <Input label="Phone" placeholder="+1 (555) 000-0000" defaultValue={user?.phone || ''} />
              <Input label="Location" placeholder="City, Country" />
              <Input label="Portfolio / Website" placeholder="https://yoursite.com" />
            </div>
            <div className="flex justify-end">
              <Button type="button">Save Changes</Button>
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Skills</h3>
          <Textarea placeholder="Enter your skills separated by commas (e.g. JavaScript, React, Node.js, Python)" rows={3} />
          <div className="flex justify-end mt-4">
            <Button type="button" variant="secondary">Update Skills</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Experience</h3>
          <p className="text-sm text-text-secondary">No experience added yet. Add your work history to strengthen your profile.</p>
          <div className="mt-4">
            <Button type="button" variant="secondary">Add Experience</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantProfile;
