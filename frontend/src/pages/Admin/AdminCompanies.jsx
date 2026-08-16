import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import AdminService from '@/services/admin.service';
import { PageHeader, Card, SearchBox, Select, Badge, EmptyState, Button, Loader } from '@/components/common';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'suspended', label: 'Suspended' },
];

const statusVariant = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  suspended: 'default',
};

const AdminCompanies = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'companies', { search, status: statusFilter, page }],
    queryFn: () => AdminService.getCompanies({ search, status: statusFilter, page, limit: 10 }),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => AdminService.approveCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast.success('Company approved');
    },
    onError: (err) => toast.error(err.message || 'Failed to approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => AdminService.rejectCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast.success('Company rejected');
    },
    onError: (err) => toast.error(err.message || 'Failed to reject'),
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => AdminService.suspendCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
      toast.success('Company suspended');
    },
    onError: (err) => toast.error(err.message || 'Failed to suspend'),
  });

  const reactivateMutation = useMutation({
    mutationFn: (id) => AdminService.reactivateCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
      toast.success('Company reactivated');
    },
    onError: (err) => toast.error(err.message || 'Failed to reactivate'),
  });

  const companies = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Companies" subtitle="Manage registered companies" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search companies..."
          className="flex-1 max-w-md"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          placeholder="All Status"
          className="w-full sm:w-48"
        />
      </div>

      <Card padding="none">
        {companies.length === 0 ? (
          <EmptyState
            icon={HiBuildingOffice2}
            title="No companies found"
            description="Companies will appear here once recruiters register."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Owner</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-text">{company.name}</p>
                        <p className="text-xs text-text-secondary">{company.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {company.owner ? `${company.owner.firstName} ${company.owner.lastName}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[company.status] || 'default'}>
                        {company.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(company.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {company.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approveMutation.mutate(company._id)}
                              loading={approveMutation.isPending}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => rejectMutation.mutate(company._id)}
                              loading={rejectMutation.isPending}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {company.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => suspendMutation.mutate(company._id)}
                            loading={suspendMutation.isPending}
                          >
                            Suspend
                          </Button>
                        )}
                        {(company.status === 'suspended' || company.status === 'rejected') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reactivateMutation.mutate(company._id)}
                            loading={reactivateMutation.isPending}
                          >
                            Reactivate
                          </Button>
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
