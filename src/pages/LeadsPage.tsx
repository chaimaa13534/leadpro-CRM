import { useMemo, useState } from 'react';
import { Pagination } from '@/components/ui/Pagination';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import {
  ManagedLeadsHeader,
  ManagedLeadsToolbar,
  ManagedLeadsTable,
  ConfirmLeadDialog,
  LeadFormModal,
  LeadDetailsDrawer,
  type LeadFilterState,
} from '@/features/leads/components';
import {
  useDeleteManagedLead,
  useCreateManagedLead,
  useUpdateManagedLead,
  useManagedLeads,
  useOwnerOptions,
  useLeadSourceOptions,
  useDebouncedValue,
} from '@/features/leads/hooks';
import { leadPermissionsForRole } from '@/features/leads/lib';
import { useManagedCompanies } from '@/features/companies/hooks';
import { useManagedContacts } from '@/features/contacts/hooks';
import type {
  CreateManagedLeadInput,
  ManagedLead,
  ManagedLeadsSortField,
  UpdateManagedLeadInput,
} from '@/features/leads/types/lead-management.types';

const PAGE_SIZE = 10;

type DialogState =
  | { kind: 'create' }
  | { kind: 'edit'; lead: ManagedLead }
  | { kind: 'details'; lead: ManagedLead }
  | { kind: 'delete'; lead: ManagedLead }
  | null;

/**
 * Page Leads — module piloté par l'API réelle (MySQL/MariaDB).
 *
 * Fournit le CRUD complet : liste paginée, recherche (debounce), filtres
 * (statut, priorité, source, entreprise, responsable), tri, création,
 * modification, suppression (soft delete) et détails. Les boutons sensibles
 * sont conditionnés par les permissions du rôle courant.
 */
