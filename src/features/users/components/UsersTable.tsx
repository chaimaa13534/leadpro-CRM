import { motion } from 'framer-motion';
import {
  Eye,
  Pencil,
  ShieldOff,
  ShieldCheck,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { roleBadgeVariant, roleLabel } from '../constants/user-roles.constants';
import type { ManagedUser } from '../types/user-management.types';

interface UsersTableProps {
  users: ManagedUser[];
  onView: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onToggleStatus: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

/**
 * Responsive data table of managed users with row actions.
 * On small screens the table collapses into stacked cards.
 */
export function UsersTable({
  users,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/60">
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onView={onView}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onView={onView}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Header cell ── */
function TableHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={
        'px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary ' +
        (className ?? '')
      }
    >
      {children}
    </th>
  );
}

/* ── Desktop row ── */
function UserTableRow({
  user,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  user: ManagedUser;
  onView: (u: ManagedUser) => void;
  onEdit: (u: ManagedUser) => void;
  onToggleStatus: (u: ManagedUser) => void;
  onDelete: (u: ManagedUser) => void;
}) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group transition-colors hover:bg-surface-hover/50"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            src={user.avatar ?? undefined}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-text-primary">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-[12px] text-text-tertiary">
              {user.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={roleBadgeVariant(user.role)}>
          {roleLabel(user.role)}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={user.isActive ? 'success' : 'danger'} dot size="sm">
          {user.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-[13px] text-text-secondary">
        {user.phone ?? '—'}
      </td>
      <td className="px-4 py-3 text-[13px] text-text-secondary">
        {formatDate(user.createdAt, 'short')}
      </td>
      <td className="px-4 py-3">
        <RowActions
          user={user}
          onView={onView}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      </td>
    </motion.tr>
  );
}

/* ── Mobile card ── */
function UserCard({
  user,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  user: ManagedUser;
  onView: (u: ManagedUser) => void;
  onEdit: (u: ManagedUser) => void;
  onToggleStatus: (u: ManagedUser) => void;
  onDelete: (u: ManagedUser) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-xl border border-border bg-surface p-4"
    >
      <div className="flex items-center gap-3">
        <Avatar
          firstName={user.firstName}
          lastName={user.lastName}
          src={user.avatar ?? undefined}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-text-primary">
            {user.firstName} {user.lastName}
          </p>
          <p className="flex items-center gap-1 truncate text-[12px] text-text-tertiary">
            <Mail className="h-3 w-3 shrink-0" />
            {user.email}
          </p>
        </div>
        <Badge dot variant={user.isActive ? 'success' : 'danger'}>
          {user.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={roleBadgeVariant(user.role)}>
            {roleLabel(user.role)}
          </Badge>
          {user.phone && (
            <span className="flex items-center gap-1 text-[12px] text-text-tertiary">
              <Phone className="h-3 w-3" />
              {user.phone}
            </span>
          )}
        </div>
        <RowActions
          user={user}
          onView={onView}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      </div>
    </motion.div>
  );
}

/* ── Shared row action buttons ── */
function RowActions({
  user,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  user: ManagedUser;
  onView: (u: ManagedUser) => void;
  onEdit: (u: ManagedUser) => void;
  onToggleStatus: (u: ManagedUser) => void;
  onDelete: (u: ManagedUser) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onView(user)}
        aria-label="Voir les détails"
        title="Détails"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onEdit(user)}
        aria-label="Modifier"
        title="Modifier"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onToggleStatus(user)}
        aria-label={user.isActive ? 'Désactiver' : 'Activer'}
        title={user.isActive ? 'Désactiver' : 'Activer'}
      >
        {user.isActive ? (
          <ShieldOff className="h-4 w-4 text-warning-400" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-success-400" />
        )}
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onDelete(user)}
        aria-label="Supprimer"
        title="Supprimer"
      >
        <Trash2 className="h-4 w-4 text-danger-400" />
      </Button>
    </div>
  );
}
