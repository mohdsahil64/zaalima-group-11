import { useState } from 'react';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import { PageHeader, Card, SearchBox, Badge, EmptyState, Button } from '@/components/common';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  suspended: 'default',
};

const AdminCompanies = () => {
  const [search, setSearch] = useState('');

  // Placeholder data - will be replaced with API calls
  const companies = [];

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Manage registered companies"
      />

      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search companies by name or email..."
          className="max-w-md"
        />
      </div>

      <Card padding="none">
        {companies.length === 0 ? (
          <EmptyState
            icon={HiBuildingOffice2}
            title="No companies registered"
            description="Companies will appear here once recruiters register."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Company Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm text-text">{company.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{company.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[company.status]}>{company.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{company.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">View</Button>
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="danger">Reject</Button>
                      </div>
                    </td>
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

export default AdminCompanies;