export function LeadsPage() {
  const { user } = useAuth();
  const permissions = leadPermissionsForRole(user?.role ?? 'viewer');

  const { success, error: notifyError } = useNotifications();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<LeadFilterState>({
    status: '',
    priority: '',
    sourceId: '',
    ownerId: '',
    companyId: '',
  });
  const [sort, setSort] = useState<ManagedLeadsSortField>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [dialog, setDialog] = useState<DialogState>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const query = useMemo(() => {
    const q: {
      page: number;
      limit: number;
      search?: string;
      status?: ManagedLead['status'];
      priority?: ManagedLead['priority'];
      sourceId?: number;
      ownerId?: number;
      companyId?: number;
      sort: ManagedLeadsSortField;
      order: 'asc' | 'desc';
    } = {
      page,
      limit: PAGE_SIZE,
      sort,
      order,
    };
    if (debouncedSearch.trim()) q.search = debouncedSearch.trim();
    if (filters.status) q.status = filters.status as ManagedLead['status'];
    if (filters.priority)
      q.priority = filters.priority as ManagedLead['priority'];
    if (filters.sourceId) q.sourceId = Number(filters.sourceId);
    if (filters.ownerId) q.ownerId = Number(filters.ownerId);
    if (filters.companyId) q.companyId = Number(filters.companyId);
    return q;
  }, [page, debouncedSearch, filters, sort, order]);

  const { data, isLoading, isError, refetch } = useManagedLeads(query);
  const { data: ownerOptions = [] } = useOwnerOptions();
  const { data: sourceOptions = [] } = useLeadSourceOptions();

  // Companies for the select (first page, sorted by name).
  const { data: companiesPage } = useManagedCompanies({
    page: 1,
    limit: 100,
    sort: 'name',
    order: 'asc',
  });

  // Contacts for the select (first page, sorted by first name).
  const { data: contactsPage } = useManagedContacts({
    page: 1,
    limit: 100,
    sort: 'first_name',
    order: 'asc',
  });

  const companyOptions = useMemo(
    () =>
      (companiesPage?.items ?? []).map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    [companiesPage],
  );

  const contactOptions = useMemo(
    () =>
      (contactsPage?.items ?? []).map((c) => ({
        value: String(c.id),
        label: `${c.firstName} ${c.lastName}`,
      })),
    [contactsPage],
  );

  const ownerSelectOptions = useMemo(
    () =>
      ownerOptions.map((o) => ({
        value: String(o.id),
        label: `${o.firstName} ${o.lastName}`,
      })),
    [ownerOptions],
  );

  const sourceSelectOptions = useMemo(
    () =>
      sourceOptions.map((s) => ({
        value: String(s.id),
        label: s.name,
      })),
    [sourceOptions],
  );

  const createMutation = useCreateManagedLead();
  const updateMutation = useUpdateManagedLead();
  const deleteMutation = useDeleteManagedLead();

  const handleCreate = (input: CreateManagedLeadInput) => {
    createMutation.mutate(input, {
      onSuccess: () => {
        success('Lead créé avec succès.');
        setDialog(null);
      },
      onError: (err) => notifyError(err.message),
    });
  };

  const handleUpdate = (input: UpdateManagedLeadInput) => {
    if (dialog?.kind !== 'edit') return;
    updateMutation.mutate(
      { id: dialog.lead.id, input },
      {
        onSuccess: () => {
          success('Lead mis à jour.');
          setDialog(null);
        },
        onError: (err) => notifyError(err.message),
      },
    );
  };

  const handleDelete = () => {
    if (dialog?.kind !== 'delete') return;
    deleteMutation.mutate(dialog.lead.id, {
      onSuccess: () => {
        success('Lead supprimé.');
        setDialog(null);
      },
      onError: (err) => notifyError(err.message),
    });
  };

  const resetAndSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateFilters = (next: LeadFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      sourceId: '',
      ownerId: '',
      companyId: '',
    });
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch.trim() !== '' ||
    filters.status !== '' ||
    filters.priority !== '' ||
    filters.sourceId !== '' ||
    filters.ownerId !== '' ||
    filters.companyId !== '';

  const mutationBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const total = data?.total ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <ManagedLeadsHeader totalCount={total} />

      <ManagedLeadsToolbar
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
        companyOptions={companyOptions}
        ownerOptions={ownerSelectOptions}
        sourceOptions={sourceSelectOptions}
        onRefresh={() => refetch()}
        isRefreshing={isLoading}
        canCreate={permissions.canCreate}
        onAdd={() => setDialog({ kind: 'create' })}
      />

      <ManagedLeadsTable
        leads={data?.items ?? []}
        onView={(lead) => setDialog({ kind: 'details', lead })}
        onEdit={(lead) => setDialog({ kind: 'edit', lead })}
        onDelete={(lead) => setDialog({ kind: 'delete', lead })}
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
            {data.total} lead{data.total > 1 ? 's' : ''}
          </p>
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <LeadFormModal
        open={dialog?.kind === 'create' || dialog?.kind === 'edit'}
        lead={dialog?.kind === 'edit' ? dialog.lead : null}
        companyOptions={companyOptions}
        contactOptions={contactOptions}
        ownerOptions={ownerSelectOptions}
        sourceOptions={sourceSelectOptions}
        isSubmitting={mutationBusy}
        onClose={() => setDialog(null)}
        onSubmit={(input) =>
          dialog?.kind === 'edit'
            ? handleUpdate(input as UpdateManagedLeadInput)
            : handleCreate(input as CreateManagedLeadInput)
        }
      />

      <LeadDetailsDrawer
        open={dialog?.kind === 'details'}
        lead={dialog?.kind === 'details' ? dialog.lead : null}
        onClose={() => setDialog(null)}
      />

      <ConfirmLeadDialog
        open={dialog?.kind === 'delete'}
        leadName={
          dialog?.kind === 'delete'
            ? dialog.lead.contact
              ? `${dialog.lead.contact.firstName} ${dialog.lead.contact.lastName}`
              : `Lead #${dialog.lead.id}`
            : ''
        }
        isLoading={deleteMutation.isPending}
        onClose={() => setDialog(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
