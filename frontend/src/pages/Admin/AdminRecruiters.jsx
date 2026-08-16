import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiUsers } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, SearchBox, EmptyState, Badge, Button, Skeleton } from '@/components/common';
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'recruiters'] }); toast.success('Updated'); },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const recruiters = data?.data || [];

  if (isLoading) return <Skeleton.Table rows={5} />;

  return (
    <div className="page-enter">
      <PageHeader title="Recruiters" subtitle="Manage platform recruiters" />
      <div className="mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search..." className="max-w-sm" />
      </div>
      <Card padding="none">
        {recruiters.length === 0 ? (
          <EmptyState icon={HiUsers} title="No recruiters" />
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
                {recruiters.map((r) => (
                  <tr key={r._id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-text">{r.firstName} {r.lastName}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{r.email}</td>
                    <td className="px-4 py-3"><Badge variant={r.isActive ? 'success' : 'error'} dot>{r.isActive ? 'Active' : 'Suspended'}</Badge></td>
                    <td className="px-4 py-3 text-xs text-text-muted">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Button size="xs" variant={r.isActive ? 'danger' : 'outline'} onClick={() => toggleMutation.mutate(r._id)}>
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
