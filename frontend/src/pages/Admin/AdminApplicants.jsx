import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiUserGroup } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, SearchBox, EmptyState, Badge, Button, Skeleton } from '@/components/common';
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'applicants'] }); toast.success('Updated'); },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const applicants = data?.data || [];

  if (isLoading) return <Skeleton.Table rows={5} />;

  return (
    <div className="page-enter">
      <PageHeader title="Applicants" subtitle="View all registered applicants" />
      <div className="mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search..." className="max-w-sm" />
      </div>
      <Card padding="none">
        {applicants.length === 0 ? (
          <EmptyState icon={HiUserGroup} title="No applicants" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Name</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Email</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Joined</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {applicants.map((a) => (
                  <tr key={a._id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-text">{a.firstName} {a.lastName}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{a.email}</td>
                    <td className="px-4 py-3"><Badge variant={a.isActive ? 'success' : 'error'} dot>{a.isActive ? 'Active' : 'Suspended'}</Badge></td>
                    <td className="px-4 py-3 text-xs text-text-muted">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Button size="xs" variant={a.isActive ? 'danger' : 'outline'} onClick={() => toggleMutation.mutate(a._id)}>
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
