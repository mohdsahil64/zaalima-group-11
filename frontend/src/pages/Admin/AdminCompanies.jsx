import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, SearchBox, Select, Badge, EmptyState, Button, Skeleton } from '@/components/common';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'suspended', label: 'Suspended' },
];

const statusVariant = { pending: 'warning', approved: 'success', rejected: 'error', suspended: 'default' };

const AdminCompanies = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'companies', { search, status: statusFilter }],
    queryFn: () => AdminService.getCompanies({ search, status: statusFilter, limit: 20 }),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => AdminService.approveCompany(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin'] }); toast.success('Company approved'); },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => AdminService.rejectCompany(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin'] }); toast.success('Company rejected'); },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => AdminService.suspendCompany(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin'] }); toast.success('Company suspended'); },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const reactivateMutation = useMutation({
    mutationFn: (id) => AdminService.reactivateCompany(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin'] }); toast.success('Company reactivated'); },
    onError: (err) => toast.error(err.message || 'Failed'),
  });

  const companies = data?.data || [];

  if (isLoading) return <Skeleton.Table rows={6} />;

  return (
    <div className="page-enter">
      <PageHeader title="Companies" subtitle="Manage registered companies" />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search companies..." className="flex-1 max-w-sm" />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Status"
          className="w-full sm:w-40"
        />
      </div>

      <Card padding="none">
        {companies.length === 0 ? (
          <EmptyState icon={HiBuildingOffice2} title="No companies found" description="Companies will appear here once recruiters register." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Company</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Owner</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Created</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-text">{company.name}</p>
                      <p className="text-[11px] text-text-muted">{company.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      {company.owner ? `${company.owner.firstName} ${company.owner.lastName}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[company.status]} dot>{company.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted">{formatDate(company.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {company.status === 'pending' && (
                          <>
                            <Button size="xs" onClick={() => approveMutation.mutate(company._id)}>Approve</Button>
                            <Button size="xs" variant="danger" onClick={() => rejectMutation.mutate(company._id)}>Reject</Button>
                          </>
                        )}
                        {company.status === 'approved' && (
                          <Button size="xs" variant="danger" onClick={() => suspendMutation.mutate(company._id)}>Suspend</Button>
                        )}
                        {(company.status === 'suspended' || company.status === 'rejected') && (
                          <Button size="xs" variant="outline" onClick={() => reactivateMutation.mutate(company._id)}>Reactivate</Button>
                        )}
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
