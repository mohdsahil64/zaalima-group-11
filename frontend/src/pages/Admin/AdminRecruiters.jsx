import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiUsers } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, SearchBox, EmptyState, Badge, Button, Loader } from '@/components/common';
import { formatDate } from '@/utils';
import toast from 'react-hot-toast';

const AdminRecruiters = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'recruiters', { search }],
    queryFn: () => AdminService.getRecruiters({ search, limit: 20 }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => AdminService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'recruiters'] });
      toast.success('Status updated');
    },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const recruiters = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Recruiters" subtitle="Manage all recruiters on the platform" />

      <div className="mb-6">
        <SearchBox value={search} onChange={setSearch} placeholder="Search recruiters..." className="max-w-md" />
      </div>

      <Card padding="none">
        {recruiters.length === 0 ? (
          <EmptyState icon={HiUsers} title="No recruiters yet" description="Recruiters will appear here once they register." />
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
                {recruiters.map((r) => (
                  <tr key={r._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm text-text">{r.firstName} {r.lastName}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{r.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.isActive ? 'success' : 'error'}>
                        {r.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant={r.isActive ? 'danger' : 'outline'}
                        onClick={() => toggleMutation.mutate(r._id)}
                      >
                        {r.isActive ? 'Suspend' : 'Activate'}
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

export default AdminRecruiters;
