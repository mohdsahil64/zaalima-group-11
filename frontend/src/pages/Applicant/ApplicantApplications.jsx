import { HiDocumentText } from 'react-icons/hi2';
import { PageHeader, Card, EmptyState } from '@/components/common';

const ApplicantApplications = () => {
  // Placeholder - will be replaced with API data
  const applications = [];

  return (
    <div>
      <PageHeader
        title="My Applications"
        subtitle="Track the status of your job applications"
      />

      <Card padding="none">
        {applications.length === 0 ? (
          <EmptyState
            icon={HiDocumentText}
            title="No applications yet"
            description="Browse jobs and apply to get started."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Applied Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm text-text">{app.jobTitle}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.company}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.appliedDate}</td>
                    <td className="px-4 py-3 text-sm">{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicantApplications;
