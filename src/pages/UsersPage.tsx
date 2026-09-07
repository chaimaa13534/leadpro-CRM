import { useMemo, useState } from 'react';
import { Plus, Search, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useChangeManagedUserStatus,
  useCreateManagedUser,
  useDebouncedValue,
  useDeleteManagedUser,
  useManagedUsers,
  useUpdateManagedUser,
} from '../features/users/hooks';
import { USER_ROLE_OPTIONS } from '../features/users/constants/user-roles.constants';
import {
  ConfirmDialog,
  UserDetailsModal,
  UserFormModal,
  UsersTable,
} from '../features/users/components';
import type {
  CreateManagedUserInput,
  ManagedUser,
  ManagedUsersQuery,
  UserManagementRole,
  UpdateManagedUserInput,
} from '../features/users/types/user-management.types';

const PAGE_SIZE = 10;

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'active', label: 'Actifs' },
  { value: 'inactive', label: 'Inactifs' },
];

const ROLE_FILTER_OPTIONS = [
  { value: '', label: 'Tous les rôles' },
  ...USER_ROLE_OPTIONS,
];

const SORT_OPTIONS = [
  { value: 'first_name', label: 'Prénom' },
  { value: 'last_name', label: 'Nom' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Rôle' },
  { value: 'created_at', label: 'Créé le' },
];

type DialogState =
  | { kind: 'create' }
  | { kind: 'edit'; user: ManagedUser }
  | { kind: 'details'; user: ManagedUser }
  | { kind: 'toggle'; user: ManagedUser }
  | { kind: 'delete'; user: ManagedUser }
  | null;

/**
 * Page de gestion des utilisateurs (réservée aux administrateurs via
 * `AdminRoute`). Fournit le CRUD complet : liste paginée, recherche, filtres,
 * tri, création, modification, activation/désactivation et suppression.
 */
export function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dialog, setDialog] = useState<DialogState>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const query: ManagedUsersQuery = useMemo(() => {
    const filters: ManagedUsersQuery = {
      page,
      limit: PAGE_SIZE,
      sort: sortBy as ManagedUsersQuery['sort'],
      order: sortOrder,
    };
    if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();
    if (roleFilter) filters.role = roleFilter as UserManagementRole;
    if (statusFilter === 'active') filters.isActive = true;
    if (statusFilter === 'inactive') filters.isActive = false;
    return filters;
  }, [page, debouncedSearch, roleFilter, statusFilter, sortBy, sortOrder]);

  const { data, isLoading, isError, refetch } = useManagedUsers(query);

  const createMutation = useCreateManagedUser();
  const updateMutation = useUpdateManagedUser();
  const statusMutation = useChangeManagedUserStatus();
  const deleteMutation = useDeleteManagedUser();

  const handleCreate = (input: CreateManagedUserInput) => {
    createMutation.mutate(input, {
      onSuccess: () => setDialog(null),
      onError: (err) => console.error('create failed', err),
    });
  };

  const handleUpdate = (input: UpdateManagedUserInput) => {
    if (dialog?.kind !== 'edit') return;
    updateMutation.mutate(
      { id: dialog.user.id, input },
      {
        onSuccess: () => setDialog(null),
        onError: (err) => console.error('update failed', err),
      },
    );
  };

  const handleToggleStatus = () => {
    if (dialog?.kind !== 'toggle') return;
    statusMutation.mutate(
      { id: dialog.user.id, isActive: !dialog.user.isActive },
      {
        onSuccess: () => setDialog(null),
        onError: (err) => console.error('status failed', err),
      },
    );
  };

  const handleDelete = () => {
    if (dialog?.kind !== 'delete') return;
    deleteMutation.mutate(dialog.user.id, {
      onSuccess: () => setDialog(null),
      onError: (err) => console.error('delete failed', err),
    });
  };

  const resetAndSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const mutationBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    statusMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Utilisateurs
          </h1>
          <p className="mt-0.5 text-[13px] text-text-tertiary">
            Gérez les comptes de votre équipe CRM.
          </p>
        </div>
        <Button
          leadingIcon={<Plus className="h-4 w-4" />}
          onClick={() => setDialog({ kind: 'create' })}
        >
          Nouvel utilisateur
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 lg:flex-row lg:items-center">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un utilisateur…"
            value={search}
            onChange={(e) => resetAndSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 lg:flex">
          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            options={ROLE_FILTER_OPTIONS}
            aria-label="Filtrer par rôle"
          />
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={STATUS_FILTER_OPTIONS}
            aria-label="Filtrer par statut"
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={SORT_OPTIONS}
            aria-label="Trier par"
          />
          <Button
            variant="outline"
            size="md"
            onClick={() =>
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
            aria-label="Inverser le tri"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface py-16 text-center">
          <UsersIcon className="h-8 w-8 text-text-tertiary" />
          <p className="text-[14px] text-text-secondary">
            Impossible de charger les utilisateurs.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Réessayer
          </Button>
        </div>
      ) : (data?.items.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface py-16 text-center">
          <UsersIcon className="h-8 w-8 text-text-tertiary" />
          <p className="text-[14px] text-text-secondary">
            Aucun utilisateur ne correspond à votre recherche.
          </p>
          <Button variant="outline" onClick={() => resetAndSearch('')}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <UsersTable
          users={data?.items ?? []}
          onView={(user) => setDialog({ kind: 'details', user })}
          onEdit={(user) => setDialog({ kind: 'edit', user })}
          onToggleStatus={(user) => setDialog({ kind: 'toggle', user })}
          onDelete={(user) => setDialog({ kind: 'delete', user })}
        />
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-text-tertiary">
            {data.total} utilisateur{data.total > 1 ? 's' : ''}
          </p>
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modals */}
      <UserFormModal
        open={dialog?.kind === 'create' || dialog?.kind === 'edit'}
        user={dialog?.kind === 'edit' ? dialog.user : null}
        isSubmitting={mutationBusy}
        onClose={() => setDialog(null)}
        onSubmit={(input) =>
          dialog?.kind === 'edit'
            ? handleUpdate(input as UpdateManagedUserInput)
            : handleCreate(input as CreateManagedUserInput)
        }
      />

      <UserDetailsModal
        open={dialog?.kind === 'details'}
        user={dialog?.kind === 'details' ? dialog.user : null}
        onClose={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.kind === 'toggle'}
        title={
          dialog?.kind === 'toggle' && dialog.user.isActive
            ? 'Désactiver cet utilisateur ?'
            : 'Activer cet utilisateur ?'
        }
        description={
          dialog?.kind === 'toggle'
            ? `${dialog.user.firstName} ${dialog.user.lastName} ${
                dialog.user.isActive
                  ? "ne pourra plus se connecter une fois désactivé."
                  : 'pourra se connecter une fois activé.'
              }`
            : undefined
        }
        confirmLabel={
          dialog?.kind === 'toggle' && dialog.user.isActive
            ? 'Désactiver'
            : 'Activer'
        }
        variant={dialog?.kind === 'toggle' && dialog.user.isActive ? 'danger' : 'primary'}
        isLoading={statusMutation.isPending}
        onClose={() => setDialog(null)}
        onConfirm={handleToggleStatus}
      />

      <ConfirmDialog
        open={dialog?.kind === 'delete'}
        title="Supprimer cet utilisateur ?"
        description={
          dialog?.kind === 'delete'
            ? `${dialog.user.firstName} ${dialog.user.lastName} sera définitivement supprimé. Cette action est irréversible.`
            : undefined
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
