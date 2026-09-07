import { useMemo, useState } from 'react';
import { Pagination } from '@/components/ui/Pagination';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import {
  CompaniesHeader,
  ManagedCompaniesToolbar,
  ManagedCompaniesTable,
  ConfirmDialog,
  CompanyFormModal,
  CompanyDetailsDrawer,
  type CompanyFilterState,
} from '@/features/companies/components';
import {
  useCreateManagedCompany,
  useUpdateManagedCompany,
  useDeleteManagedCompany,
  useManagedCompanies,
  useCompanyFilterOptions,
  useDebouncedValue,
} from '@/features/companies/hooks';
import { companyPermissionsForRole } from '@/features/companies/lib';
import { useOwnerOptions } from '@/features/contacts/hooks';
import type {
  CreateManagedCompanyInput,
  ManagedCompany,
  ManagedCompaniesSortField,
  UpdateManagedCompanyInput,
} from '@/features/companies/types';

const PAGE_SIZE = 10;

type DialogState =
  | { kind: 'create' }
  | { kind: 'edit'; company: ManagedCompany }
  | { kind: 'details'; company: ManagedCompany }
  | { kind: 'delete'; company: ManagedCompany }
  | null;

/**
 * Page Entreprises — module piloté par l'API réelle.
 *
 * Fournit le CRUD complet : liste paginée, recherche (debounce), filtres
 * (secteur / pays / ville), tri, création, modification, suppression
 * (soft delete) et détails. Les boutons sensibles sont conditionnés par
 * les permissions du rôle courant.
 */
export function CompaniesPage() {
  const { user } = useAuth();
  const permissions = companyPermissionsForRole(user?.role ?? 'viewer');

  const { success, error: notifyError } = useNotifications();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CompanyFilterState>({
    industry: '',
    country: '',
    city: '',
  });
  const [sort, setSort] = useState<ManagedCompaniesSortField>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [dialog, setDialog] = useState<DialogState>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const query = useMemo(() => {
    const q: {
      page: number;
      limit: number;
      search?: string;
      industry?: string;
      country?: string;
      city?: string;
      sort: ManagedCompaniesSortField;
      order: 'asc' | 'desc';
    } = {
      page,
      limit: PAGE_SIZE,
      sort,
      order,
    };
    if (debouncedSearch.trim()) q.search = debouncedSearch.trim();
    if (filters.industry) q.industry = filters.industry;
    if (filters.country) q.country = filters.country;
    if (filters.city) q.city = filters.city;
    return q;
  }, [page, debouncedSearch, filters, sort, order]);

  const { data, isLoading, isError, refetch } = useManagedCompanies(query);
  const { data: filterOptions } = useCompanyFilterOptions();
  const { data: ownerOptions = [] } = useOwnerOptions();

  const ownerSelectOptions = useMemo(
    () =>
      ownerOptions.map((o) => ({
        value: o.id,
        label: `${o.firstName} ${o.lastName}`,
      })),
    [ownerOptions],
  );

  const createMutation = useCreateManagedCompany();
  const updateMutation = useUpdateManagedCompany();
  const deleteMutation = useDeleteManagedCompany();

  const handleCreate = (input: CreateManagedCompanyInput) => {
    createMutation.mutate(input, {
      onSuccess: () => {
        success('Entreprise créée avec succès.');
        setDialog(null);
      },
      onError: (err) => notifyError(err.message),
    });
  };

  const handleUpdate = (input: UpdateManagedCompanyInput) => {
    if (dialog?.kind !== 'edit') return;
    updateMutation.mutate(
      { id: dialog.company.id, input },
      {
        onSuccess: () => {
          success('Entreprise mise à jour.');
          setDialog(null);
        },
        onError: (err) => notifyError(err.message),
      },
    );
  };

  const handleDelete = () => {
    if (dialog?.kind !== 'delete') return;
    deleteMutation.mutate(dialog.company.id, {
      onSuccess: () => {
        success('Entreprise supprimée.');
        setDialog(null);
      },
      onError: (err) => notifyError(err.message),
    });
  };

  const resetAndSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateFilters = (next: CompanyFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ industry: '', country: '', city: '' });
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch.trim() !== '' ||
    filters.industry !== '' ||
    filters.country !== '' ||
    filters.city !== '';

  const mutationBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const total = data?.total ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <CompaniesHeader totalCount={total} />

      <ManagedCompaniesToolbar
        searchQuery={search}
        onSearchChange={resetAndSearch}
        filters={filters}
        onFiltersChange={updateFilters}
        sort={sort}
        order={order}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        onOrderChange={() => {
          setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
          setPage(1);
        }}
        filterOptions={filterOptions}
        onRefresh={() => refetch()}
        isRefreshing={isLoading}
        canCreate={permissions.canCreate}
        onAdd={() => setDialog({ kind: 'create' })}
      />

      <ManagedCompaniesTable
        companies={data?.items ?? []}
        onView={(company) => setDialog({ kind: 'details', company })}
        onEdit={(company) => setDialog({ kind: 'edit', company })}
        onDelete={(company) => setDialog({ kind: 'delete', company })}
        canEdit={permissions.canUpdate}
        canDelete={permissions.canDelete}
        canCreate={permissions.canCreate}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onAdd={() => setDialog({ kind: 'create' })}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
      />

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-text-tertiary">
            {data.total} entreprise{data.total > 1 ? 's' : ''}
          </p>
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <CompanyFormModal
        open={dialog?.kind === 'create' || dialog?.kind === 'edit'}
        company={dialog?.kind === 'edit' ? dialog.company : null}
        ownerOptions={ownerSelectOptions}
        isSubmitting={mutationBusy}
        onClose={() => setDialog(null)}
        onSubmit={(input) =>
          dialog?.kind === 'edit'
            ? handleUpdate(input as UpdateManagedCompanyInput)
            : handleCreate(input as CreateManagedCompanyInput)
        }
      />

      <CompanyDetailsDrawer
        open={dialog?.kind === 'details'}
        company={dialog?.kind === 'details' ? dialog.company : null}
        onClose={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.kind === 'delete'}
        title="Supprimer cette entreprise ?"
        description={
          dialog?.kind === 'delete'
            ? `Cette action supprimera « ${dialog.company.name} » définitivement.`
            : ''
        }
        confirmLabel="Supprimer"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onClose={() => setDialog(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
