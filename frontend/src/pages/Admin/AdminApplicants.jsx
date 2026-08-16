import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiUserGroup } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, SearchBox, EmptyState, Badge, Button, Loader } from '@/components/common';
import { formatDate } from '@/utils';
import toast from 'react-hot-toast';

const AdminApplicants = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'applicants', { search }],
    queryFn: () => AdminService.getApplicants({ search, limit: 20 }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => AdminService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'applicants'] });
      toast.success('Status updated');
    },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const applicants = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Applicants" subtitle="View all registered applicants" />

      <div className="mb-6">
        <SearchBox value={search} onChange={setSearch} placeholder="Search applicants..." className="max-w-md" />
      </div>

      <Card padding="none">
        {applicants.length === 0 ? (
          <EmptyState icon={HiUserGroup} title="No applicants yet" description="Applicants will appear once they register." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applicants.map((a) => (
                  <tr key={a._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm text-text">{a.firstName} {a.lastName}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{a.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={a.isActive ? 'success' : 'error'}>
                        {a.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant={a.isActive ? 'danger' : 'outline'}
                        onClick={() => toggleMutation.mutate(a._id)}
                      >
                        {a.isActive ? 'Suspend' : 'Activate'}
                      </Button>
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

export default AdminApplicants;
