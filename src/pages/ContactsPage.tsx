import { useMemo, useState } from 'react';
import { Pagination } from '@/components/ui/Pagination';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import {
  ManagedContactsHeader,
  ManagedContactsToolbar,
  ManagedContactsTable,
  ConfirmContactDialog,
  ContactFormModal,
  ContactDetailsDrawer,
  type ContactFilterState,
} from '@/features/contacts/components';
import {
  useDeleteManagedContact,
  useCreateManagedContact,
  useUpdateManagedContact,
  useManagedContacts,
  useOwnerOptions,
  useDebouncedValue,
} from '@/features/contacts/hooks';
import { contactPermissionsForRole } from '@/features/contacts/lib';
import { useManagedCompanies } from '@/features/companies/hooks';
import type {
  CreateManagedContactInput,
  ManagedContact,
  ManagedContactsSortField,
  UpdateManagedContactInput,
} from '@/features/contacts/types';

const PAGE_SIZE = 10;

type DialogState =
  | { kind: 'create' }
  | { kind: 'edit'; contact: ManagedContact }
  | { kind: 'details'; contact: ManagedContact }
  | { kind: 'delete'; contact: ManagedContact }
  | null;

/**
 * Page Contacts — module piloté par l'API réelle.
 *
 * Fournit le CRUD complet : liste paginée, recherche (debounce), filtres
 * (entreprise / responsable), tri, création, modification, suppression
 * (soft delete) et détails. Les boutons sensibles sont conditionnés par
 * les permissions du rôle courant.
 */
export function ContactsPage() {
  const { user } = useAuth();
  const permissions = contactPermissionsForRole(user?.role ?? 'viewer');

  const { success, error: notifyError } = useNotifications();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ContactFilterState>({
    companyId: '',
    ownerId: '',
  });
  const [sort, setSort] = useState<ManagedContactsSortField>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [dialog, setDialog] = useState<DialogState>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const query = useMemo(() => {
    const q: {
      page: number;
      limit: number;
      search?: string;
      companyId?: number;
      ownerId?: number;
      sort: ManagedContactsSortField;
      order: 'asc' | 'desc';
    } = {
      page,
      limit: PAGE_SIZE,
      sort,
      order,
    };
    if (debouncedSearch.trim()) q.search = debouncedSearch.trim();
    if (filters.companyId) q.companyId = Number(filters.companyId);
    if (filters.ownerId) q.ownerId = Number(filters.ownerId);
    return q;
  }, [page, debouncedSearch, filters, sort, order]);

  const { data, isLoading, isError, refetch } = useManagedContacts(query);
  const { data: ownerOptions = [] } = useOwnerOptions();

  // Companies for the select (first page, sorted by name).
  const { data: companiesPage } = useManagedCompanies({
    page: 1,
    limit: 100,
    sort: 'name',
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

  const ownerSelectOptions = useMemo(
    () =>
      ownerOptions.map((o) => ({
        value: String(o.id),
        label: `${o.firstName} ${o.lastName}`,
      })),
    [ownerOptions],
  );

  const createMutation = useCreateManagedContact();
  const updateMutation = useUpdateManagedContact();
  const deleteMutation = useDeleteManagedContact();

  const handleCreate = (input: CreateManagedContactInput) => {
    createMutation.mutate(input, {
      onSuccess: () => {
        success('Contact créé avec succès.');
        setDialog(null);
      },
      onError: (err) => notifyError(err.message),
    });
  };

  const handleUpdate = (input: UpdateManagedContactInput) => {
    if (dialog?.kind !== 'edit') return;
    updateMutation.mutate(
      { id: dialog.contact.id, input },
      {
        onSuccess: () => {
          success('Contact mis à jour.');
          setDialog(null);
        },
        onError: (err) => notifyError(err.message),
      },
    );
  };

  const handleDelete = () => {
    if (dialog?.kind !== 'delete') return;
    deleteMutation.mutate(dialog.contact.id, {
      onSuccess: () => {
        success('Contact supprimé.');
        setDialog(null);
      },
      onError: (err) => notifyError(err.message),
    });
  };

  const resetAndSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateFilters = (next: ContactFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ companyId: '', ownerId: '' });
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch.trim() !== '' ||
    filters.companyId !== '' ||
    filters.ownerId !== '';

  const mutationBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const total = data?.total ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <ManagedContactsHeader totalCount={total} />

      <ManagedContactsToolbar
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
        onRefresh={() => refetch()}
        isRefreshing={isLoading}
        canCreate={permissions.canCreate}
        onAdd={() => setDialog({ kind: 'create' })}
      />

      <ManagedContactsTable
        contacts={data?.items ?? []}
        onView={(contact) => setDialog({ kind: 'details', contact })}
        onEdit={(contact) => setDialog({ kind: 'edit', contact })}
        onDelete={(contact) => setDialog({ kind: 'delete', contact })}
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
            {data.total} contact{data.total > 1 ? 's' : ''}
          </p>
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <ContactFormModal
        open={dialog?.kind === 'create' || dialog?.kind === 'edit'}
        contact={dialog?.kind === 'edit' ? dialog.contact : null}
        companyOptions={companyOptions}
        ownerOptions={ownerSelectOptions}
        isSubmitting={mutationBusy}
        onClose={() => setDialog(null)}
        onSubmit={(input) =>
          dialog?.kind === 'edit'
            ? handleUpdate(input as UpdateManagedContactInput)
            : handleCreate(input as CreateManagedContactInput)
        }
      />

      <ContactDetailsDrawer
        open={dialog?.kind === 'details'}
        contact={dialog?.kind === 'details' ? dialog.contact : null}
        onClose={() => setDialog(null)}
      />

      <ConfirmContactDialog
        open={dialog?.kind === 'delete'}
        contactName={
          dialog?.kind === 'delete'
            ? `${dialog.contact.firstName} ${dialog.contact.lastName}`
            : ''
        }
        isLoading={deleteMutation.isPending}
        onClose={() => setDialog(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
